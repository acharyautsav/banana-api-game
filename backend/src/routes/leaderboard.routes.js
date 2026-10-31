// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Leaderboard Routes
 * Exposes endpoints for the top 10 player rankings:
 * - GET /: Returns top 10 players ranked by highest score
 */
import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboard.controller.js';

const router = Router();

// Publicly readable leaderboard route
router.get('/', getLeaderboard);

export default router;
