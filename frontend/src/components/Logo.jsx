// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE BRANDING: Logo Component
 * ============================================================================
 * Renders the official Banana Arcade game logo mark alongside the custom
 * arcade wordmark "BANANA PUZZLE" in Bungee font.
 *
 * Props:
 * - size: "sm" | "md" | "lg" (controls image dimension and wordmark font size)
 * - showText: boolean (default true; set false for compact icon-only placements)
 * ============================================================================
 */
import React from 'react';
import logoImg from '../assets/logo.png';

const SIZES = {
  sm: {
    image: 'w-6 h-6',
    text: 'text-sm',
    gap: 'gap-2',
  },
  md: {
    image: 'w-9 h-9',
    text: 'text-lg',
    gap: 'gap-2.5',
  },
  lg: {
    image: 'w-14 h-14',
    text: 'text-2xl',
    gap: 'gap-3.5',
  },
};

export const Logo = ({
  size = 'md',
  showText = true,
  className = '',
  ...props
}) => {
  const sizeConfig = SIZES[size] || SIZES.md;

  return (
    <div
      className={`inline-flex items-center select-none ${sizeConfig.gap} ${className}`}
      {...props}
    >
      {/* Game Logo Mark */}
      <img
        src={logoImg}
        alt="Banana Puzzle Logo"
        className={`${sizeConfig.image} object-contain rounded-lg drop-shadow-md shrink-0`}
        loading="eager"
      />

      {/* Arcade Wordmark */}
      {showText && (
        <span
          className={`font-display tracking-wider leading-none uppercase ${sizeConfig.text}`}
        >
          <span className="text-text">BANANA</span>{' '}
          <span className="text-banana drop-shadow-[0_0_12px_rgba(255,200,41,0.35)]">
            PUZZLE
          </span>
        </span>
      )}
    </div>
  );
};

export default Logo;
