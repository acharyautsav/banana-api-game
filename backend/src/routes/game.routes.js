// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Game Routes
 * Maps game lifecycle endpoints (/api/game) to game controller actions:
 * - POST /start: Initializes a new 5-round puzzle session
 * - POST /:id/answer: Submits an answer for the current round, evaluates score,
 *   and advances to the next round or finishes the game
 *
 * All routes are protected by JWT cookie auth middleware.
 */
import { Router } from 'express';
import { startGame, answerRound } from '../controllers/game.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Protected game lifecycle endpoints
router.post('/start', protect, startGame);
router.post('/:id/answer', protect, answerRound);

export default router;
