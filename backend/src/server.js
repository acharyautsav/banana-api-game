// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Server Entry Point
 * Initializes database connection, registers backend event listeners,
 * and starts the Express HTTP server.
 */
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { registerGameEventListeners } from './events/listeners.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Register event-driven listeners
    registerGameEventListeners();

    // 3. Start listening on configured port
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
