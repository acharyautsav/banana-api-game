// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * DigitPad Component
 * Renders an interactive 0-9 digit selection keypad for solving puzzles.
 * Captures user click events to select a single-digit answer (0-9) and visually
 * highlights the currently selected digit.
 */
export const DigitPad = ({ selectedDigit, onSelectDigit, disabled = false }) => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
        {digits.map((digit) => {
          const isSelected = selectedDigit === digit;

          return (
            <button
              key={digit}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDigit(digit)}
              aria-label={`Select digit ${digit}`}
              aria-pressed={isSelected}
              className={`h-13 sm:h-14 rounded-xl text-xl sm:text-2xl font-bold font-mono transition-all duration-150 cursor-pointer select-none flex items-center justify-center border ${
                isSelected
                  ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-lg shadow-yellow-400/30 scale-105 ring-2 ring-yellow-400/50'
                  : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700 hover:border-slate-600 hover:text-white'
              } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'active:scale-95'}`}
            >
              {digit}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DigitPad;
