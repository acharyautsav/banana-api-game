// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * VIRTUAL IDENTITY & LEADERBOARD: Global Leaderboard Screen
 * ============================================================================
 * Displays the top 10 players based on high-performance MongoDB aggregation:
 * 1. Fetches ranking data via GET /api/leaderboard on mount.
 * 2. Visual Hierarchy:
 *    - Prominent Header Card with Trophy gradient tile and "PLAY GAME" action.
 *    - Arcade Podium for the Top 3 players (1st, 2nd, 3rd) with crown and badges.
 *    - Structured semantic Table for ranks 4 through 10.
 *    - Highlights the currently authenticated player's row and podium card.
 * 3. Privacy Preservation:
 *    - Shows strictly sanitized public identifiers (username, bestScore, gamesPlayed).
 *    - Never requests or renders emails or credentials.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Play, AlertCircle } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Skeleton } from '../components/ui';
import { Podium } from '../components/Podium';
import { LeaderboardTable } from '../components/LeaderboardTable';

export const Leaderboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchLeaderboard = async () => {
      try {
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
  }, [reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="w-full flex-1 flex flex-col justify-start min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Skeleton Header Card */}
          <Card accentTop bodyClassName="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="w-48 sm:w-64 h-8 rounded-lg" />
                <Skeleton className="w-40 sm:w-56 h-4 rounded-md" />
              </div>
            </div>
            <Skeleton className="w-full sm:w-36 h-12 rounded-xl" />
          </Card>

          {/* Skeleton Podium Cards (3 cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end">
            <Card bodyClassName="p-5 space-y-3">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="w-12 h-12 rounded-full mx-auto" />
              <Skeleton className="w-24 h-6 rounded mx-auto" />
              <Skeleton className="w-20 h-8 rounded mx-auto" />
              <Skeleton className="w-16 h-3 rounded mx-auto" />
            </Card>
            <Card bodyClassName="p-7 space-y-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-16 h-16 rounded-full mx-auto" />
              <Skeleton className="w-28 h-7 rounded mx-auto" />
              <Skeleton className="w-24 h-10 rounded mx-auto" />
              <Skeleton className="w-20 h-4 rounded mx-auto" />
            </Card>
            <Card bodyClassName="p-5 space-y-3">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="w-12 h-12 rounded-full mx-auto" />
              <Skeleton className="w-24 h-6 rounded mx-auto" />
              <Skeleton className="w-20 h-8 rounded mx-auto" />
              <Skeleton className="w-16 h-3 rounded mx-auto" />
            </Card>
          </div>

          {/* Skeleton Table Rows (5 rows) */}
          <Card bodyClassName="p-5 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-line/40">
                <Skeleton className="w-8 h-6 rounded" />
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-32 h-5 rounded" />
                </div>
                <Skeleton className="w-16 h-6 rounded" />
                <Skeleton className="w-12 h-4 rounded hidden sm:block" />
              </div>
            ))}
          </Card>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
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
            Ranking Unavailable
          </h1>
          <p className="text-sm text-coral bg-coral/10 border border-coral/30 rounded-xl p-3 w-full font-sans">
            {error}
          </p>
          <div className="pt-2 w-full">
            <Button
              variant="ghost"
              size="md"
              className="w-full text-text hover:text-white"
              onClick={handleRetry}
            >
              Try again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 3. Empty State (no scores on the board yet)
  if (leaderboard.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card
          className="max-w-md w-full border-line text-center shadow-xl"
          bodyClassName="p-8 sm:p-10 flex flex-col items-center space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-raised border border-line flex items-center justify-center text-muted mb-1">
            <Trophy className="w-8 h-8 text-muted" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl text-text uppercase tracking-wide">
            No Scores Yet
          </h1>
          <p className="text-sm text-muted max-w-xs mx-auto font-sans">
            Be the first on the board! Finish a 5-round puzzle challenge and take the #1 spot.
          </p>
          <div className="pt-2 w-full">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              leftIcon={<Play className="w-4 h-4 fill-ink" />}
              onClick={() => navigate('/game')}
            >
              PLAY GAME
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, 10);

  return (
    <div className="w-full flex-1 flex flex-col justify-start min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* 1. Header Card */}
        <Card
          accentTop
          className="w-full shadow-lg"
          bodyClassName="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-banana to-banana-deep flex items-center justify-center text-ink shadow-md shrink-0">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl text-text tracking-wide uppercase leading-tight">
                GLOBAL LEADERBOARD
              </h1>
              <p className="text-xs sm:text-sm text-muted font-sans mt-0.5">
                Top 10 players ranked by highest single-game score.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            leftIcon={<Play className="w-4 h-4 fill-ink" />}
            onClick={() => navigate('/game')}
          >
            PLAY GAME
          </Button>
        </Card>

        {/* 2. Top 3 Podium Section */}
        <div className="space-y-2">
          <Podium players={top3} currentUsername={user?.username} />
        </div>

        {/* 3. Table for Ranks 4 to 10 */}
        <LeaderboardTable
          entries={rest}
          currentUsername={user?.username}
          totalCount={leaderboard.length}
        />
      </div>
    </div>
  );
};

export default Leaderboard;
