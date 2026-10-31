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
 *    - Progress bar and digital countdown number.
 *    - Visual state shift: changes to warning/urgent red in the final 10 seconds.
 *
 * NOTE: The server is the authoritative source of truth for elapsed round time.
 * The client timer serves as an ergonomic GUI synchronization aid for the player.
 * ============================================================================
 */
import { useState, useEffect, useRef } from 'react';

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
  const isUrgent = timeLeft <= 10;

  return (
    <div className="w-full space-y-1.5" role="timer" aria-live="polite">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wider text-slate-400">
          Time Remaining
        </span>
        <span
          className={`font-mono font-black text-sm px-2 py-0.5 rounded ${
            isUrgent
              ? 'text-red-400 bg-red-950/80 border border-red-800 animate-pulse'
              : 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/80'
          }`}
        >
          {timeLeft}s
        </span>
      </div>

      {/* Visual Countdown Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${
            isUrgent
              ? 'bg-gradient-to-r from-red-600 to-rose-500'
              : 'bg-gradient-to-r from-emerald-500 to-teal-400'
          }`}
        />
      </div>
    </div>
  );
};

export default Timer;
