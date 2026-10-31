// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Game Routes
 * Maps game lifecycle endpoints (/api/game) to game controller actions:
 * - POST /start: Initializes a new 5-round puzzle session
 * - GET /history: Retrieves user's finished games sorted newest first
 * - POST /:id/answer: Submits an answer for the current round, evaluates score,
 *   and advances to the next round or finishes the game
 * - GET /:id/result: Retrieves finished game result with round breakdown and revealed solutions
 *
 * All routes are protected by JWT cookie auth middleware.
 */
import { Router } from 'express';
import {
  startGame,
  answerRound,
  getGameResult,
  getGameHistory,
} from '../controllers/game.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Protected game lifecycle endpoints
router.post('/start', protect, startGame);
router.get('/history', protect, getGameHistory);
router.post('/:id/answer', protect, answerRound);
router.get('/:id/result', protect, getGameResult);

export default router;
