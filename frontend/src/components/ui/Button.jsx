// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE UI: Button Component
 * ============================================================================
 * High-tactile arcade game button featuring tokenized variants:
 * - primary: bg-banana, text-ink, font-ui bold uppercase tracking-wide,
 *   hover: bg-banana-hover + shadow-glow-banana + translate-y -0.5, active: scale-[.97]
 * - secondary: bg-raised, border border-line, text-text, hover:border-banana/50
 * - ghost: transparent, text-muted, hover:bg-raised and text-text
 * - danger: bg-coral/15, text-coral, border border-coral/30, hover:bg-coral hover:text-ink
 *
 * Supports:
 * - sizes: sm, md, lg
 * - loading state with Spinner
 * - leftIcon, rightIcon (plus legacy icon/iconPosition)
 * - focus-visible ring in banana
 * ============================================================================
 */
import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-banana text-ink font-ui font-bold uppercase tracking-wide hover:bg-banana-hover hover:shadow-glow-banana hover:-translate-y-0.5 active:scale-[0.97] border border-banana-deep/40 shadow-sm',
  secondary:
    'bg-raised border border-line text-text font-ui font-semibold hover:border-banana/50 hover:text-white hover:-translate-y-0.5 active:scale-[0.97] shadow-sm',
  ghost:
    'bg-transparent text-muted font-ui font-medium hover:bg-raised hover:text-text active:scale-[0.98]',
  danger:
    'bg-coral/15 text-coral border border-coral/30 font-ui font-bold uppercase tracking-wide hover:bg-coral hover:text-ink hover:shadow-glow-coral hover:-translate-y-0.5 active:scale-[0.97]',
  // Legacy aliases
  play:
    'bg-banana text-ink font-ui font-bold uppercase tracking-wide hover:bg-banana-hover hover:shadow-glow-banana hover:-translate-y-0.5 active:scale-[0.97] border border-banana-deep/40',
  brand:
    'bg-banana text-ink font-ui font-bold uppercase tracking-wide hover:bg-banana-hover hover:shadow-glow-banana hover:-translate-y-0.5 active:scale-[0.97] border border-banana-deep/40',
};

const SIZES = {
  sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
};

export const Button = React.forwardRef(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      loading = false,
      disabled = false,
      leftIcon = null,
      rightIcon = null,
      // legacy support
      icon = null,
      iconPosition = 'left',
      type = 'button',
      className = '',
      ...props
    },
    ref
  ) => {
    const variantStyle = VARIANTS[variant] || VARIANTS.secondary;
    const sizeStyle = SIZES[size] || SIZES.md;
    const isDisabled = disabled || loading;

    // Resolve icons supporting both new leftIcon/rightIcon and legacy icon prop
    const effectiveLeftIcon = leftIcon || (icon && iconPosition === 'left' ? icon : null);
    const effectiveRightIcon = rightIcon || (icon && iconPosition === 'right' ? icon : null);

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none outline-none focus-visible:outline-2 focus-visible:outline-banana focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${variantStyle} ${sizeStyle} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin shrink-0 w-4 h-4" aria-hidden="true" />
        ) : (
          effectiveLeftIcon && <span className="shrink-0">{effectiveLeftIcon}</span>
        )}

        {children && <span>{children}</span>}

        {!loading && effectiveRightIcon && (
          <span className="shrink-0">{effectiveRightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
