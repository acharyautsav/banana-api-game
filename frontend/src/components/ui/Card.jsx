// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE UI: Card Component
 * ============================================================================
 * Primary container surface for game panels, stats, and match modules:
 * - Base: bg-surface, border border-line, rounded-2xl.
 * - Optional glow: 'banana' | 'jungle' | 'coral'
 * - Optional hoverLift: subtle translate-y-1 on hover
 * - Optional accentTop: thin gradient line along the top edge
 * ============================================================================
 */
import React from 'react';

const GLOW_STYLES = {
  banana: 'shadow-glow-banana border-banana/40',
  jungle: 'shadow-glow-jungle border-jungle/40',
  coral: 'shadow-glow-coral border-coral/40',
};

const ACCENT_GRADIENTS = {
  banana: 'from-transparent via-banana to-transparent',
  jungle: 'from-transparent via-jungle to-transparent',
  coral: 'from-transparent via-coral to-transparent',
  default: 'from-transparent via-banana/50 to-transparent',
};

export const Card = ({
  children,
  _variant = 'default',
  glow = null,
  hoverLift = false,
  accentTop = false,
  className = '',
  header = null,
  title = null,
  description = null,
  footer = null,
  ...props
}) => {
  const glowClass = glow ? GLOW_STYLES[glow] || '' : '';
  const hoverClass = hoverLift
    ? 'transition-transform duration-200 hover:-translate-y-1 hover:border-banana/40'
    : '';
  const accentGradient = glow ? ACCENT_GRADIENTS[glow] : ACCENT_GRADIENTS.default;

  return (
    <div
      className={`bg-surface border border-line rounded-2xl text-text relative overflow-hidden shadow-lg ${glowClass} ${hoverClass} ${className}`}
      {...props}
    >
      {/* Optional thin gradient line along top edge */}
      {accentTop && (
        <div
          className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${accentGradient} pointer-events-none`}
        />
      )}

      {/* Header section if provided */}
      {(header || title || description) && (
        <div className="p-5 pb-3 border-b border-line/60">
          {header}
          {title && (
            <h3 className="font-ui text-xl font-bold text-text tracking-wide uppercase">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs text-muted mt-1 font-sans">{description}</p>
          )}
        </div>
      )}

      {/* Main card body */}
      <div className="p-5">{children}</div>

      {/* Optional card footer */}
      {footer && (
        <div className="p-4 bg-raised/50 border-t border-line/60 rounded-b-2xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
