// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * GAME UI DESIGN SYSTEM: Skeleton Component
 * ============================================================================
 * Pulsing placeholder block used for layout shifts during async data loading
 * (e.g. puzzle image loading, leaderboard ranks, profile stats).
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
      className={`animate-pulse bg-[#1b2838] border border-[#2a3f55]/40 shadow-inner ${
        variantStyles[variant] || variantStyles.rectangular
      } ${className}`}
      style={inlineStyles}
      aria-hidden="true"
      {...props}
    />
  );
};

export default Skeleton;
