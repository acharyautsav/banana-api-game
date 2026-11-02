// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE UI: Skeleton Component
 * ============================================================================
 * Raised background placeholder with subtle technical shimmer effect for
 * loading states without layout shifts.
 * ============================================================================
 */
import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'rectangular', // 'rectangular' | 'circular' | 'text'
  width,
  height,
  style = {},
  ...props
}) => {
  const variantStyles = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4 my-1',
  };

  const inlineStyles = {
    ...style,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return (
    <div
      className={`relative overflow-hidden bg-raised border border-line/40 ${
        variantStyles[variant] || variantStyles.rectangular
      } ${className}`}
      style={inlineStyles}
      aria-hidden="true"
      {...props}
    >
      {/* Subtle shimmer gradient sweep */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
};

export default Skeleton;
