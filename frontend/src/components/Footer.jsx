// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE UI: Footer Component
 * ============================================================================
 * Slim, centered, muted footer with small Logo mark and course/API credit.
 * Sits pinned to the bottom of the viewport using flex layout without boxed containers.
 * ============================================================================
 */
import React from 'react';
import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="w-full py-4 border-t border-line/60 bg-surface/40 backdrop-blur-sm text-center text-xs text-muted mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-2.5 flex-wrap">
        <Logo size="sm" showText={false} />
        <span>
          Banana Puzzle · CIS046-3 · Powered by the Banana API
        </span>
      </div>
    </footer>
  );
};

export default Footer;
