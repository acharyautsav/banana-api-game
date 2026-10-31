// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Express Application Setup
 * Configures global middlewares:
 * - CORS with credentials enabled for HTTP-only cookies
 * - JSON body parser
 * - Cookie parser for reading incoming JWT cookies
 * Mounts routes under /api/auth and temporary dev routes under /api/dev.
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import devRoutes from './routes/dev.routes.js';

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

// Mount authentication routes
app.use('/api/auth', authRoutes);

// Mount temporary dev routes (TODO: remove in F2-T2)
app.use('/api/dev', devRoutes);

// Health sanity check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Banana Puzzle Game API is running' });
});

export default app;
