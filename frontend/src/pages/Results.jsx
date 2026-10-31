// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * INTEROPERABILITY & VIRTUAL IDENTITY: Game Results Screen
 * ============================================================================
 * Displays post-game review for a completed 5-round puzzle challenge:
 * 1. Post-Game Security Model:
 *    - The server withholds the Banana API secret solutions during active play.
 *    - Only once the game reaches 'finished' status does GET /api/game/:id/result
 *      disclose the true solutions to the authenticated game owner.
 * 2. Visual Round Breakdown:
 *    - Each round displays the puzzle image fetched from Marc Conrad's Banana API,
 *      the player's answer, the revealed correct solution, and speed bonus points.
 *    - Dynamic green/red styling clearly distinguishes correct from incorrect rounds.
 * 3. Navigation Controls:
 *    - "Play Again" routes to /game to start a new session.
 *    - "View Leaderboard" routes to /leaderboard to compare global rankings.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';

export const Results = () => {
  const { id: gameId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch game results on component mount
   */
  useEffect(() => {
    let isMounted = true;

    const fetchResult = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await client.get(`/game/${gameId}/result`);
        if (isMounted) {
          setResult(response.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load game results:', err);
          setError(
            err.response?.data?.message ||
            err.message ||
            'Unable to retrieve game results. The game may still be active or not exist.'
          );
          setLoading(false);
        }
      }
    };

    fetchResult();

    return () => {
      isMounted = false;
    };
  }, [gameId]);

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-300">
          Loading game results and answer breakdown...
        </p>
      </div>
    );
  }

  // 2. Error State
  if (error || !result) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-2xl space-y-4">
          <span className="text-5xl block" role="img" aria-label="error">⚠️</span>
          <h1 className="text-2xl font-black text-white">Result Not Available</h1>
          <p className="text-sm text-red-400 bg-red-950/60 border border-red-900/80 rounded-xl p-3">
            {error || 'Unable to load game breakdown.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/game')}
              className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-sm transition cursor-pointer"
            >
              Return to Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { score, correctCount, totalRounds, rounds } = result;
  const accuracyPercentage = Math.round((correctCount / totalRounds) * 100);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 text-4xl mb-1">
            🍌
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Game Completed!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review your answers and verified Banana API solutions below
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto">
            {/* Final Score */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
              <span className="text-xs uppercase font-semibold text-slate-400">
                Final Score
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black font-mono text-yellow-400">
                  {score}
                </span>
                <span className="text-xs text-slate-400 font-mono">pts</span>
              </div>
            </div>

            {/* Correct Answers */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
              <span className="text-xs uppercase font-semibold text-slate-400">
                Accuracy
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {correctCount}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ {totalRounds}</span>
              </div>
            </div>

            {/* Performance Rate */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center">
              <span className="text-xs uppercase font-semibold text-slate-400">
                Success Rate
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-2xl sm:text-3xl font-black font-mono ${
                    accuracyPercentage >= 80
                      ? 'text-emerald-400'
                      : accuracyPercentage >= 60
                      ? 'text-yellow-400'
                      : 'text-amber-400'
                  }`}
                >
                  {accuracyPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/game"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm shadow-lg shadow-yellow-400/20 transition transform active:scale-95 text-center cursor-pointer"
            >
              Play Again
            </Link>
            <Link
              to="/leaderboard"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition transform active:scale-95 text-center cursor-pointer"
            >
              View Leaderboard
            </Link>
          </div>
        </div>

        {/* Per-Round Breakdown List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Round Breakdown
            </h2>
            <span className="text-xs text-slate-400">
              {rounds?.length || 0} rounds total
            </span>
          </div>

          <div className="space-y-4">
            {rounds?.map((round, index) => {
              const roundNumber = index + 1;
              const isCorrect = round.correct;
              const isTimeout = round.yourAnswer === null || round.yourAnswer === undefined;

              return (
                <div
                  key={index}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-red-950/20 border-red-500/40'
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-center gap-5">
                    {/* Left: Round Badge & Puzzle Image */}
                    <div className="w-full md:w-56 shrink-0 flex flex-col items-center">
                      <div className="w-full flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400">
                          Round {roundNumber}
                        </span>
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded ${
                            isCorrect
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}
                        >
                          {isCorrect ? '✓ Correct' : isTimeout ? '⏰ Timed Out' : '✗ Incorrect'}
                        </span>
                      </div>

                      <div className="w-full bg-slate-950 rounded-xl p-2 border border-slate-800 flex items-center justify-center">
                        <img
                          src={round.questionUrl}
                          alt={`Round ${roundNumber} Puzzle`}
                          className="max-h-32 w-auto object-contain rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Right: Round Answer Evaluation Metrics */}
                    <div className="flex-1 w-full grid grid-cols-3 gap-3 text-center sm:text-left">
                      {/* Your Answer */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Your Answer
                        </span>
                        <div className="mt-1">
                          {round.yourAnswer !== null && round.yourAnswer !== undefined ? (
                            <span
                              className={`text-2xl font-black font-mono ${
                                isCorrect ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {round.yourAnswer}
                            </span>
                          ) : (
                            <span className="text-xs text-red-400 font-semibold italic">
                              None
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Correct Answer */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Solution
                        </span>
                        <div className="mt-1">
                          <span className="text-2xl font-black font-mono text-emerald-400">
                            {round.correctAnswer}
                          </span>
                        </div>
                      </div>

                      {/* Points Awarded */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Points
                        </span>
                        <div className="mt-1">
                          <span
                            className={`text-2xl font-black font-mono ${
                              round.points > 0 ? 'text-yellow-400' : 'text-slate-500'
                            }`}
                          >
                            +{round.points}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div className="pt-2 pb-6 flex items-center justify-center gap-4">
          <Link
            to="/game"
            className="text-xs font-semibold text-slate-400 hover:text-yellow-400 transition"
          >
            ← Back to Game Screen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
