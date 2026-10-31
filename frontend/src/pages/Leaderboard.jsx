// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * VIRTUAL IDENTITY & LEADERBOARD: Global Leaderboard Screen
 * ============================================================================
 * Displays the top 10 players based on high-performance MongoDB aggregation:
 * 1. Fetches ranking data via GET /api/leaderboard on mount.
 * 2. Visual Hierarchy:
 *    - Distinct medal badges for Top 3 rankings (🥇 Gold, 🥈 Silver, 🥉 Bronze).
 *    - Highlights the currently authenticated player's row if present in Top 10.
 * 3. Privacy Preservation:
 *    - Shows strictly sanitized public identifiers (username, bestScore, gamesPlayed).
 *    - Never requests or renders emails or credentials.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch leaderboard rankings on mount
   */
  useEffect(() => {
    let isMounted = true;

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await client.get('/leaderboard');
        if (isMounted) {
          setLeaderboard(response.data || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch leaderboard:', err);
          setError(
            err.response?.data?.message ||
            err.message ||
            'Unable to load global rankings at this time.'
          );
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Leaderboard Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-4xl shrink-0">
              🏆
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Global Leaderboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Top 10 players ranked by highest single-game score
              </p>
            </div>
          </div>

          <Link
            to="/game"
            className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm shadow-md transition transform active:scale-95 cursor-pointer"
          >
            Play Game
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-300">
              Aggregating player rankings from MongoDB...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 rounded-2xl bg-red-950/60 border border-red-900/80 text-center space-y-3">
            <span className="text-4xl block" role="img" aria-label="warning">⚠️</span>
            <p className="text-sm text-red-300 font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-red-800/60 hover:bg-red-700 text-white text-xs font-bold transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty Leaderboard State */}
        {!loading && !error && leaderboard.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <span className="text-5xl block" role="img" aria-label="banana">🍌</span>
            <h2 className="text-xl font-bold text-white">No Scores Yet</h2>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Be the first player to finish a 5-round puzzle challenge and take the #1 spot!
            </p>
            <div className="pt-2">
              <Link
                to="/game"
                className="inline-block px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-sm transition"
              >
                Start First Game
              </Link>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        {!loading && !error && leaderboard.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-4 px-4 sm:px-6 w-20 text-center">Rank</th>
                    <th className="py-4 px-4 sm:px-6">Player</th>
                    <th className="py-4 px-4 sm:px-6 text-right">Best Score</th>
                    <th className="py-4 px-4 sm:px-6 text-right">Games Played</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {leaderboard.map((entry) => {
                    const isCurrentUser =
                      user?.username &&
                      entry.username?.toLowerCase() === user.username.toLowerCase();

                    // Medal icon for top 3 positions
                    const medal =
                      entry.rank === 1
                        ? '🥇'
                        : entry.rank === 2
                        ? '🥈'
                        : entry.rank === 3
                        ? '🥉'
                        : null;

                    return (
                      <tr
                        key={entry.rank}
                        className={`transition-colors ${
                          isCurrentUser
                            ? 'bg-yellow-400/10 border-l-4 border-l-yellow-400 font-semibold'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        {/* Rank Column */}
                        <td className="py-4 px-4 sm:px-6 text-center font-mono">
                          {medal ? (
                            <span className="text-xl" title={`Rank ${entry.rank}`}>
                              {medal}
                            </span>
                          ) : (
                            <span className="font-bold text-slate-400">
                              #{entry.rank}
                            </span>
                          )}
                        </td>

                        {/* Username Column */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                isCurrentUser ? 'text-yellow-300' : 'text-slate-100'
                              }`}
                            >
                              {entry.username}
                            </span>
                            {isCurrentUser && (
                              <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-[10px] font-bold font-mono">
                                You
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Best Score Column */}
                        <td className="py-4 px-4 sm:px-6 text-right font-mono">
                          <span className="text-base font-black text-yellow-400">
                            {entry.bestScore}
                          </span>
                          <span className="text-xs text-slate-500 ml-1">pts</span>
                        </td>

                        {/* Games Played Column */}
                        <td className="py-4 px-4 sm:px-6 text-right font-mono text-slate-300">
                          {entry.gamesPlayed}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer Explanatory Note */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 text-center sm:text-right">
              Aggregated across all verified Banana API game completions.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
