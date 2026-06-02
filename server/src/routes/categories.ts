import { Router } from 'express';
import db from '../config/db';
import { z } from 'zod';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await db('categories').select('*');
    res.json({ data: categories });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name } = z.object({ name: z.string().min(1) }).parse(req.body);
    const [category] = await db('categories').insert({ name }).returning('*');
    res.status(201).json({ data: category });
  } catch (err) { next(err); }
});

export default router;