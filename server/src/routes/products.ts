import { Router } from 'express';
import db from '../config/db';
import { z } from 'zod';

const router = Router();

const ProductSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().positive(),
  stock_qty: z.number().int().min(0),
  low_stock_threshold: z.number().int().min(0).default(10),
});


// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const products = await db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .select('products.*', 'categories.name as category_name');
    res.json({ data: products });
  } catch (err) { next(err); }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const body = ProductSchema.parse(req.body);
    const [product] = await db('products').insert(body).returning('*');
    res.status(201).json({ data: product });
  } catch (err) { next(err); }
});

// PATCH /api/products/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const UpdateSchema = ProductSchema.partial();
    const body = UpdateSchema.parse(req.body);
    const [product] = await db('products')
      .where({ id: req.params.id })
      .update({ ...body, updated_at: db.fn.now() })
      .returning('*');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ data: product });
  } catch (err) { next(err); }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await db('products').where({ id: req.params.id }).delete();
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) { next(err); }
});

export default router;