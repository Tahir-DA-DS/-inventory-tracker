import { Router } from 'express';
import db from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env';

const router = Router();

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = AuthSchema.parse(req.body);

    const existing = await db('users').where({ email }).first();
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const [user] = await db('users')
      .insert({ email, password: hashed })
      .returning(['id', 'email', 'role']);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwt.secret,
      { expiresIn:"1d" }
    );

    res.status(201).json({ data: { token, user } });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = AuthSchema.parse(req.body);

    const user = await db('users').where({ email }).first();
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.jwt.secret,
      { expiresIn:"1d" }
    );

    res.json({ data: { token, user: { id: user.id, email: user.email, role: user.role } } });
  } catch (err) {
    next(err);
  }
});

export default router;