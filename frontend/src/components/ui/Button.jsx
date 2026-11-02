// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * GAME UI DESIGN SYSTEM: Button Component
 * ============================================================================
 * High-tactile game button with rich micro-interactions, custom glows, and
 * loading feedback.
 *
 * Variants:
 * - play: Tactical green gradient (#75b022 -> #588a1b) with vivid glow (Start Game, Submit, Play Again).
 * - brand: Banana yellow gradient with dark contrast text (Auth primary CTA).
 * - secondary: Slate panel-2 background with subtle border (Nav, actions, utility).
 * - ghost: Transparent borderless button with hover state.
 * - danger: Warning red gradient with pulse glow.
 *
 * Features:
 * - Built-in Spinner when loading=true (disables clicks).
 * - Optional icon slot with customizable placement (left or right).
 * - Visible focus ring (#66c0f4) for keyboard accessibility.
 * ============================================================================
 */
import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  play:
    'bg-gradient-to-b from-[#75b022] to-[#588a1b] hover:from-[#82c426] hover:to-[#629b1e] text-white font-bold shadow-[0_0_20px_rgba(117,176,34,0.35)] hover:shadow-[0_0_26px_rgba(164,208,7,0.5)] border border-[#8ed129]/40 active:brightness-95',
  brand:
    'bg-gradient-to-b from-[#fdc800] to-[#e5b400] hover:from-[#ffe04d] hover:to-[#fdc800] text-[#0e141b] font-black shadow-[0_0_18px_rgba(253,200,0,0.3)] hover:shadow-[0_0_26px_rgba(253,200,0,0.5)] border border-[#ffe04d]/50 active:brightness-95',
  secondary:
    'bg-[#1b2838] hover:bg-[#223348] text-[#c7d5e0] hover:text-white font-semibold border border-[#2a3f55] hover:border-[#3d5a7a] shadow-sm active:bg-[#16202d]',
  ghost:
    'bg-transparent hover:bg-[#1b2838]/80 text-[#8f98a0] hover:text-[#ffffff] font-medium active:bg-[#16202d]/90',
  danger:
    'bg-gradient-to-b from-[#d94b4b] to-[#b83838] hover:from-[#e56464] hover:to-[#c73e3e] text-white font-bold shadow-[0_0_18px_rgba(217,75,75,0.35)] hover:shadow-[0_0_26px_rgba(217,75,75,0.5)] border border-[#ff7b7b]/40 active:brightness-95',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-lg gap-2',
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

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center transition-all duration-150 transform active:scale-[0.98] cursor-pointer select-none font-sans outline-none focus-visible:ring-2 focus-visible:ring-[#66c0f4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e141b] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none ${variantStyle} ${sizeStyle} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin shrink-0 w-4 h-4" aria-hidden="true" />
        ) : (
          icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
        )}

        <span>{children}</span>

        {!loading && icon && iconPosition === 'right' && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
