// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * EVENT-DRIVEN PROGRAMMING THEME: DigitPad Component
 * ============================================================================
 * Renders an arcade numeric keypad for solving Banana API puzzles:
 * 1. Prominent Answer Display Slot:
 *    - Displays selected digit with tactile pop animation.
 *    - Shows muted "?" when no digit is currently chosen.
 * 2. 5x2 Chunky Keypad:
 *    - 10 tactile arcade keys (1-9, 0) with min 56px tap target.
 *    - Selected state glows in banana with ink text.
 *    - Locked state maintains high text contrast at opacity-60 without muddy greys.
 * 3. Physical Keyboard Guidance:
 *    - Styled kbd badges indicating [0-9] selects and [Enter] submits.
 * ============================================================================
 */
import React from 'react';

export const DigitPad = ({
  selectedDigit,
  onSelectDigit,
  disabled = false,
  locked = false,
}) => {
  const isLocked = disabled || locked;
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="w-full">
      {/* 1. Answer Display Slot */}
      <div className="h-20 w-full rounded-2xl bg-raised border border-line flex flex-col items-center justify-center relative mb-4 shadow-sm">
        <span className="font-ui text-[10px] sm:text-xs uppercase tracking-wider text-muted font-bold mb-0.5">
          YOUR ANSWER
        </span>
        <div className="flex items-center justify-center h-10">
          {selectedDigit !== null ? (
            <span
              key={selectedDigit}
              className="font-display text-5xl text-banana leading-none animate-pop select-none"
            >
              {selectedDigit}
            </span>
          ) : (
            <span className="font-display text-3xl text-muted/60 leading-none select-none">
              ?
            </span>
          )}
        </div>
      </div>

      {/* 2. Keypad (5 columns x 2 rows) */}
      <div className="grid grid-cols-5 gap-3" role="group" aria-label="Numeric answer keypad">
        {digits.map((digit) => {
          const isSelected = selectedDigit === digit;

          // State styling
          let keyStateClasses = '';
          if (isLocked) {
            keyStateClasses = isSelected
              ? 'bg-banana text-ink border-banana shadow-glow-banana opacity-60 cursor-not-allowed'
              : 'bg-raised border-line text-text opacity-60 cursor-not-allowed';
          } else if (isSelected) {
            keyStateClasses =
              'bg-banana text-ink border-banana shadow-glow-banana font-black scale-[1.02] cursor-pointer';
          } else {
            keyStateClasses =
              'bg-raised border-line text-text hover:border-banana/60 hover:-translate-y-0.5 active:scale-[0.95] cursor-pointer';
          }

          return (
            <button
              key={digit}
              type="button"
              disabled={isLocked}
              onClick={() => onSelectDigit(digit)}
              aria-label={`Digit ${digit}`}
              aria-pressed={isSelected}
              className={`min-h-14 md:min-h-16 rounded-xl border font-ui font-bold text-2xl select-none flex items-center justify-center transition-all duration-150 outline-none focus-visible:outline-2 focus-visible:outline-banana ${keyStateClasses}`}
            >
              {digit}
            </button>
          );
        })}
      </div>

      {/* 3. Keyboard Shortcut Guidance */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3 text-xs text-muted font-sans">
        <span>Keyboard:</span>
        <kbd className="px-1.5 py-0.5 rounded-md bg-raised border border-line text-banana font-mono text-[11px] font-bold">
          0-9
        </kbd>
        <span>select,</span>
        <kbd className="px-1.5 py-0.5 rounded-md bg-raised border border-line text-banana font-mono text-[11px] font-bold">
          Enter
        </kbd>
        <span>submit</span>
      </div>
    </div>
  );
};

export default DigitPad;
