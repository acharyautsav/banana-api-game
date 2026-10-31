// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Express Application Setup
 * Configures global middlewares:
 * - CORS with credentials enabled for HTTP-only cookies
 * - JSON body parser
 * - Cookie parser for reading incoming JWT cookies
 * Mounts routes under /api/auth and /api/game.
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import gameRoutes from './routes/game.routes.js';

const app = express();

// Enable CORS with credentials for cookie exchange
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body and cookie parsing middleware
app.use(express.json());
app.use(cookieParser());

// Mount application routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Health sanity check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Banana Puzzle Game API is running' });
});

export default app;
