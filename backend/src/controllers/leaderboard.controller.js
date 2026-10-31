// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * VIRTUAL IDENTITY & DATA AGGREGATION: Leaderboard Controller
 * ============================================================================
 * Performs high-performance MongoDB aggregation across finished game sessions:
 * 1. Filtering: Matches only games with status === 'finished'
 * 2. Grouping: Aggregates by user ID, computing maximum score and total games played
 * 3. Sorting & Limiting: Ranks top scores in descending order, capped at top 10
 * 4. Identity Join: Joins with 'users' collection to retrieve display usernames
 * 5. Data Privacy & Security: Explicitly projects ONLY username, bestScore, and
 *    gamesPlayed—strictly omitting emails, password hashes, and user IDs.
 * ============================================================================
 */
import { Game } from '../models/Game.js';

/**
 * Get top 10 players on the global leaderboard
 * Route: GET /api/leaderboard
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const topPlayers = await Game.aggregate([
      // Step 1: Only consider finished games
      {
        $match: {
          status: 'finished',
        },
      },
      // Step 2: Group by user, compute best score and total games completed
      {
        $group: {
          _id: '$user',
          bestScore: { $max: '$score' },
          gamesPlayed: { $sum: 1 },
        },
      },
      // Step 3: Sort by best score descending (with gamesPlayed as secondary)
      {
        $sort: {
          bestScore: -1,
          gamesPlayed: -1,
        },
      },
      // Step 4: Limit to top 10 players
      {
        $limit: 10,
      },
      // Step 5: Join with User collection to resolve username
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDoc',
        },
      },
      // Step 6: Flatten user document array
      {
        $unwind: '$userDoc',
      },
      // Step 7: Security projection - NEVER expose email or passwordHash
      {
        $project: {
          _id: 0,
          username: '$userDoc.username',
          bestScore: 1,
          gamesPlayed: 1,
        },
      },
    ]);

    // Assign dynamic rank indices (1 through 10)
    const leaderboard = topPlayers.map((player, index) => ({
      rank: index + 1,
      username: player.username,
      bestScore: player.bestScore,
      gamesPlayed: player.gamesPlayed,
    }));

    return res.status(200).json(leaderboard);
  } catch (error) {
    next(error);
  }
};
