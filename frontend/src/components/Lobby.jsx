// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE UI: Lobby Component
 * ============================================================================
 * Presentational component for the Game page's idle state (Home/Lobby):
 * 1. Hero: Floating logo, Bungee title, personalized greeting, and high-impact
 *    "PLAY NOW" button with subtle shine effect.
 * 2. Quick Stats Strip: Compact cards for Best Score, Recent Games, and Avg Accuracy.
 * 3. How to Play: 4 staggered cards with backdrop step numbers, custom icons,
 *    and a server-enforced fairness note.
 * 4. Match History: Recent games list with score badges, result pills, timestamps,
 *    and direct links to game result breakdowns.
 * ============================================================================
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Play,
  Trophy,
  Gamepad2,
  Target,
  Eye,
  Search,
  Keyboard,
  Timer,
  Info,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { Logo } from './Logo';
import { Button, Card, Badge, Skeleton } from './ui';

export const Lobby = ({
  user,
  onStartGame,
  isLoading = false,
  error = null,
  onDismissError,
  recentGames = [],
  loadingHistory = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Compute quick stats safely from loaded recent games
  const hasGames = recentGames.length > 0;
  const bestScore = hasGames
    ? Math.max(...recentGames.map((g) => g.score || 0))
    : '-';
  const gamesCount = hasGames ? recentGames.length : '-';
  const avgAccuracy = hasGames
    ? Math.round(
        (recentGames.reduce(
          (acc, g) => acc + (g.correctCount || 0) / (g.totalRounds || 5),
          0
        ) /
          recentGames.length) *
          100
      ) + '%'
    : '-';

  // How to play step definitions
  const steps = [
    {
      number: '01',
      icon: <Eye className="w-6 h-6 text-banana" aria-hidden="true" />,
      title: 'Read the equations',
      description: 'Six equations share hidden values. Study the grid carefully.',
    },
    {
      number: '02',
      icon: <Search className="w-6 h-6 text-banana" aria-hidden="true" />,
      title: 'Crack the banana',
      description: 'Work out what number the banana stands for.',
    },
    {
      number: '03',
      icon: <Keyboard className="w-6 h-6 text-banana" aria-hidden="true" />,
      title: 'Pick a digit',
      description: 'Choose 0 to 9 by clicking the keypad or pressing a number key.',
    },
    {
      number: '04',
      icon: <Timer className="w-6 h-6 text-banana" aria-hidden="true" />,
      title: 'Beat the clock',
      description: 'You get 30 seconds per round. Faster correct answers earn more points.',
    },
  ];

  return (
    <div className="w-full space-y-12 pb-12">
      {/* Error Notification Banner */}
      {error && (
        <div
          className="flex items-center justify-between p-4 rounded-2xl bg-coral/10 border border-coral/40 text-coral text-sm font-sans"
          role="alert"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
          {onDismissError && (
            <button
              type="button"
              onClick={onDismissError}
              className="text-xs uppercase font-ui font-bold hover:underline cursor-pointer ml-4"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* ====================================================================
       * 1. HERO SECTION
       * ==================================================================== */}
      <section className="relative text-center py-8 sm:py-14 overflow-hidden">
        {/* Soft Radial Banana Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[480px] sm:h-[480px] rounded-full bg-banana/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Floating Logo Badge */}
          <div className="animate-float inline-block">
            <Logo size="lg" showText={false} />
          </div>

          <div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-text uppercase tracking-wider leading-none">
              BANANA <span className="text-banana drop-shadow-[0_0_24px_rgba(255,200,41,0.45)]">PUZZLE</span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-muted mt-3">
              Ready,{' '}
              <strong className="text-banana font-ui font-bold tracking-wide">
                {user?.username || 'Player'}
              </strong>
              ? Solve 5 equation puzzles from the live Banana API. Beat the clock.
            </p>
          </div>

          {/* Huge "PLAY NOW" Action Button */}
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onStartGame}
              disabled={isLoading}
              loading={isLoading}
              leftIcon={<Play className="w-5 h-5 fill-ink" aria-hidden="true" />}
              className="px-10 py-4 text-lg font-ui font-black uppercase tracking-wider shadow-glow-banana relative overflow-hidden group cursor-pointer"
            >
              {/* Shine Sweep Overlay */}
              {!shouldReduceMotion && (
                <span
                  className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_infinite] pointer-events-none"
                  aria-hidden="true"
                />
              )}
              <span>PLAY NOW</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ====================================================================
       * 2. QUICK STATS STRIP
       * ==================================================================== */}
      <section aria-label="Player Quick Statistics">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Best Score */}
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-raised border border-line flex items-center justify-center text-banana shrink-0 shadow-sm">
              <Trophy className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-ui uppercase text-xs font-bold text-muted tracking-wider">
                Best Score
              </p>
              {loadingHistory ? (
                <Skeleton className="w-16 h-8 mt-1" />
              ) : (
                <p className="font-display text-3xl sm:text-4xl text-banana leading-none mt-1">
                  {bestScore}
                </p>
              )}
            </div>
          </Card>

          {/* Recent Games Played */}
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-raised border border-line flex items-center justify-center text-banana shrink-0 shadow-sm">
              <Gamepad2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-ui uppercase text-xs font-bold text-muted tracking-wider">
                Recent Games
              </p>
              {loadingHistory ? (
                <Skeleton className="w-16 h-8 mt-1" />
              ) : (
                <p className="font-display text-3xl sm:text-4xl text-banana leading-none mt-1">
                  {gamesCount}
                </p>
              )}
            </div>
          </Card>

          {/* Avg Accuracy */}
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-raised border border-line flex items-center justify-center text-banana shrink-0 shadow-sm">
              <Target className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <p className="font-ui uppercase text-xs font-bold text-muted tracking-wider">
                Avg Accuracy
              </p>
              {loadingHistory ? (
                <Skeleton className="w-16 h-8 mt-1" />
              ) : (
                <p className="font-display text-3xl sm:text-4xl text-banana leading-none mt-1">
                  {avgAccuracy}
                </p>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* ====================================================================
       * 3. HOW TO PLAY SECTION
       * ==================================================================== */}
      <section aria-labelledby="how-to-play-heading" className="space-y-6">
        <div>
          <h2
            id="how-to-play-heading"
            className="font-ui uppercase text-xl sm:text-2xl font-bold text-text tracking-wider"
          >
            How to Play
          </h2>
          <div className="w-12 h-1 bg-banana rounded-full shadow-glow-banana mt-1.5" />
        </div>

        {/* 4 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, idx) => {
            const cardInitial = shouldReduceMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 16 };
            const cardTransition = shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.35, delay: idx * 0.06, ease: 'easeOut' };

            return (
              <motion.div
                key={step.number}
                initial={cardInitial}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={cardTransition}
              >
                <Card
                  hoverLift
                  className="p-5 h-full flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Subtle Big Step Number in Backdrop */}
                  <span
                    className="font-display text-5xl font-black text-banana opacity-15 absolute top-3 right-4 select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>

                  <div>
                    {/* Step Icon */}
                    <div className="w-12 h-12 rounded-xl bg-raised border border-line flex items-center justify-center mb-4 shadow-sm">
                      {step.icon}
                    </div>

                    {/* Step Title */}
                    <h3 className="font-ui font-bold text-base uppercase tracking-wide text-text mb-1.5">
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="font-sans text-xs text-muted leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Slim Info Bar */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-raised/80 border border-line text-xs sm:text-sm text-muted font-sans">
          <Info className="w-5 h-5 text-cyan shrink-0" aria-hidden="true" />
          <span>
            5 rounds. Timer is measured on the server for fairness. Correct answers in a row
            build your streak.
          </span>
        </div>
      </section>

      {/* ====================================================================
       * 4. MATCH HISTORY SECTION
       * ==================================================================== */}
      <section aria-labelledby="match-history-heading" className="space-y-4">
        {/* Section Heading & View Leaderboard Link */}
        <div className="flex items-center justify-between">
          <div>
            <h2
              id="match-history-heading"
              className="font-ui uppercase text-xl sm:text-2xl font-bold text-text tracking-wider"
            >
              Match History
            </h2>
            <div className="w-12 h-1 bg-banana rounded-full shadow-glow-banana mt-1.5" />
          </div>

          <Link to="/leaderboard">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" aria-hidden="true" />}
              className="text-xs sm:text-sm"
            >
              View Leaderboard
            </Button>
          </Link>
        </div>

        {/* Match History List Container */}
        {loadingHistory ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : recentGames.length === 0 ? (
          <Card className="border-dashed border-line bg-surface/40 p-8 sm:p-12 text-center rounded-2xl">
            <Gamepad2 className="w-12 h-12 text-muted mx-auto mb-3" aria-hidden="true" />
            <h3 className="font-ui font-bold text-text uppercase text-base tracking-wide">
              No games yet
            </h3>
            <p className="text-xs sm:text-sm text-muted font-sans mt-1">
              Hit PLAY NOW to set your first score.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentGames.map((game) => {
              const gameId = game.id || game._id;
              const correct = game.correctCount || 0;
              const total = game.totalRounds || 5;
              const isPassing = correct >= 3;

              return (
                <Card
                  key={gameId}
                  hoverLift
                  className="p-4 sm:p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Score & Result Pill */}
                  <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                    {/* Score */}
                    <div className="flex items-baseline">
                      <span className="font-display text-2xl sm:text-3xl text-banana tracking-wide">
                        {game.score}
                      </span>
                      <span className="font-ui text-xs font-bold text-muted ml-1.5 uppercase tracking-wider">
                        PTS
                      </span>
                    </div>

                    {/* Result Pill */}
                    <Badge variant={isPassing ? 'jungle' : 'coral'} size="md">
                      {correct}/{total} Correct
                    </Badge>

                    {/* Timestamp */}
                    <span className="text-xs text-muted font-sans">
                      {game.finishedAt
                        ? new Date(game.finishedAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Completed'}
                    </span>
                  </div>

                  {/* Right: Breakdown Navigation Action */}
                  <div className="self-end sm:self-auto">
                    <Link to={`/results/${gameId}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<ChevronRight className="w-4 h-4" aria-hidden="true" />}
                        className="text-xs sm:text-sm"
                      >
                        Breakdown
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Lobby;
