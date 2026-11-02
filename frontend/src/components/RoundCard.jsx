// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE: RoundCard Component
 * ============================================================================
 * Detailed review card for an individual game round:
 * - Header with round index and status badge (Correct = jungle with Check, Incorrect = coral with X).
 * - Puzzle question thumbnail encased in rounded white panel with dark bezel.
 * - Triplet stat metrics: YOUR ANSWER, SOLUTION, and POINTS awarded.
 * - Dynamic 4px left accent border and glow matching round outcome.
 * ============================================================================
 */
import React from 'react';
import { Check, X } from 'lucide-react';
import { Card, Badge } from './ui';

export const RoundCard = ({ round, roundNumber }) => {
  const isCorrect = round?.correct;
  const isTimeout = round?.yourAnswer === null || round?.yourAnswer === undefined;

  const cardBorderClasses = isCorrect
    ? 'border-l-4 border-l-jungle border-jungle/40 shadow-sm shadow-jungle/10'
    : 'border-l-4 border-l-coral border-coral/40';

  return (
    <Card
      hoverLift
      className={`w-full ${cardBorderClasses}`}
      bodyClassName="p-4 sm:p-5 flex flex-col gap-4"
    >
      {/* 1. Header Strip */}
      <div className="flex items-center justify-between">
        <span className="font-ui text-xs sm:text-sm font-bold uppercase tracking-wider text-muted">
          ROUND {roundNumber}
        </span>
        <Badge
          variant={isCorrect ? 'jungle' : 'coral'}
          icon={
            isCorrect ? (
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            )
          }
          size="sm"
        >
          {isCorrect ? 'CORRECT' : isTimeout ? "TIME'S UP" : 'INCORRECT'}
        </Badge>
      </div>

      {/* 2. Puzzle Thumbnail in Dark Bezel */}
      <div className="w-full bg-raised rounded-xl p-2 border border-line flex items-center justify-center">
        <div className="w-full bg-white rounded-lg p-2 sm:p-3 flex items-center justify-center overflow-hidden min-h-[140px] sm:min-h-[170px]">
          <img
            src={round?.questionUrl}
            alt={`Puzzle for round ${roundNumber}`}
            className="max-h-36 sm:max-h-44 w-auto object-contain block mx-auto select-none"
            loading="lazy"
          />
        </div>
      </div>

      {/* 3. Triplet Stat Tiles */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
        {/* Your Answer Tile */}
        <div className="bg-raised rounded-xl border border-line p-2 sm:p-2.5 text-center flex flex-col items-center justify-center min-w-0">
          <span className="font-ui text-[10px] sm:text-xs uppercase tracking-wider text-muted font-bold truncate w-full">
            YOUR ANSWER
          </span>
          <span
            className={`font-ui font-bold text-xl sm:text-2xl mt-1 leading-none ${
              isCorrect ? 'text-jungle' : 'text-coral'
            }`}
          >
            {round?.yourAnswer !== null && round?.yourAnswer !== undefined
              ? round.yourAnswer
              : '-'}
          </span>
        </div>

        {/* Verified Solution Tile */}
        <div className="bg-raised rounded-xl border border-line p-2 sm:p-2.5 text-center flex flex-col items-center justify-center min-w-0">
          <span className="font-ui text-[10px] sm:text-xs uppercase tracking-wider text-muted font-bold truncate w-full">
            SOLUTION
          </span>
          <span className="font-ui font-bold text-xl sm:text-2xl text-jungle mt-1 leading-none">
            {round?.correctAnswer}
          </span>
        </div>

        {/* Round Points Tile */}
        <div className="bg-raised rounded-xl border border-line p-2 sm:p-2.5 text-center flex flex-col items-center justify-center min-w-0">
          <span className="font-ui text-[10px] sm:text-xs uppercase tracking-wider text-muted font-bold truncate w-full">
            POINTS
          </span>
          <span
            className={`font-display text-xl sm:text-2xl mt-1 leading-none ${
              round?.points > 0 ? 'text-banana' : 'text-muted'
            }`}
          >
            +{round?.points || 0}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default RoundCard;
