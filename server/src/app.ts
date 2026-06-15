import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/auth';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import salesRoutes from './routes/sales';
import dashboardRoutes from './routes/dashboard';

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173'];

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// public routes
app.use('/api/auth', authRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// protected routes
app.use('/api/products', authenticate, productRoutes);
app.use('/api/categories', authenticate, categoryRoutes);
app.use('/api/sales', authenticate, salesRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);

app.use(errorHandler);

export default app;