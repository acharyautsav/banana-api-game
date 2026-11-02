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
 *    - Shows 1-second visual success/failure banner with awarded points
 *    - Automatically transitions to next round or redirects to /results/:id
 * 6. Decoupled Frontend Event Bus:
 *    - Emits domain lifecycle events (round:start, answer:submit, round:timeout, game:finish)
 *    - Allows decoupled components like ScoreHud to subscribe without prop drilling
 * ============================================================================
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { DigitPad } from '../components/DigitPad';
import { Timer } from '../components/Timer';
import { ScoreHud } from '../components/ScoreHud';
import { Lobby } from '../components/Lobby';
import { gameEvents } from '../events/gameEvents';

export const Game = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Primary UI state: 'idle' | 'loading' | 'playing'
  const [gameState, setGameState] = useState('idle');
  const [gameData, setGameData] = useState(null); // { gameId, round, totalRounds, question }
  const [selectedDigit, setSelectedDigit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { show, correct, points, isTimeout }
  const [error, setError] = useState(null);
  const [recentGames, setRecentGames] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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
          <div className="w-12 h-12 border-3 border-banana border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-ui text-base font-bold text-text uppercase tracking-wider">
            Fetching puzzle from Banana API...
          </p>
        </div>
      )}

      {/* 3. PLAYING STATE */}
      {gameState === 'playing' && gameData && (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-sm text-red-200 flex items-center justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-xs text-red-400 hover:text-red-200 ml-4 font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Decoupled Live Score HUD (consumes gameEvents with zero props from Game) */}
            <ScoreHud />

            {/* Header: Timer */}
            <div className="space-y-3 pb-4 border-b border-slate-800">
              <Timer
                round={gameData.round}
                onTimeout={handleTimeout}
                isActive={!isSubmitting && feedback === null}
                duration={30}
              />
            </div>

            {/* Answer Result Micro-Feedback */}
            {feedback && (
              <div
                className={`p-3.5 rounded-xl border text-center text-sm font-bold shadow-md transition-all ${
                  feedback.correct
                    ? 'bg-emerald-950/90 border-emerald-500/70 text-emerald-300'
                    : 'bg-red-950/90 border-red-500/70 text-red-300'
                }`}
              >
                {feedback.isTimeout
                  ? 'Time Ran Out! 0 points awarded'
                  : feedback.correct
                  ? `Correct! +${feedback.points} points awarded`
                  : 'Incorrect! 0 points awarded'}
              </div>
            )}

            {/* Puzzle Question Image Container */}
            <div className="w-full bg-slate-950 rounded-xl p-3 border border-slate-800 flex items-center justify-center min-h-[220px]">
              <img
                src={gameData.question}
                alt={`Banana Puzzle Round ${gameData.round}`}
                className="max-h-72 w-auto object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Selection Status */}
            <div className="text-center">
              <span className="text-xs text-slate-400">Selected Answer: </span>
              {selectedDigit !== null ? (
                <span className="inline-block px-3 py-1 ml-1 rounded-lg bg-yellow-400 text-slate-950 font-black font-mono text-sm">
                  {selectedDigit}
                </span>
              ) : (
                <span className="text-xs text-slate-500 italic">Press 0–9 or click below</span>
              )}
            </div>

            {/* Digit Selection Keypad */}
            <div>
              <DigitPad
                selectedDigit={selectedDigit}
                onSelectDigit={(digit) => !isSubmitting && !feedback && setSelectedDigit(digit)}
                disabled={isSubmitting || feedback !== null}
              />
            </div>

            {/* Action Footer: Submit and Keyboard Tips */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Keyboard: keys <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-yellow-400 font-mono font-bold">0-9</kbd> select, <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-yellow-400 font-mono font-bold">Enter</kbd> submits
              </div>

              <button
                type="button"
                disabled={selectedDigit === null || isSubmitting || feedback !== null}
                onClick={() => handleSubmitAnswer()}
                className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-sm shadow-md transition transform active:scale-95 cursor-pointer"
              >
                {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
