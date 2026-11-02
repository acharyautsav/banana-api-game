// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE UI: Input Component
 * ============================================================================
 * Game HUD input field featuring:
 * - Base: bg-raised, border border-line, rounded-xl, text-text, placeholder:text-muted.
 * - Focus: border-banana + soft banana ring/glow.
 * - Optional leftIcon prop (Lucide icon) and error prop (coral border + coral message).
 * - Label support with font-ui styling.
 * - Automatic password toggle if type="password".
 * ============================================================================
 */
import React, { useState, useId } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const Input = React.forwardRef(
  (
    {
      label,
      type = 'text',
      leftIcon = null,
      icon = null, // legacy alias for leftIcon
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
    const effectiveLeftIcon = leftIcon || icon;

    return (
      <div className="w-full space-y-1.5 text-left">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block font-ui text-xs font-bold uppercase tracking-wider text-muted"
          >
            {label}
            {required && <span className="text-banana ml-1">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative flex items-center">
          {/* Left Icon Slot */}
          {effectiveLeftIcon && (
            <div className="absolute left-3.5 text-muted pointer-events-none flex items-center justify-center w-5 h-5">
              {effectiveLeftIcon}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            disabled={disabled}
            className={`w-full bg-raised border text-text placeholder:text-muted/60 text-sm rounded-xl transition-all duration-150 py-2.5 outline-none font-sans ${
              effectiveLeftIcon ? 'pl-11' : 'pl-3.5'
            } ${isPassword ? 'pr-11' : 'pr-3.5'} ${
              error
                ? 'border-coral focus:border-coral focus:ring-2 focus:ring-coral/25'
                : 'border-line focus:border-banana focus:ring-2 focus:ring-banana/25 hover:border-line/80'
            } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {/* Password Show/Hide Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute right-3 p-1 rounded text-muted hover:text-text transition focus:outline-none focus:ring-1 focus:ring-banana cursor-pointer"
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
          <p className="flex items-center gap-1.5 text-xs text-coral font-medium mt-1 font-sans">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {/* Helper text */}
        {!error && helperText && (
          <p className="text-xs text-muted mt-1 font-sans">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
