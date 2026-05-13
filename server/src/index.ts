import app from './app';
import { env } from './config/env';
import db from './config/db';

const start = async () => {
  try {
    await db.raw('SELECT 1'); // test DB connection
    console.log('Database connected');

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
};

start();