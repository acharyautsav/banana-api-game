// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE UI: Spinner Component
 * ============================================================================
 * Banana-colored loading indicator for async actions and API fetches.
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
  banana: 'text-banana',
  brand: 'text-banana',
  jungle: 'text-jungle',
  coral: 'text-coral',
  cyan: 'text-cyan',
  white: 'text-white',
  current: 'text-current',
};

export const Spinner = ({
  size = 'md',
  color = 'banana',
  className = '',
  label = 'Loading...',
  ...props
}) => {
  const sizeClass = SPINNER_SIZES[size] || SPINNER_SIZES.md;
  const colorClass = SPINNER_COLORS[color] || SPINNER_COLORS.banana;

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
