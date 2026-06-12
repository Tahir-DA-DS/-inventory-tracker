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

router.patch('/:id', async (req, res, next) => {
  try {
    const { name } = z.object({ name: z.string().min(1) }).parse(req.body);
    const [category] = await db('categories')
      .where({ id: req.params.id })
      .update({ name })
      .returning('*');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ data: category });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await db('categories').where({ id: req.params.id }).delete();
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) { next(err); }
});

export default router;