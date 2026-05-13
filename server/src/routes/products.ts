import { Router } from 'express';
import db from '../config/db';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const products = await db('products')
      .join('categories', 'products.category_id', 'categories.id')
      .select('products.*', 'categories.name as category_name');
    res.json({ data: products });
  } catch (err) {
    next(err);
  }
});

export default router;
