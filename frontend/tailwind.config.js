// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * TAILWIND CONFIGURATION: Game HUD Design System
 * ============================================================================
 * Inspired by PC game HUDs and indie game interfaces, combining dark blue-grey
 * panels, glowing interactive states, and a distinct banana-yellow brand accent.
 *
 * Tokens:
 * - Backgrounds: bg-deep (#0e141b), bg-nav (#171a21), bg-panel (#16202d), bg-panel-2 (#1b2838)
 * - Borders: border (#2a3f55)
 * - Typography: text (#c7d5e0), text-bright (#ffffff), text-muted (#8f98a0)
 * - Accents: brand (#fdc800), info (#66c0f4), success (#5ba32b / #a4d007), danger (#d94b4b), warning (#f59e0b)
 * - Fonts: display (Rajdhani 600/700), sans (Inter 400/500/600)
 * ============================================================================
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#0e141b',
        'bg-nav': '#171a21',
        'bg-panel': '#16202d',
        'bg-panel-2': '#1b2838',
        deep: '#0e141b',
        nav: '#171a21',
        panel: {
          DEFAULT: '#16202d',
          2: '#1b2838',
          raised: '#1b2838',
        },
        border: {
          DEFAULT: '#2a3f55',
          subtle: '#1e3044',
          accent: '#3d5a7a',
        },
        text: {
          DEFAULT: '#c7d5e0',
          bright: '#ffffff',
          muted: '#8f98a0',
        },
        bright: '#ffffff',
        muted: '#8f98a0',
        brand: {
          DEFAULT: '#fdc800',
          hover: '#ffe04d',
          glow: 'rgba(253, 200, 0, 0.35)',
        },
        info: {
          DEFAULT: '#66c0f4',
          hover: '#8ed1f8',
          glow: 'rgba(102, 192, 244, 0.35)',
        },
        success: {
          DEFAULT: '#5ba32b',
          light: '#a4d007',
          glow: 'rgba(91, 163, 43, 0.35)',
        },
        danger: {
          DEFAULT: '#d94b4b',
          hover: '#e56464',
          glow: 'rgba(217, 75, 75, 0.35)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.35)',
        },
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'game-panel': '0 8px 30px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'game-glow-brand': '0 0 20px rgba(253, 200, 0, 0.25)',
        'game-glow-play': '0 0 25px rgba(91, 163, 43, 0.35)',
        'game-glow-info': '0 0 20px rgba(102, 192, 244, 0.3)',
      },
    },
  },
  plugins: [],
};
