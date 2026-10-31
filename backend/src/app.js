// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Express Application Setup
 * Configures global middlewares (CORS, JSON body parsing) and mounts API routes.
 */
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

// Root route for sanity check
app.get('/', (req, res) => {
  res.json({ message: 'Banana Puzzle Game API is running' });
});

export default app;
