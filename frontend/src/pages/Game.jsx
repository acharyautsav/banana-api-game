// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * EVENT-DRIVEN PROGRAMMING THEME: Game Screen Interaction
 * ============================================================================
 * This page implements comprehensive GUI, keyboard, and timer event handling:
 * 1. Click Events:
 *    - Start Game button click triggers session setup
 *    - DigitPad keypad button clicks select an answer
 *    - Submit button click triggers answer evaluation
 * 2. Keyboard Events:
 *    - Global 'keydown' event listener attached via useEffect
 *    - Numeric keys (0–9) immediately update selected digit
 *    - Enter key triggers answer submission without mouse interaction
 * 3. Timer Events:
 *    - Timer component runs a 30s countdown driven by setInterval
 *    - When time expires, fires an onTimeout callback
 *    - Auto-submits answer null to POST /api/game/:id/answer
 * 4. Double-Submit Prevention:
 *    - Input controls are locked while API requests are in flight
 * 5. Micro-Feedback Loop:
 *    - Shows 1-second visual success/failure result Card with awarded points
 *    - Automatically transitions to next round or redirects to /results/:id
 * 6. Decoupled Frontend Event Bus:
 *    - Emits domain lifecycle events (round:start, answer:submit, round:timeout, game:finish)
 *    - Allows decoupled components like ScoreHud to subscribe without prop drilling
 * ============================================================================
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Send, AlertCircle, CheckCircle2, XCircle, Timer as TimerIcon } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Skeleton, Spinner } from '../components/ui';
import { DigitPad } from '../components/DigitPad';
import { Timer } from '../components/Timer';
import { ScoreHud } from '../components/ScoreHud';
import { Lobby } from '../components/Lobby';
import { gameEvents } from '../events/gameEvents';

/**
 * Micro-Feedback Result Card
 * Displays animated evaluation banner replacing the plain notification
 */
const FeedbackCard = ({ feedback }) => {
  const shouldReduceMotion = useReducedMotion();
  const isCorrect = feedback.correct;
  const isTimeout = feedback.isTimeout;

  let borderColor = 'border-jungle shadow-glow-jungle';
  let title = 'CORRECT';
  let titleColor = 'text-jungle';
  let pointsDisplay = `+${feedback.points || 0}`;
  let pointsColor = 'text-banana animate-pop';
  let Icon = CheckCircle2;
  let iconColor = 'text-jungle';
  let cardAnimation = '';

  if (isTimeout) {
    borderColor = 'border-coral shadow-glow-coral';
    title = "TIME'S UP";
    titleColor = 'text-coral';
    pointsDisplay = '+0';
    pointsColor = 'text-muted';
    Icon = TimerIcon;
    iconColor = 'text-coral';
    cardAnimation = 'animate-shake';
  } else if (!isCorrect) {
    borderColor = 'border-coral shadow-glow-coral';
    title = 'INCORRECT';
    titleColor = 'text-coral';
    pointsDisplay = '+0';
    pointsColor = 'text-muted';
    Icon = XCircle;
    iconColor = 'text-coral';
    cardAnimation = 'animate-shake';
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      role="status"
      aria-live="polite"
      className="w-full"
    >
      <Card
        className={`w-full ${borderColor} ${cardAnimation}`}
        bodyClassName="p-4 sm:p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Icon className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 ${iconColor}`} aria-hidden="true" />
            <div>
              <h3 className={`font-ui font-bold text-xl sm:text-2xl uppercase tracking-wider ${titleColor} leading-none`}>
                {title}
              </h3>
              <p className="font-ui text-xs text-muted mt-1 uppercase tracking-wider">
                {isCorrect ? 'Round Points' : isTimeout ? 'Time Expired' : 'No Points Awarded'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`font-display text-3xl sm:text-4xl ${pointsColor} leading-none inline-block`}>
              {pointsDisplay}
            </span>
            <span className="block font-ui text-[10px] text-muted uppercase font-bold tracking-wider mt-0.5">
              PTS
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const Game = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Primary UI state: 'idle' | 'loading' | 'playing'
  const [gameState, setGameState] = useState('idle');
  const [gameData, setGameData] = useState(null); // { gameId, round, totalRounds, question }
  const [selectedDigit, setSelectedDigit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { correct, points, isTimeout }
  const [error, setError] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Mutable ref to access latest submit function within keyboard and timeout listeners
  const submitHandlerRef = useRef(null);


  /**
   * Fetch user's recent finished games when on the idle screen
   */
  useEffect(() => {
    let isMounted = true;
    if (gameState === 'idle') {
      const fetchHistory = async () => {
        try {
          setLoadingHistory(true);
          const res = await client.get('/game/history');
          if (isMounted) {
            setRecentGames((res.data || []).slice(0, 5));
          }
        } catch (err) {
          console.error('Failed to load recent games history:', err);
        } finally {
          if (isMounted) {
            setLoadingHistory(false);
          }
        }
      };

      fetchHistory();
    }
    return () => {
      isMounted = false;
    };
  }, [gameState]);

  /**
   * Start a new game session via POST /api/game/start
   */
  const handleStartGame = async () => {
    try {
      setGameState('loading');
      setError(null);
      setSelectedDigit(null);
      setFeedback(null);
      setImageLoading(true);
      setImageError(false);

      const response = await client.post('/game/start');
      setGameData(response.data);
      setGameState('playing');

      // Publish round:start event on frontend event bus for decoupled consumers
      gameEvents.emit('round:start', {
        round: response.data.round,
        totalRounds: response.data.totalRounds,
      });
    } catch (err) {
      console.error('Failed to start game:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Puzzle service unavailable, please try again.'
      );
      setGameState('idle');
    }
  };

  /**
   * Submit answer handler
   * Supports manual submission (selectedDigit) and automatic timeout submission (answer: null).
   * Enforces in-flight submission lock to avoid double submits.
   */
  const handleSubmitAnswer = useCallback(
    async (overrideAnswer = undefined) => {
      const answerToSubmit = overrideAnswer !== undefined ? overrideAnswer : selectedDigit;

      // Allow null answer for timeout, but require numeric answer for manual submits
      if (
        (answerToSubmit === null && overrideAnswer === undefined) ||
        (answerToSubmit === null && overrideAnswer !== null) ||
        isSubmitting ||
        gameState !== 'playing' ||
        !gameData
      ) {
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const response = await client.post(`/game/${gameData.gameId}/answer`, {
          answer: answerToSubmit,
        });

        // Publish answer:submit event with round evaluation results
        gameEvents.emit('answer:submit', {
          correct: response.data.correct,
          points: response.data.points,
          score: response.data.score,
          round: gameData.round,
        });

        // If game has concluded on this round, publish game:finish event
        if (response.data.finished) {
          gameEvents.emit('game:finish', {
            gameId: response.data.gameId,
            score: response.data.score,
          });
        }

        // Display 1-second feedback banner (correct/wrong + points)
        setFeedback({
          correct: response.data.correct,
          points: response.data.points,
          isTimeout: overrideAnswer === null,
        });

        setTimeout(() => {
          setFeedback(null);

          if (response.data.finished) {
            // Final round finished: navigate to results page
            navigate(`/results/${response.data.gameId}`);
          } else {
            // Advance to next round puzzle
            setGameData((prev) => ({
              ...prev,
              round: response.data.round,
              question: response.data.question,
            }));
            setSelectedDigit(null);
            setIsSubmitting(false);
            setImageLoading(true);
            setImageError(false);

            // Publish round:start event for the next round
            gameEvents.emit('round:start', {
              round: response.data.round,
              totalRounds: gameData.totalRounds,
            });
          }
        }, 1000);
      } catch (err) {
        console.error('Answer submission error:', err);
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to submit answer. Please try again.'
        );
        setIsSubmitting(false);
      }
    },
    [gameData, gameState, isSubmitting, navigate, selectedDigit]
  );

  // Keep ref synchronized with current submit handler
  useEffect(() => {
    submitHandlerRef.current = handleSubmitAnswer;
  }, [handleSubmitAnswer]);

  /**
   * Timeout Event Handler
   * Triggered when the Timer countdown reaches 0 seconds.
   * Auto-submits with answer: null.
   */
  const handleTimeout = () => {
    if (!isSubmitting && feedback === null) {
      // Publish round:timeout event on event bus
      gameEvents.emit('round:timeout', { round: gameData?.round });
      submitHandlerRef.current?.(null);
    }
  };

  /**
   * Keyboard Event Listener
   * Captures physical keyboard events (0-9 for digit selection, Enter for submit)
   */
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      // Check numeric keys 0 through 9
      if (/^[0-9]$/.test(e.key) && !isSubmitting && !feedback) {
        e.preventDefault();
        setSelectedDigit(Number(e.key));
      }

      // Check Enter key to trigger submit
      if (e.key === 'Enter' && !isSubmitting && !feedback) {
        e.preventDefault();
        submitHandlerRef.current?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, isSubmitting, feedback]);

  return (
    <div className="w-full flex-1 flex flex-col justify-center">
      {/* 1. IDLE STATE: Banana Arcade Lobby */}
      {gameState === 'idle' && (
        <Lobby
          user={user}
          onStartGame={handleStartGame}
          isLoading={false}
          error={error}
          onDismissError={() => setError(null)}
          recentGames={recentGames}
          loadingHistory={loadingHistory}
        />
      )}

      {/* 2. LOADING STATE */}
      {gameState === 'loading' && (
        <div className="py-24 text-center space-y-4">
          <Spinner size="lg" className="mx-auto" />
          <p className="font-ui text-base font-bold text-text uppercase tracking-wider">
            Fetching puzzle from Banana API...
          </p>
        </div>
      )}

      {/* 3. PLAYING STATE */}
      {gameState === 'playing' && gameData && (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Top error banner spanning full width if present */}
            {error && (
              <div className="order-0 col-span-full p-4 rounded-xl bg-coral/10 border border-coral/30 text-sm text-coral flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-coral" aria-hidden="true" />
                  <span>{error}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError(null)}
                  className="text-coral hover:text-white"
                >
                  Dismiss
                </Button>
              </div>
            )}

            {/* Left Column (Desktop: ~60% col-span-7; Mobile: Order 4) */}
            <div className="order-4 lg:order-1 lg:col-span-7 flex flex-col gap-2">
              {/* Header strip */}
              <div className="flex items-center justify-between px-1 font-ui uppercase tracking-wider">
                <span className="text-xs sm:text-sm font-bold text-banana">
                  ROUND {gameData.round}
                </span>
                <span className="text-xs text-muted font-medium">
                  Find the banana's value
                </span>
              </div>

              {/* Dark bezel with banana-tinted border and low-intensity glow */}
              <div className="w-full bg-raised border border-banana/25 rounded-2xl p-3 sm:p-4 shadow-glow-banana">
                <div className="w-full bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center justify-center overflow-hidden min-h-[260px] sm:min-h-[360px]">
                  {imageLoading && (
                    <Skeleton className="w-full h-64 sm:h-80 md:h-96 rounded-xl bg-surface/20" />
                  )}
                  {imageError ? (
                    <div className="p-6 text-center text-coral space-y-2">
                      <AlertCircle className="w-8 h-8 mx-auto text-coral" />
                      <p className="font-ui font-semibold text-sm">Failed to load puzzle image.</p>
                    </div>
                  ) : (
                    <img
                      key={gameData.question}
                      src={gameData.question}
                      alt={`Puzzle for round ${gameData.round}`}
                      className={`w-full max-h-[460px] object-contain block mx-auto select-none transition-opacity duration-150 ${
                        imageLoading ? 'hidden' : 'block'
                      }`}
                      onLoad={() => setImageLoading(false)}
                      onError={() => {
                        setImageLoading(false);
                        setImageError(true);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (Desktop: ~40% col-span-5 flex-col; Mobile: contents ordered into single column) */}
            <div className="contents lg:flex lg:flex-col lg:col-span-5 lg:gap-6 lg:order-2">
              {/* 1. HUD (Score, Round, Streak) */}
              <div className="order-1 lg:order-none">
                <ScoreHud />
              </div>

              {/* 2. Timer (prominent digits + progress bar) */}
              <div className="order-2 lg:order-none">
                <Timer
                  round={gameData.round}
                  onTimeout={handleTimeout}
                  isActive={!isSubmitting && feedback === null}
                  duration={30}
                />
              </div>

              {/* 3. Feedback Card (above puzzle on mobile, above keypad on desktop) */}
              <AnimatePresence>
                {feedback && (
                  <div className="order-3 lg:order-none">
                    <FeedbackCard feedback={feedback} />
                  </div>
                )}
              </AnimatePresence>

              {/* 4. DigitPad (includes Answer Display + Keypad + Keyboard hints) */}
              <div className="order-5 lg:order-none">
                <DigitPad
                  selectedDigit={selectedDigit}
                  onSelectDigit={(digit) => !isSubmitting && !feedback && setSelectedDigit(digit)}
                  disabled={isSubmitting || feedback !== null}
                />
              </div>

              {/* 5. Submit Button */}
              <div className="order-6 lg:order-none">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={selectedDigit === null || isSubmitting || feedback !== null}
                  loading={isSubmitting}
                  onClick={() => handleSubmitAnswer()}
                  leftIcon={<Send className="w-5 h-5" />}
                >
                  SUBMIT ANSWER
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
