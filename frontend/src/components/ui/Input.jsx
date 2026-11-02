// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * GAME UI DESIGN SYSTEM: Input Component
 * ============================================================================
 * Game HUD input field featuring:
 * - Uppercase tactical label with monospace/display styling.
 * - Icon slot on the left (e.g. Mail, Lock, User).
 * - Automatic password show/hide visibility toggle.
 * - Glowing focus ring in cyan (#66c0f4) matching the game HUD theme.
 * - Dedicated error feedback slot with red accent.
 * - Helper text support and full accessibility association.
 * ============================================================================
 */
import React, { useState, useId } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const Input = React.forwardRef(
  (
    {
      label,
      type = 'text',
      icon = null,
      error = null,
      helperText = null,
      id: customId,
      className = '',
      required = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const isPassword = type === 'password';
    const [showPassword, setShowPassword] = useState(false);

    const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5 text-left">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block font-display text-xs font-bold uppercase tracking-wider text-[#8f98a0]"
          >
            {label}
            {required && <span className="text-[#fdc800] ml-1">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative flex items-center">
          {/* Left Icon Slot */}
          {icon && (
            <div className="absolute left-3.5 text-[#8f98a0] pointer-events-none flex items-center justify-center w-5 h-5">
              {icon}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            disabled={disabled}
            className={`w-full bg-[#1b2838] border text-white placeholder-[#8f98a0]/60 text-sm rounded-lg transition-all duration-150 py-2.5 outline-none font-sans ${
              icon ? 'pl-11' : 'pl-3.5'
            } ${isPassword ? 'pr-11' : 'pr-3.5'} ${
              error
                ? 'border-[#d94b4b] focus:border-[#d94b4b] focus:ring-2 focus:ring-[#d94b4b]/30'
                : 'border-[#2a3f55] focus:border-[#66c0f4] focus:ring-2 focus:ring-[#66c0f4]/25 hover:border-[#3d5a7a]'
            } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {/* Password Show/Hide Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-3 p-1 rounded text-[#8f98a0] hover:text-[#c7d5e0] transition focus:outline-none focus:ring-1 focus:ring-[#66c0f4] cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Error text */}
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-[#d94b4b] font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p className="text-xs text-[#8f98a0] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
