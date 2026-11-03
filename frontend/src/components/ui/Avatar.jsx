// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE UI: Avatar Component
 * ============================================================================
 * Player profile badge displaying the player's initial in a vibrant
 * banana-to-banana-deep gradient circle with dark ink text.
 * ============================================================================
 */
import React from 'react';

const AVATAR_SIZES = {
  sm: 'w-7 h-7 text-xs border border-banana-deep/40',
  md: 'w-9 h-9 text-sm border border-banana-deep/40',
  lg: 'w-12 h-12 text-lg border-2 border-banana-deep/50',
  xl: 'w-16 h-16 text-2xl border-2 border-banana-deep/50',
};

export const Avatar = ({
  username = '',
  size = 'md',
  className = '',
  ...props
}) => {
  const initial = username ? username.trim().charAt(0).toUpperCase() : '?';
  const sizeClass = AVATAR_SIZES[size] || AVATAR_SIZES.md;

  return (
    <div
      title={username || 'Player Avatar'}
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-banana to-banana-deep text-ink font-ui font-black shadow-md select-none shrink-0 ${sizeClass} ${className}`}
      {...props}
    >
      <span>{initial}</span>
    </div>
  );
};

export default Avatar;
