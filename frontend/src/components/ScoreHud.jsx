// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * EVENT-DRIVEN PROGRAMMING THEME: Live Score HUD (Decoupled Component)
 * ============================================================================
 * Why an Event Bus decouples components:
 * ScoreHud does NOT receive any props from its parent (Game page).
 * Instead of relying on prop drilling or monolithic global context state,
 * ScoreHud directly listens to fine-grained domain events via `gameEvents`:
 * 1. `round:start`  -> Updates the round progression counter and resets streak on Round 1.
 * 2. `answer:submit` -> Updates cumulative score and increments/resets the streak counter.
 * 3. `round:timeout` -> Resets the streak counter on countdown expiration.
 * 4. `game:finish`  -> Locks final score when the game session concludes.
 *
 * This architecture achieves complete loose coupling: the Game page can alter its
 * internal state representations without breaking the HUD, and the HUD can be
 * mounted, unmounted, or relocated anywhere in the GUI hierarchy without modifying
 * any component props.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { gameEvents } from '../events/gameEvents';

export const ScoreHud = () => {
  const [hudState, setHudState] = useState(() => {
    // Synchronize with any cached initial event data if mounted after round:start
    const latestStart = gameEvents.getLatest('round:start');
    return {
      score: 0,
      round: latestStart?.round || 1,
      totalRounds: latestStart?.totalRounds || 5,
      streak: 0,
    };
  });

  useEffect(() => {
    /**
     * Handler for 'round:start' event
     * Updates round progression and resets counters on game start (Round 1).
     */
    const handleRoundStart = (data) => {
      setHudState((prev) => ({
        ...prev,
        round: data.round || prev.round,
        totalRounds: data.totalRounds || prev.totalRounds,
        score: data.round === 1 ? 0 : prev.score,
        streak: data.round === 1 ? 0 : prev.streak,
      }));
    };

    /**
     * Handler for 'answer:submit' event
     * Updates cumulative score and maintains answer streak counter.
     */
    const handleAnswerSubmit = (data) => {
      setHudState((prev) => ({
        ...prev,
        score: data.score !== undefined ? data.score : prev.score + (data.points || 0),
        streak: data.correct ? prev.streak + 1 : 0,
      }));
    };

    /**
     * Handler for 'round:timeout' event
     * A timeout breaks the player's active answer streak.
     */
    const handleRoundTimeout = () => {
      setHudState((prev) => ({
        ...prev,
        streak: 0,
      }));
    };

    /**
     * Handler for 'game:finish' event
     * Finalizes the game score.
     */
    const handleGameFinish = (data) => {
      if (data.score !== undefined) {
        setHudState((prev) => ({
          ...prev,
          score: data.score,
        }));
      }
    };

    // Subscribe to all game lifecycle events on the bus
    const unsubStart = gameEvents.on('round:start', handleRoundStart);
    const unsubSubmit = gameEvents.on('answer:submit', handleAnswerSubmit);
    const unsubTimeout = gameEvents.on('round:timeout', handleRoundTimeout);
    const unsubFinish = gameEvents.on('game:finish', handleGameFinish);

    // Clean up event listeners on unmount to prevent memory leaks
    return () => {
      unsubStart();
      unsubSubmit();
      unsubTimeout();
      unsubFinish();
    };
  }, []);

  const { score, round, totalRounds, streak } = hudState;

  return (
    <div
      className="w-full bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded-xl p-3 sm:p-4 shadow-lg"
      aria-label="Live Game Statistics HUD"
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
        {/* 1. Live Score Display */}
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            Score
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-yellow-400 text-xs sm:text-sm">🏆</span>
            <span className="text-base sm:text-xl font-black font-mono text-yellow-400">
              {score}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">pts</span>
          </div>
        </div>

        {/* 2. Round Progress Display */}
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            Round
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-indigo-400 text-xs sm:text-sm">🎯</span>
            <span className="text-base sm:text-xl font-black font-mono text-white">
              {round}
            </span>
            <span className="text-xs text-slate-500 font-mono">/</span>
            <span className="text-xs text-slate-400 font-mono">{totalRounds}</span>
          </div>
        </div>

        {/* 3. Streak Counter Display */}
        <div
          className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
            streak >= 2
              ? 'bg-amber-950/50 border-amber-500/60 shadow-sm shadow-amber-500/20'
              : 'bg-slate-900/60 border-slate-800/80'
          }`}
        >
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
            Streak
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className={`text-xs sm:text-sm transition-transform ${
                streak > 0 ? 'scale-110' : 'opacity-40 grayscale'
              }`}
            >
              🔥
            </span>
            <span
              className={`text-base sm:text-xl font-black font-mono ${
                streak >= 2
                  ? 'text-amber-400 animate-pulse'
                  : streak === 1
                  ? 'text-amber-300'
                  : 'text-slate-400'
              }`}
            >
              {streak}
            </span>
            {streak >= 3 && (
              <span className="hidden sm:inline-block text-[9px] uppercase px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold ml-0.5">
                On Fire!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreHud;
