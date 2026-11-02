// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE: ResultHero Component
 * ============================================================================
 * Prominent celebratory summary card for completed game sessions:
 * - Brand heading with Logo and Trophy icon tile.
 * - Dynamic letter grade tile (S/A/B/C/D) computed from accuracy percentage.
 * - Tactile score count-up animation (900ms cubic ease-out, reduced-motion safe).
 * - Side-by-side stat metrics: Accuracy (Target icon) & Success Rate (SVG ring).
 * - Full-width action buttons: "PLAY AGAIN" (primary) & "VIEW LEADERBOARD" (secondary).
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Trophy, Target, RotateCcw } from 'lucide-react';
import { Logo, Button, Card } from './ui';

/**
 * Custom hook to animate numeric count-up from 0 to target value
 */
const useCountUp = (target = 0, duration = 900) => {
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(() => (shouldReduceMotion ? target : 0));

  useEffect(() => {
    if (shouldReduceMotion) return;

    let startTime = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out cubic calculation
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(easeProgress * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration, shouldReduceMotion]);

  return count;
};

/**
 * Calculate grade letter and color tokens based on success percentage
 */
const getGradeConfig = (percentage) => {
  if (percentage >= 100) {
    return {
      grade: 'S',
      styles: 'text-banana border-banana shadow-glow-banana bg-banana/10',
    };
  }
  if (percentage >= 80) {
    return {
      grade: 'A',
      styles: 'text-banana border-banana shadow-glow-banana bg-banana/10',
    };
  }
  if (percentage >= 60) {
    return {
      grade: 'B',
      styles: 'text-jungle border-jungle shadow-glow-jungle bg-jungle/10',
    };
  }
  if (percentage >= 40) {
    return {
      grade: 'C',
      styles: 'text-cyan border-cyan bg-cyan/10',
    };
  }
  return {
    grade: 'D',
    styles: 'text-coral border-coral shadow-glow-coral bg-coral/10',
  };
};

export const ResultHero = ({
  score = 0,
  correctCount = 0,
  totalRounds = 5,
  onPlayAgain,
  onViewLeaderboard,
}) => {
  const displayScore = useCountUp(score, 900);
  const successRate = totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0;
  const gradeConfig = getGradeConfig(successRate);

  // SVG Progress Ring calculations (radius 18, circumference ~113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (circumference * successRate) / 100;

  return (
    <Card
      accentTop
      glow="banana"
      className="w-full text-center"
      bodyClassName="p-6 sm:p-8 flex flex-col items-center space-y-6"
    >
      {/* 1. Brand Mark & Trophy Tile */}
      <div className="flex items-center justify-center gap-3">
        <Logo size="md" />
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-banana/10 border border-banana/30 flex items-center justify-center text-banana shrink-0 shadow-sm">
          <Trophy className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      {/* 2. Headline & Subtitle */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl text-text tracking-wide uppercase leading-tight">
          GAME COMPLETE
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1.5 font-sans max-w-md mx-auto">
          Review your answers and the verified Banana API solutions below.
        </p>
      </div>

      {/* 3. Performance Grade Badge Tile */}
      <div className="flex flex-col items-center justify-center pt-1">
        <div
          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 flex items-center justify-center select-none ${gradeConfig.styles}`}
        >
          <span className="font-display text-4xl sm:text-5xl leading-none">
            {gradeConfig.grade}
          </span>
        </div>
        <span className="font-ui text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted mt-2">
          GRADE
        </span>
      </div>

      {/* 4. Final Score Display */}
      <div className="flex flex-col items-center justify-center py-1">
        <span className="font-ui text-[11px] sm:text-xs font-bold uppercase tracking-wider text-muted">
          FINAL SCORE
        </span>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-display text-5xl sm:text-6xl text-banana leading-none select-none">
            {displayScore}
          </span>
          <span className="font-ui text-sm sm:text-base font-bold text-muted uppercase tracking-wider">
            PTS
          </span>
        </div>
      </div>

      {/* 5. Stat Cards Grid (Accuracy & Success Rate) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg mx-auto">
        {/* Accuracy Card */}
        <div className="p-4 rounded-xl bg-raised border border-line flex items-center justify-between text-left shadow-sm">
          <div>
            <span className="font-ui text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted block">
              ACCURACY
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-ui font-bold text-2xl sm:text-3xl text-text leading-none">
                {correctCount}
              </span>
              <span className="font-ui text-sm sm:text-base text-muted font-normal">
                / {totalRounds}
              </span>
            </div>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-surface border border-line flex items-center justify-center text-banana shrink-0">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
          </div>
        </div>

        {/* Success Rate Card with SVG Progress Ring */}
        <div className="p-4 rounded-xl bg-raised border border-line flex items-center justify-between text-left shadow-sm">
          <div>
            <span className="font-ui text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted block">
              SUCCESS RATE
            </span>
            <div className="mt-1">
              <span className="font-ui font-bold text-2xl sm:text-3xl text-jungle leading-none">
                {successRate}%
              </span>
            </div>
          </div>

          {/* SVG Progress Ring */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
            <svg
              className="w-11 h-11 sm:w-12 sm:h-12 -rotate-90 select-none"
              viewBox="0 0 44 44"
              aria-label={`Success rate circle ${successRate}%`}
            >
              {/* Background Track */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-line"
              />
              {/* Progress Fill */}
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                className="text-jungle transition-all duration-1000 ease-out"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 6. Action Buttons Row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-lg mx-auto">
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:flex-1"
          leftIcon={<RotateCcw className="w-5 h-5" />}
          onClick={onPlayAgain}
        >
          PLAY AGAIN
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full sm:flex-1"
          leftIcon={<Trophy className="w-5 h-5" />}
          onClick={onViewLeaderboard}
        >
          VIEW LEADERBOARD
        </Button>
      </div>
    </Card>
  );
};

export default ResultHero;
