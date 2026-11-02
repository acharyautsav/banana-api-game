# ui-progress.md

The agent updates this file after every task: tick the box, add a one-line note, set "Next task".

**Current branch:** feature/ui-theme-foundation
**Next task:** U1-T3

## U1: feature/ui-theme-foundation
- [x] U1-T1 Design tokens, fonts, global background
- [x] U1-T2 Shared UI components (Button, Card, Input, Badge, Spinner, Skeleton, Avatar)
- [ ] U1-T3 Navbar and layout shell

## U2: feature/ui-notifications
- [ ] U2-T1 Toast provider + notify helper
- [ ] U2-T2 Auth toasts (register, login, logout, errors, session expired)
- [ ] U2-T3 Game and data-loading toasts

## U3: feature/ui-auth-pages
- [ ] U3-T1 Login page redesign (split layout)
- [ ] U3-T2 Signup page redesign + inline validation
- [ ] U3-T3 Password toggle, loading states, logged-in redirect

## U4: feature/ui-game-hub
- [ ] U4-T1 Hero banner + how it works
- [ ] U4-T2 Stats tiles + badges
- [ ] U4-T3 Recent games library list

## U5: feature/ui-gameplay
- [ ] U5-T1 In-game layout: HUD, timer, puzzle frame
- [ ] U5-T2 Keypad and submit restyle
- [ ] U5-T3 Answer feedback animations and round transitions
- [ ] U5-T4 Results page redesign

## U6: feature/ui-leaderboard-polish
- [ ] U6-T1 Leaderboard podium
- [ ] U6-T2 Leaderboard table, skeleton, empty state
- [ ] U6-T3 Responsive pass (360px to desktop)
- [ ] U6-T4 404 page + accessibility and reduced motion

## Notes / decisions
- U1-T1: Configured game-inspired design tokens in tailwind.config.js and index.css (@theme), loaded Rajdhani (600,700) and Inter (400,500,600) via Google Fonts in index.html, and added fixed atmospheric background with radial brand glow, custom dark scrollbar, and tabular numbers utility.
- U1-T2: Created reusable shared UI components in src/components/ui/ (Button with play/brand/secondary/ghost/danger variants and loading spinner, Card with panel/raised/framed styles, Input with icon slot and password visibility toggle, Badge, Spinner, Skeleton, and Avatar with deterministic username coloring) and re-exported via index.js.
