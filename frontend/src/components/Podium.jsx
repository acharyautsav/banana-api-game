// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE: Podium Component
 * ============================================================================
 * Renders the top 3 leaderboard players in classic arcade podium fashion:
 * - Desktop (md and up): ordered 2nd, 1st (tallest in centre), 3rd.
 * - Mobile (below md): stacked vertically in 1st, 2nd, 3rd rank order.
 * - 1st: Crown icon, banana border, shadow-glow-banana, text-4xl score.
 * - 2nd: Silver treatment with light accent top edge.
 * - 3rd: Bronze treatment with banana-deep subtle border.
 * - Current user: highlighted with "YOU" badge and banana border.
 * - Gracefully supports 1, 2, or 3 players without empty placeholders.
 * - Entrance animation: staggered rise with 1st place arriving last for impact.
 * ============================================================================
 */
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Card, Badge, Avatar } from './ui';

export const Podium = ({ players = [], currentUsername = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  if (!players || players.length === 0) return null;

  const isCurrentPlayer = (username) =>
    Boolean(
      currentUsername &&
      username &&
      username.toLowerCase() === currentUsername.toLowerCase()
    );

  // Single player layout
  if (players.length === 1) {
    const first = players[0];
    const isYou = isCurrentPlayer(first.username);

    return (
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Card
            className={`w-full border-2 border-banana/60 shadow-glow-banana ${
              isYou ? 'ring-2 ring-banana' : ''
            }`}
            bodyClassName="p-6 flex flex-col items-center text-center relative"
          >
            <div className="absolute top-4 left-4">
              <div className="w-8 h-8 rounded-full bg-banana text-ink font-display text-base flex items-center justify-center font-bold shadow-md">
                1
              </div>
            </div>

            {isYou && (
              <div className="absolute top-4 right-4">
                <Badge variant="banana" size="sm">YOU</Badge>
              </div>
            )}

            <Crown className="w-7 h-7 text-banana mb-2 animate-float" aria-hidden="true" />
            <Avatar username={first.username} size="xl" className="mb-3" />

            <h3
              className="font-ui font-bold text-xl text-text truncate max-w-full"
              title={first.username}
            >
              {first.username}
            </h3>

            <div className="mt-3 flex flex-col items-center">
              <span className="font-ui text-[10px] uppercase font-bold tracking-wider text-muted">
                BEST SCORE
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display text-4xl text-banana leading-none">
                  {first.bestScore}
                </span>
                <span className="font-ui text-xs font-bold text-muted uppercase">PTS</span>
              </div>
            </div>

            <span className="font-sans text-xs text-muted mt-2">
              {first.gamesPlayed} games played
            </span>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Two players layout
  if (players.length === 2) {
    const [first, second] = players;
    const isYouFirst = isCurrentPlayer(first.username);
    const isYouSecond = isCurrentPlayer(second.username);

    return (
      <div className="w-full max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-end">
        {/* 1st Place */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 0.1, ease: 'easeOut' }}
          className="order-1 md:order-1"
        >
          <Card
            className={`w-full border-2 border-banana/60 shadow-glow-banana ${
              isYouFirst ? 'ring-2 ring-banana' : ''
            }`}
            bodyClassName="p-6 flex flex-col items-center text-center relative"
          >
            <div className="absolute top-4 left-4">
              <div className="w-8 h-8 rounded-full bg-banana text-ink font-display text-base flex items-center justify-center font-bold shadow-md">
                1
              </div>
            </div>

            {isYouFirst && (
              <div className="absolute top-4 right-4">
                <Badge variant="banana" size="sm">YOU</Badge>
              </div>
            )}

            <Crown className="w-7 h-7 text-banana mb-2 animate-float" aria-hidden="true" />
            <Avatar username={first.username} size="xl" className="mb-3" />

            <h3
              className="font-ui font-bold text-xl text-text truncate max-w-full"
              title={first.username}
            >
              {first.username}
            </h3>

            <div className="mt-3 flex flex-col items-center">
              <span className="font-ui text-[10px] uppercase font-bold tracking-wider text-muted">
                BEST SCORE
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display text-4xl text-banana leading-none">
                  {first.bestScore}
                </span>
                <span className="font-ui text-xs font-bold text-muted uppercase">PTS</span>
              </div>
            </div>

            <span className="font-sans text-xs text-muted mt-2">
              {first.gamesPlayed} games played
            </span>
          </Card>
        </motion.div>

        {/* 2nd Place */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="order-2 md:order-2"
        >
          <Card
            className={`w-full border border-line border-t-text/40 shadow-sm ${
              isYouSecond ? 'border-banana shadow-glow-banana ring-1 ring-banana' : ''
            }`}
            bodyClassName="p-5 flex flex-col items-center text-center relative"
          >
            <div className="absolute top-3 left-3">
              <div className="w-7 h-7 rounded-full bg-raised border border-text/40 text-text/90 font-display text-sm flex items-center justify-center font-bold">
                2
              </div>
            </div>

            {isYouSecond && (
              <div className="absolute top-3 right-3">
                <Badge variant="banana" size="sm">YOU</Badge>
              </div>
            )}

            <Avatar username={second.username} size="lg" className="mb-3 mt-4" />

            <h3
              className="font-ui font-bold text-lg text-text truncate max-w-full"
              title={second.username}
            >
              {second.username}
            </h3>

            <div className="mt-2.5 flex flex-col items-center">
              <span className="font-ui text-[10px] uppercase font-bold tracking-wider text-muted">
                BEST SCORE
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-display text-3xl text-banana leading-none">
                  {second.bestScore}
                </span>
                <span className="font-ui text-xs font-bold text-muted uppercase">PTS</span>
              </div>
            </div>

            <span className="font-sans text-xs text-muted mt-2">
              {second.gamesPlayed} games played
            </span>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Three players full podium layout
  const [first, second, third] = players;
  const isYouFirst = isCurrentPlayer(first.username);
  const isYouSecond = isCurrentPlayer(second.username);
  const isYouThird = isCurrentPlayer(third.username);

  return (
    <div className="w-full flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6 items-end">
      {/* 2nd Place Card (Desktop: Left Col 1, Mobile: Order 2) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 0.05, ease: 'easeOut' }}
        className="order-2 md:order-1 w-full md:mt-8"
      >
        <Card
          className={`w-full border border-line border-t-text/40 shadow-sm ${
            isYouSecond ? 'border-banana shadow-glow-banana ring-1 ring-banana' : ''
          }`}
          bodyClassName="p-5 flex flex-col items-center text-center relative"
        >
          {/* Rank Badge */}
          <div className="absolute top-3 left-3">
            <div className="w-7 h-7 rounded-full bg-raised border border-text/40 text-text/90 font-display text-sm flex items-center justify-center font-bold">
              2
            </div>
          </div>

          {/* You Badge */}
          {isYouSecond && (
            <div className="absolute top-3 right-3">
              <Badge variant="banana" size="sm">YOU</Badge>
            </div>
          )}

          <Avatar username={second.username} size="lg" className="mb-3 mt-4" />

          <h3
            className="font-ui font-bold text-lg text-text truncate max-w-full"
            title={second.username}
          >
            {second.username}
          </h3>

          <div className="mt-2.5 flex flex-col items-center">
            <span className="font-ui text-[10px] uppercase font-bold tracking-wider text-muted">
              BEST SCORE
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display text-3xl text-banana leading-none">
                {second.bestScore}
              </span>
              <span className="font-ui text-xs font-bold text-muted uppercase">PTS</span>
            </div>
          </div>

          <span className="font-sans text-xs text-muted mt-2">
            {second.gamesPlayed} games played
          </span>
        </Card>
      </motion.div>

      {/* 1st Place Card (Desktop: Centre Col 2, Tallest; Mobile: Order 1) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
        className="order-1 md:order-2 w-full"
      >
        <Card
          className={`w-full border-2 border-banana/60 shadow-glow-banana ${
            isYouFirst ? 'ring-2 ring-banana' : ''
          }`}
          bodyClassName="p-6 sm:p-7 flex flex-col items-center text-center relative"
        >
          {/* Rank Badge */}
          <div className="absolute top-4 left-4">
            <div className="w-8 h-8 rounded-full bg-banana text-ink font-display text-base flex items-center justify-center font-bold shadow-md">
              1
            </div>
          </div>

          {/* You Badge */}
          {isYouFirst && (
            <div className="absolute top-4 right-4">
              <Badge variant="banana" size="sm">YOU</Badge>
            </div>
          )}

          {/* Crown Icon */}
          <Crown className="w-7 h-7 sm:w-8 sm:h-8 text-banana mb-2 animate-float" aria-hidden="true" />
          <Avatar username={first.username} size="xl" className="mb-3" />

          <h3
            className="font-ui font-bold text-xl sm:text-2xl text-text truncate max-w-full"
            title={first.username}
          >
            {first.username}
          </h3>

          <div className="mt-3 flex flex-col items-center">
            <span className="font-ui text-[10px] sm:text-xs uppercase font-bold tracking-wider text-muted">
              BEST SCORE
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display text-4xl sm:text-5xl text-banana leading-none">
                {first.bestScore}
              </span>
              <span className="font-ui text-xs sm:text-sm font-bold text-muted uppercase">PTS</span>
            </div>
          </div>

          <span className="font-sans text-xs text-muted mt-2">
            {first.gamesPlayed} games played
          </span>
        </Card>
      </motion.div>

      {/* 3rd Place Card (Desktop: Right Col 3, Mobile: Order 3) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: shouldReduceMotion ? 0 : 0.1, ease: 'easeOut' }}
        className="order-3 md:order-3 w-full md:mt-8"
      >
        <Card
          className={`w-full border border-banana-deep/40 shadow-sm ${
            isYouThird ? 'border-banana shadow-glow-banana ring-1 ring-banana' : ''
          }`}
          bodyClassName="p-5 flex flex-col items-center text-center relative"
        >
          {/* Rank Badge */}
          <div className="absolute top-3 left-3">
            <div className="w-7 h-7 rounded-full bg-banana-deep/10 border border-banana-deep/40 text-banana-deep font-display text-sm flex items-center justify-center font-bold">
              3
            </div>
          </div>

          {/* You Badge */}
          {isYouThird && (
            <div className="absolute top-3 right-3">
              <Badge variant="banana" size="sm">YOU</Badge>
            </div>
          )}

          <Avatar username={third.username} size="lg" className="mb-3 mt-4" />

          <h3
            className="font-ui font-bold text-lg text-text truncate max-w-full"
            title={third.username}
          >
            {third.username}
          </h3>

          <div className="mt-2.5 flex flex-col items-center">
            <span className="font-ui text-[10px] uppercase font-bold tracking-wider text-muted">
              BEST SCORE
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-display text-3xl text-banana leading-none">
                {third.bestScore}
              </span>
              <span className="font-ui text-xs font-bold text-muted uppercase">PTS</span>
            </div>
          </div>

          <span className="font-sans text-xs text-muted mt-2">
            {third.gamesPlayed} games played
          </span>
        </Card>
      </motion.div>
    </div>
  );
};

export default Podium;
