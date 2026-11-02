// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * GAME UI DESIGN SYSTEM: Badge Component
 * ============================================================================
 * Small pill tag used for status, rounds, categories, and player highlights.
 *
 * Variants:
 * - brand: Yellow banana accent (#fdc800) with dark backdrop.
 * - info: Cyan accent (#66c0f4) for active states, tags, hints.
 * - success: Tactical green (#a4d007) for correct answers and verified items.
 * - muted: Slate neutral (#8f98a0) for secondary metadata.
 * - danger: Alert red (#d94b4b) for incorrect answers and timeouts.
 * ============================================================================
 */
import React from 'react';

const BADGE_VARIANTS = {
  brand: 'bg-[#fdc800]/15 text-[#fdc800] border-[#fdc800]/30',
  info: 'bg-[#66c0f4]/15 text-[#66c0f4] border-[#66c0f4]/35',
  success: 'bg-[#5ba32b]/20 text-[#a4d007] border-[#5ba32b]/40',
  muted: 'bg-[#1b2838] text-[#8f98a0] border-[#2a3f55]',
  danger: 'bg-[#d94b4b]/15 text-[#ff7b7b] border-[#d94b4b]/35',
};

const BADGE_SIZES = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

export const Badge = ({
  children,
  variant = 'brand',
  size = 'md',
  icon = null,
  className = '',
  ...props
}) => {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.brand;
  const sizeClass = BADGE_SIZES[size] || BADGE_SIZES.md;

  return (
    <span
      className={`inline-flex items-center font-display uppercase tracking-wider font-bold border rounded-full select-none ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
