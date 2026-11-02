// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE UI: AuthLayout Component
 * ============================================================================
 * Shared split-screen layout for authentication pages (Login & Signup):
 * - Left column (desktop lg+): Brand presentation panel with large floating Logo,
 *   bold Bungee headline, tagline, and feature rows with Lucide icons in raised tiles.
 * - Right column: Centered form container with Framer Motion entrance animation
 *   (respecting prefers-reduced-motion).
 * ============================================================================
 */
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Timer, Trophy, Zap } from 'lucide-react';
import { Logo } from './Logo';

export const AuthLayout = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  const entranceInitial = shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 };
  const entranceTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: 'easeOut' };

  return (
    <div className="flex-1 w-full flex items-center justify-center py-4 sm:py-8">
      <div className="w-full flex rounded-3xl overflow-hidden border border-line/60 bg-surface/50 shadow-2xl backdrop-blur-sm min-h-[calc(100vh-10rem)]">
        {/* Left Column: Brand Hero Panel (Hidden on screens below lg) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 relative overflow-hidden bg-gradient-to-b from-surface via-surface to-ink border-r border-line/60">
          {/* Subtle Radial Banana Ambient Glow */}
          <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-banana/10 blur-3xl pointer-events-none" />

          {/* Top Brand Section */}
          <div className="relative z-10">
            <div className="animate-float inline-block mb-10">
              <Logo size="lg" />
            </div>

            <h1 className="font-display text-4xl xl:text-5xl font-black text-text uppercase tracking-wide leading-tight mb-4">
              SOLVE. RACE.{' '}
              <span className="text-banana drop-shadow-[0_0_20px_rgba(255,200,41,0.4)]">
                CLIMB.
              </span>
            </h1>

            <p className="font-sans text-base text-muted max-w-md leading-relaxed">
              Crack the banana equations before the clock runs out.
            </p>
          </div>

          {/* Middle: Feature Highlights */}
          <div className="relative z-10 space-y-6 my-8">
            {/* Feature 1: Timer */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-raised border border-line flex items-center justify-center text-banana shrink-0 shadow-sm">
                <Timer className="w-6 h-6" aria-hidden="true" />
              </div>
              <p className="font-ui font-bold text-text text-base uppercase tracking-wider">
                30 seconds per round
              </p>
            </div>

            {/* Feature 2: Trophy */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-raised border border-line flex items-center justify-center text-banana shrink-0 shadow-sm">
                <Trophy className="w-6 h-6" aria-hidden="true" />
              </div>
              <p className="font-ui font-bold text-text text-base uppercase tracking-wider">
                Climb the global leaderboard
              </p>
            </div>

            {/* Feature 3: Zap */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-raised border border-line flex items-center justify-center text-banana shrink-0 shadow-sm">
                <Zap className="w-6 h-6" aria-hidden="true" />
              </div>
              <p className="font-ui font-bold text-text text-base uppercase tracking-wider">
                Fresh puzzles from the live Banana API
              </p>
            </div>
          </div>

          {/* Bottom Accreditation */}
          <div className="relative z-10 pt-4 border-t border-line/40 text-xs text-muted font-sans">
            CIS046-3 Software For Enterprise · Arcade Edition
          </div>
        </div>

        {/* Right Column: Centered Form Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <motion.div
            initial={entranceInitial}
            animate={{ opacity: 1, y: 0 }}
            transition={entranceTransition}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
