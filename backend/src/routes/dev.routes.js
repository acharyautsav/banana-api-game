// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Temporary Development Routes
 * Used to test third-party integrations (Banana API) during task verification.
 */
import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { bananaService } from '../services/bananaService.js';

const router = Router();

// TODO: Remove this temporary dev route in F2-T2 as specified in plan.md / task-prompts.md
router.get('/puzzle', protect, async (req, res) => {
  try {
    const puzzle = await bananaService.getPuzzle();
    // Exclusively return questionUrl; NEVER disclose the secret solution
    return res.status(200).json({
      questionUrl: puzzle.questionUrl,
    });
  } catch (error) {
    return res.status(502).json({
      message: error.message || 'Puzzle service unavailable, please try again',
    });
  }
});

export default router;
