// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Game Controller
 * Manages game session lifecycle: initialization, puzzle fetching, and round setup.
 */
import { Game } from '../models/Game.js';
import { bananaService } from '../services/bananaService.js';

/**
 * Start a new game session
 * Creates a new Game record in MongoDB, fetches puzzle 1 from the external Banana API,
 * stores the secret solution strictly on the server, and returns the puzzle question to the player.
 *
 * Response format:
 * {
 *   gameId: string,
 *   round: number (1-based),
 *   totalRounds: number (5),
 *   question: string (image URL)
 * }
 */
export const startGame = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch initial round puzzle from third-party Banana API
    let puzzle;
    try {
      puzzle = await bananaService.getPuzzle();
    } catch (apiError) {
      console.error('Failed to fetch initial puzzle from Banana API:', apiError.message);
      return res.status(502).json({
        message: 'Puzzle service unavailable, please try again',
      });
    }

    // Initialize game document with round 0
    const initialRound = {
      questionUrl: puzzle.questionUrl,
      solution: puzzle.solution, // Saved on server; never sent in client response
      startedAt: new Date(),
      points: 0,
    };

    const game = await Game.create({
      user: userId,
      status: 'active',
      currentRound: 0,
      totalRounds: 5,
      score: 0,
      rounds: [initialRound],
      startedAt: new Date(),
    });

    // Return game details and question URL to client (NEVER the solution)
    return res.status(201).json({
      gameId: game._id,
      round: 1, // Displayed as 1-based to the player
      totalRounds: game.totalRounds,
      question: puzzle.questionUrl,
    });
  } catch (error) {
    console.error('Start game error:', error);
    return res.status(500).json({
      message: 'Internal server error starting game',
    });
  }
};
