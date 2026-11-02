// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * GAME UI DESIGN SYSTEM: Card Component
 * ============================================================================
 * Implements a tactical game panel with dark blue-grey surface (#16202d),
 * border accents (#2a3f55), and deep drop-shadows.
 *
 * Variants:
 * - default: Standard panel surface (#16202d) with subtle top highlight.
 * - raised: Slightly lighter elevated panel (#1b2838) for modal cards or inputs.
 * - framed: Includes tactical corner notch markings for important in-game sections.
 * ============================================================================
 */
import React from 'react';

export const Card = ({
  children,
  variant = 'default',
  className = '',
  header = null,
  title = null,
  description = null,
  footer = null,
  ...props
}) => {
  const isRaised = variant === 'raised';
  const isFramed = variant === 'framed';

  const baseStyle = isRaised
    ? 'bg-[#1b2838] border border-[#2a3f55] shadow-[0_12px_35px_rgba(0,0,0,0.7)]'
    : 'bg-[#16202d] border border-[#2a3f55] shadow-[0_10px_30px_rgba(0,0,0,0.65)]';

  return (
    <div
      className={`rounded-xl text-[#c7d5e0] relative overflow-hidden ${baseStyle} ${
        isFramed ? 'hud-frame' : ''
      } ${className}`}
      {...props}
    >
      {/* Top subtle highlight line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* Header section if provided via props */}
      {(header || title || description) && (
        <div className="p-5 pb-3 border-b border-[#2a3f55]/60">
          {header}
          {title && (
            <h3 className="font-display text-xl font-bold text-white tracking-wide">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-[#8f98a0] mt-1">{description}</p>
          )}
        </div>
      )}

      {/* Main card body */}
      <div className="p-5">{children}</div>

      {/* Optional card footer */}
      {footer && (
        <div className="p-4 bg-[#121922] border-t border-[#2a3f55]/60 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
