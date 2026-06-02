import { Router } from 'express';
import db from '../config/db';
import { z } from 'zod';

const router = Router();

const SaleSchema = z.object({
  notes: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    unit_price: z.number().positive(),
  })).min(1),
});

// POST /api/sales — atomic sale + stock deduction
router.post('/', async (req, res, next) => {
  try {
    const body = SaleSchema.parse(req.body);

    const result = await db.transaction(async (trx) => {
      // 1. check stock for every item
      for (const item of body.items) {
        const product = await trx('products').where({ id: item.product_id }).first();
        if (!product) throw new Error(`Product ${item.product_id} not found`);
        if (product.stock_qty < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock_qty}`);
        }
      }

      // 2. calculate total
      const total = body.items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);

      // 3. insert sale
      const [sale] = await trx('sales')
        .insert({ total_amount: total, notes: body.notes })
        .returning('*');

      // 4. insert sale items
      await trx('sale_items').insert(
        body.items.map((i) => ({ ...i, sale_id: sale.id }))
      );

      // 5. deduct stock
      for (const item of body.items) {
        await trx('products')
          .where({ id: item.product_id })
          .decrement('stock_qty', item.quantity);
      }

      return sale;
    });

    res.status(201).json({ data: result });
  } catch (err) { next(err); }
});

// GET /api/sales — history with optional date filter
router.get('/', async (req, res, next) => {
  try {
    const { from, to } = req.query;
    let query = db('sales').select('*').orderBy('sold_at', 'desc');
    if (from) query = query.where('sold_at', '>=', from as string);
    if (to) query = query.where('sold_at', '<=', to as string);
    const sales = await query;
    res.json({ data: sales });
  } catch (err) { next(err); }
});

export default router;