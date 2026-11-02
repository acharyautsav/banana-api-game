// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * EVENT-DRIVEN PROGRAMMING THEME: Timer Events (setInterval)
 * ============================================================================
 * The Timer component manages recurring temporal events:
 * 1. Timer Events:
 *    - Driven by a 1-second interval (setInterval) producing recurring tick events.
 *    - Automatically reset whenever the round prop advances.
 *    - Cleaned up on component unmount or round transition via clearInterval.
 * 2. Timeout Event Callback:
 *    - When the countdown reaches 0 seconds, it fires the `onTimeout` callback,
 *      instructing the parent component to auto-submit with a null answer.
 * 3. Visual Progression:
 *    - Prominent font-display digits showing remaining seconds with Timer icon.
 *    - Thick progress bar below tracking duration percentage.
 *    - Color shifts: >15s = cyan, <=15s = banana, <=7s = coral with pulse and glow.
 *
 * NOTE: The server is the authoritative source of truth for elapsed round time.
 * The client timer serves as an ergonomic GUI synchronization aid for the player.
 * ============================================================================
 */
import { useState, useEffect, useRef } from 'react';
import { Timer as TimerIcon } from 'lucide-react';
import { Card } from './ui/Card';

export const Timer = ({
  round,
  onTimeout,
  isActive = true,
  duration = 30,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timeoutCalledRef = useRef(false);
  const onTimeoutRef = useRef(onTimeout);

  // Keep latest onTimeout callback reference
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Reset timer on new round
  useEffect(() => {
    setTimeLeft(duration);
    timeoutCalledRef.current = false;
  }, [round, duration]);

  // Timer tick interval effect
  useEffect(() => {
    if (!isActive) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          // Trigger timeout event once
          if (!timeoutCalledRef.current) {
            timeoutCalledRef.current = true;
            onTimeoutRef.current?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [isActive, round]);

  const percentage = Math.max(0, Math.min(100, (timeLeft / duration) * 100));

  // Visual colour states based on urgency
  let digitColor = 'text-cyan';
  let iconColor = 'text-cyan';
  let barColor = 'bg-cyan';

  if (timeLeft <= 7) {
    digitColor = 'text-coral animate-pulse-fast';
    iconColor = 'text-coral animate-pulse-fast';
    barColor = 'bg-coral shadow-glow-coral';
  } else if (timeLeft <= 15) {
    digitColor = 'text-banana';
    iconColor = 'text-banana';
    barColor = 'bg-banana';
  }

  return (
    <Card bodyClassName="p-4 sm:p-5 flex flex-col items-center justify-center gap-3 w-full">
      <div className="flex items-center justify-center gap-3">
        <TimerIcon
          className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 transition-colors ${iconColor}`}
          aria-hidden="true"
        />
        <span
          role="timer"
          aria-live="off"
          className={`font-display text-5xl sm:text-6xl tracking-wider leading-none transition-colors ${digitColor}`}
        >
          {timeLeft}s
        </span>
      </div>

      {/* Accessible screen reader announcement only at 10s and 5s */}
      <div className="sr-only" aria-live="polite">
        {timeLeft === 10 ? '10 seconds remaining' : timeLeft === 5 ? '5 seconds remaining' : ''}
      </div>

      {/* Thick Progress Bar */}
      <div className="w-full h-3 rounded-full bg-raised border border-line overflow-hidden p-0.5">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${barColor}`}
        />
      </div>
    </Card>
  );
};

export default Timer;
