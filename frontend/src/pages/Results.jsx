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
 *    - Dynamic jungle/coral styling clearly distinguishes correct from incorrect rounds.
 * 3. Navigation Controls:
 *    - "Play Again" routes to /game to start a new session.
 *    - "View Leaderboard" routes to /leaderboard to compare global rankings.
 *    - "Back to Game Screen" returns to the arcade lobby.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import client from '../api/client';
import { Button, Card, Skeleton } from '../components/ui';
import { ResultHero } from '../components/ResultHero';
import { RoundCard } from '../components/RoundCard';

export const Results = () => {
  const { id: gameId } = useParams();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

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

  // 1. Loading State (Skeleton Hero and 4 Skeleton Round Cards)
  if (loading) {
    return (
      <div className="w-full flex-1 flex flex-col justify-center">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          {/* Skeleton Hero Card */}
          <Card
            accentTop
            bodyClassName="p-6 sm:p-8 flex flex-col items-center space-y-6"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-32 h-8 rounded-lg" />
              <Skeleton className="w-10 h-10 rounded-xl" />
            </div>
            <Skeleton className="w-64 h-9 rounded-lg" />
            <Skeleton className="w-48 h-4 rounded-md" />
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="w-24 h-24 rounded-2xl" />
              <Skeleton className="w-14 h-3 rounded" />
            </div>
            <Skeleton className="w-36 h-12 rounded-xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 flex-1 rounded-xl" />
            </div>
          </Card>

          {/* Skeleton Round Breakdown */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="w-48 h-6 rounded-md" />
              <Skeleton className="w-24 h-4 rounded-md" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} bodyClassName="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="w-20 h-4 rounded" />
                    <Skeleton className="w-24 h-6 rounded-full" />
                  </div>
                  <Skeleton className="w-full h-44 rounded-xl" />
                  <div className="grid grid-cols-3 gap-3">
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error || !result) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card
          className="max-w-md w-full border-coral/40 shadow-glow-coral text-center"
          bodyClassName="p-6 sm:p-8 flex flex-col items-center space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-coral/10 border border-coral/30 flex items-center justify-center text-coral mb-1">
            <AlertCircle className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="font-ui text-2xl font-bold uppercase tracking-wide text-text">
            Result Not Available
          </h1>
          <p className="text-sm text-coral bg-coral/10 border border-coral/30 rounded-xl p-3 w-full font-sans">
            {error || 'Unable to retrieve game breakdown.'}
          </p>
          <div className="pt-2 w-full">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/game')}
            >
              Back to Game Screen
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const { score, correctCount, totalRounds, rounds } = result;

  // Stagger animation configuration for round cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.07,
      },
    },
  };

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: 'easeOut' },
    },
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* 1. Hero Summary Card */}
        <ResultHero
          score={score}
          correctCount={correctCount}
          totalRounds={totalRounds}
          onPlayAgain={() => navigate('/game')}
          onViewLeaderboard={() => navigate('/leaderboard')}
        />

        {/* 2. Round Breakdown Section */}
        <div className="space-y-4">
          {/* Section Heading Row */}
          <div className="flex items-end justify-between px-1">
            <div>
              <h2 className="font-ui text-xl font-bold uppercase tracking-wide text-text">
                ROUND BREAKDOWN
              </h2>
              <div className="h-1 w-12 bg-banana rounded-full mt-1.5" />
            </div>
            <span className="font-ui text-xs sm:text-sm text-muted">
              {rounds?.length || 0} rounds total
            </span>
          </div>

          {/* Staggered Cards Grid: 2 columns on lg and up, 1 column below */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
          >
            {rounds?.map((round, index) => (
              <motion.div key={index} variants={cardVariants}>
                <RoundCard round={round} roundNumber={index + 1} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 3. Footer Action Navigation */}
        <div className="pt-2 pb-6 flex items-center justify-center">
          <Button
            variant="ghost"
            size="md"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/game')}
          >
            Back to Game Screen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
