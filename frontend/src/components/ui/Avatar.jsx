// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * GAME UI DESIGN SYSTEM: Avatar Component
 * ============================================================================
 * Player avatar displaying their initial, with a deterministic background colour
 * derived from their username. Gives every player a distinct visual identity in
 * the navbar, leaderboard podium, and user profiles.
 * ============================================================================
 */
import React from 'react';

// Curated palette of tactical gamer avatar gradients
const AVATAR_PALETTES = [
  'from-[#3b82f6] to-[#1d4ed8] text-white border-[#60a5fa]/40', // Blue
  'from-[#10b981] to-[#047857] text-white border-[#34d399]/40', // Emerald
  'from-[#f59e0b] to-[#b45309] text-white border-[#fbbf24]/40', // Amber
  'from-[#8b5cf6] to-[#6d28d9] text-white border-[#a78bfa]/40', // Violet
  'from-[#ec4899] to-[#be185d] text-white border-[#f472b6]/40', // Pink
  'from-[#06b6d4] to-[#0e7490] text-white border-[#22d3ee]/40', // Cyan
  'from-[#fdc800] to-[#d97706] text-[#0e141b] border-[#ffe04d]/60 font-black', // Banana Gold
];

const AVATAR_SIZES = {
  sm: 'w-7 h-7 text-xs border',
  md: 'w-9 h-9 text-sm border',
  lg: 'w-12 h-12 text-lg border-2',
  xl: 'w-16 h-16 text-2xl border-2',
};

/**
 * Deterministically pick an avatar palette index from username string
 */
function getPaletteIndex(username = '') {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % AVATAR_PALETTES.length;
}

export const Avatar = ({
  username = '',
  size = 'md',
  className = '',
  ...props
}) => {
  const initial = username ? username.trim().charAt(0).toUpperCase() : '?';
  const paletteIndex = getPaletteIndex(username);
  const paletteClass = AVATAR_PALETTES[paletteIndex];
  const sizeClass = AVATAR_SIZES[size] || AVATAR_SIZES.md;

  return (
    <div
      title={username || 'Player Avatar'}
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br font-display font-bold shadow-md select-none shrink-0 ${paletteClass} ${sizeClass} ${className}`}
      {...props}
    >
      <span>{initial}</span>
    </div>
  );
};

export default Avatar;
