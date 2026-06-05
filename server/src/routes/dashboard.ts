import { Router } from 'express';
import db from '../config/db';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    // 1. Revenue totals
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayRevenue] = await db('sales')
      .where('sold_at', '>=', today)
      .sum('total_amount as total');

    const [weekRevenue] = await db('sales')
      .where('sold_at', '>=', startOfWeek)
      .sum('total_amount as total');

    const [monthRevenue] = await db('sales')
      .where('sold_at', '>=', startOfMonth)
      .sum('total_amount as total');

    // 2. Low stock products
    const lowStock = await db('products')
      .whereRaw('stock_qty <= low_stock_threshold')
      .select('id', 'name', 'sku', 'stock_qty', 'low_stock_threshold')
      .orderBy('stock_qty', 'asc');

    // 3. Top sellers
    const topSellers = await db('sale_items')
      .join('products', 'sale_items.product_id', 'products.id')
      .groupBy('sale_items.product_id', 'products.name')
      .select(
        'sale_items.product_id',
        'products.name as product_name',
        db.raw('SUM(sale_items.quantity) as total_sold'),
        db.raw('SUM(sale_items.quantity * sale_items.unit_price) as total_revenue')
      )
      .orderBy('total_revenue', 'desc')
      .limit(5);

    res.json({
      data: {
        revenue: {
          today: Number(todayRevenue.total) || 0,
          this_week: Number(weekRevenue.total) || 0,
          this_month: Number(monthRevenue.total) || 0,
        },
        low_stock_products: lowStock,
        top_sellers: topSellers,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;