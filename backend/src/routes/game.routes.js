// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Game Routes
 * Maps game lifecycle endpoints (/api/game) to game controller actions.
 * All routes are protected by auth middleware.
 */
import { Router } from 'express';
import { startGame } from '../controllers/game.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Protected game lifecycle endpoints
router.post('/start', protect, startGame);

export default router;
