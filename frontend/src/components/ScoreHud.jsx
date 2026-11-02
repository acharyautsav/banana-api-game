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
import { Trophy, Flame } from 'lucide-react';
import { Card } from './ui/Card';
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
      className="w-full grid grid-cols-3 gap-2 sm:gap-3"
      aria-label="Live Game Statistics HUD"
    >
      {/* 1. Score Chip */}
      <Card bodyClassName="p-3 sm:p-4 flex flex-col justify-between h-full">
        <span className="font-ui text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted">
          Score
        </span>
        <div className="flex items-baseline gap-1 sm:gap-1.5 mt-1 sm:mt-2">
          <Trophy
            className="w-5 h-5 sm:w-6 sm:h-6 text-banana shrink-0 self-center"
            aria-hidden="true"
          />
          <span className="font-ui font-bold text-2xl sm:text-3xl text-text leading-none">
            {score}
          </span>
          <span className="font-ui text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider">
            PTS
          </span>
        </div>
      </Card>

      {/* 2. Round Progress Chip */}
      <Card bodyClassName="p-3 sm:p-4 flex flex-col justify-between h-full">
        <span className="font-ui text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted">
          Round
        </span>
        <div className="flex items-baseline gap-0.5 sm:gap-1 mt-1 sm:mt-2">
          <span className="font-ui font-bold text-2xl sm:text-3xl text-text leading-none">
            {round}
          </span>
          <span className="font-ui text-sm sm:text-base font-normal text-muted">
            /{totalRounds}
          </span>
        </div>
        {/* 5 progress pips */}
        <div
          className="grid grid-cols-5 gap-1 sm:gap-1.5 mt-2 sm:mt-2.5 w-full"
          aria-label={`Round ${round} of ${totalRounds}`}
        >
          {Array.from({ length: totalRounds }).map((_, idx) => {
            const step = idx + 1;
            let pipColor = 'bg-line';
            if (step < round) {
              pipColor = 'bg-jungle';
            } else if (step === round) {
              pipColor = 'bg-banana shadow-glow-banana';
            }
            return (
              <span
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${pipColor}`}
              />
            );
          })}
        </div>
      </Card>

      {/* 3. Streak Counter Chip */}
      <Card
        className={`transition-all duration-200 ${
          streak >= 2 ? 'border-banana-deep shadow-glow-banana' : ''
        }`}
        bodyClassName="p-3 sm:p-4 flex flex-col justify-between h-full"
      >
        <span className="font-ui text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted">
          Streak
        </span>
        <div className="flex items-baseline gap-1 sm:gap-1.5 mt-1 sm:mt-2">
          <Flame
            className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 self-center transition-colors ${
              streak >= 2
                ? 'text-banana-deep fill-banana-deep'
                : streak > 0
                ? 'text-banana'
                : 'text-muted'
            }`}
            aria-hidden="true"
          />
          <span
            className={`font-ui font-bold text-2xl sm:text-3xl leading-none ${
              streak >= 2 ? 'text-banana-deep' : 'text-text'
            }`}
          >
            {streak}
          </span>
        </div>
      </Card>
    </div>
  );
};

export default ScoreHud;
