// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * GAME UI DESIGN SYSTEM: Spinner Component
 * ============================================================================
 * Animated loading ring for asynchronous game actions, API calls, and asset loading.
 * ============================================================================
 */
import React from 'react';
import { Loader2 } from 'lucide-react';

const SPINNER_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

const SPINNER_COLORS = {
  brand: 'text-[#fdc800]',
  info: 'text-[#66c0f4]',
  white: 'text-white',
  current: 'text-current',
};

export const Spinner = ({
  size = 'md',
  color = 'brand',
  className = '',
  label = 'Loading...',
  ...props
}) => {
  const sizeClass = SPINNER_SIZES[size] || SPINNER_SIZES.md;
  const colorClass = SPINNER_COLORS[color] || SPINNER_COLORS.brand;

  return (
    <div
      role="status"
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      <Loader2
        className={`animate-spin ${sizeClass} ${colorClass}`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Spinner;
