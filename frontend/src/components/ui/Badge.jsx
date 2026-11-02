// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE UI: Badge Component
 * ============================================================================
 * Small pill tag for stats, rank highlights, and status tags using design tokens:
 * - banana / brand: bg-banana/15, text-banana, border-banana/30
 * - jungle / success: bg-jungle/15, text-jungle, border-jungle/30
 * - coral / danger: bg-coral/15, text-coral, border-coral/30
 * - cyan / info: bg-cyan/15, text-cyan, border-cyan/30
 * - muted: bg-raised, text-muted, border-line
 * ============================================================================
 */
import React from 'react';

const BADGE_VARIANTS = {
  brand: 'bg-banana/15 text-banana border-banana/30',
  banana: 'bg-banana/15 text-banana border-banana/30',
  success: 'bg-jungle/15 text-jungle border-jungle/30',
  jungle: 'bg-jungle/15 text-jungle border-jungle/30',
  danger: 'bg-coral/15 text-coral border-coral/30',
  coral: 'bg-coral/15 text-coral border-coral/30',
  info: 'bg-cyan/15 text-cyan border-cyan/30',
  cyan: 'bg-cyan/15 text-cyan border-cyan/30',
  muted: 'bg-raised text-muted border-line',
};

const BADGE_SIZES = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1 text-sm gap-2',
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
      className={`inline-flex items-center font-ui uppercase tracking-wider font-bold border rounded-full select-none ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
