# ui-task-prompts.md

The agent picks the next unchecked task in ui-progress.md and uses the prompt below. The agent also performs the git steps.

## COMMON RULES FOR EVERY TASK
- UI only. Do not touch `server/`, API calls, game logic, auth logic, event names or keyboard/timer behaviour (see ui-context.md hard constraints).
- Follow ui-design.md for tokens, components and the relevant page spec. Reuse shared components from `src/components/ui/`.
- Add the AI-assisted comment header to files you create or substantially edit.
- Verify: run the client build (no errors), open the affected page, check the browser console is clean.
- Update ui-progress.md, then commit with the exact message below, push, and report in 10-20 lines.

---

# U1: Theme foundation
**Branch:** `feature/ui-theme-foundation`

**Git (start):**
```
git checkout develop
git pull origin develop
git checkout -b feature/ui-theme-foundation
```

### U1-T1: Design tokens, fonts, global background
**Prompt:**
```
Task U1-T1. Set up the Steam-inspired design foundation (ui-design.md sections 1 and 2).
- Add the colour tokens to tailwind.config (and CSS variables where useful): bg-deep, bg-nav, bg-panel, bg-panel-2, border, text, text-bright, text-muted, brand, info, success, danger, warning.
- Load Rajdhani (600,700) and Inter (400,500,600) from Google Fonts in index.html with display=swap. Configure Tailwind font families: display = Rajdhani, sans = Inter.
- Global styles: body background = linear-gradient(to bottom, #1b2838 0%, #0e141b 65%) fixed, subtle radial yellow glow near the top, default text colour, smooth scrolling, custom dark scrollbar, tabular numbers utility.
- Do not restyle pages yet. Existing pages must still work (they may look slightly different).
```
**Commit:** `style(ui): add Steam-inspired design tokens, fonts and global background`

### U1-T2: Shared UI components
**Prompt:**
```
Task U1-T2. Create reusable components in src/components/ui/ following ui-design.md section 3: Button (variants play, brand, secondary, ghost, danger; sizes sm/md/lg; loading prop with spinner; icon prop), Card, Input (label, icon slot, error and helper text, works with a show/hide toggle later), Badge, Spinner, Skeleton, Avatar (initial + colour from username).
- Install lucide-react for icons.
- Add a short index.js that re-exports them.
- Create a temporary dev-only preview is NOT needed; just make sure they build and a quick usage on one existing page does not break anything (revert that usage if it looks wrong).
```
**Commit:** `feat(ui): add reusable Button, Card, Input, Badge, Spinner, Skeleton and Avatar components`

### U1-T3: Navbar and layout shell
**Prompt:**
```
Task U1-T3. Redesign the Navbar and the app layout (ui-design.md section 4).
- Sticky navbar, 56px, bg-nav, bottom border. Logo (banana + "Banana Puzzle" with "Puzzle" in brand yellow). Uppercase tab links PLAY (/game) and LEADERBOARD (/leaderboard) with an animated 2px underline on the active tab. Right side: Avatar + username + Logout button when logged in; Log In (ghost) and Sign Up (brand) when logged out.
- Keep the existing logout behaviour exactly as is.
- Wrap pages in a layout with a max-w-6xl container and a small footer ("Banana Puzzle · CIS046-3 · Powered by the Banana API").
- Make it responsive: on narrow screens the tabs wrap under the logo row.
```
**Commit:** `style(ui): redesign navbar and app layout shell`

**Git (finish):**
```
git push -u origin feature/ui-theme-foundation
git checkout develop
git merge --no-ff feature/ui-theme-foundation -m "merge: feature/ui-theme-foundation into develop"
git push origin develop
git tag -a v1.1.0 -m "UI theme foundation"
git push origin v1.1.0
```

---

# U2: Notifications
**Branch:** `feature/ui-notifications`

**Git (start):**
```
git checkout develop
git pull origin develop
git checkout -b feature/ui-notifications
```

### U2-T1: Toast provider + notify helper
**Prompt:**
```
Task U2-T1. Add the toast system (ui-design.md section 6).
- Install react-hot-toast. Mount <Toaster /> once in App with the themed style: bg-panel, border, rounded-lg, text colour, coloured left accent and lucide icon per type; position top-right (top-center on small screens); durations 3s success/info, 4.5s error.
- Create src/utils/notify.js exporting notify.success, notify.error, notify.info, notify.warning (message, optional id). Use ids so identical toasts never stack.
- Add aria-live friendly behaviour (react-hot-toast default is fine) and make sure toasts do not block clicks on the page behind them.
- Do not wire any actions yet.
```
**Commit:** `feat(notify): add themed toast provider and notify helper`

### U2-T2: Auth toasts
**Prompt:**
```
Task U2-T2. Add toasts for authentication using the message table in ui-design.md section 6:
- Register success ("Account created! Welcome, {username} 🍌"), register error (use the server message).
- Login success ("Welcome back, {username}!"), login error.
- Logout (info: "You've been logged out. See you soon!").
- Session expired: when an API call returns 401 while a user is logged in, show "Your session expired. Please log in again." once and send the user to /login (use an axios response interceptor; do not change the auth logic itself, and do not fire this on the initial /auth/me check for logged-out visitors).
- Network error: "Can't reach the server. Check your connection."
Place the toast calls in the existing login/register/logout handlers or AuthContext without changing what they do.
```
**Commit:** `feat(notify): add toast feedback for register, login and logout`

### U2-T3: Game and data-loading toasts
**Prompt:**
```
Task U2-T3. Add toasts for gameplay and data loading (ui-design.md section 6):
- Game started, correct answer ("Correct! +{points} points"), wrong ("Wrong! The answer was {digit}"), timeout ("Time's up!"), game finished ("Game complete! You scored {score}").
- Puzzle API failure ("Puzzle service unavailable. Please try again.").
- Failed loading of leaderboard, recent games/history, and results.
Rules: toasts must be short, must not block keyboard input or the next round, and must not change the game flow or event emission. Use the existing event handlers/responses; do not add extra API calls.
```
**Commit:** `feat(notify): add toast feedback for game events and data loading errors`

**Git (finish):**
```
git push -u origin feature/ui-notifications
git checkout develop
git merge --no-ff feature/ui-notifications -m "merge: feature/ui-notifications into develop"
git push origin develop
git tag -a v1.2.0 -m "Toast notifications"
git push origin v1.2.0
```

---

# U3: Auth pages
**Branch:** `feature/ui-auth-pages`

**Git (start):**
```
git checkout develop
git pull origin develop
git checkout -b feature/ui-auth-pages
```

### U3-T1: Login page redesign
**Prompt:**
```
Task U3-T1. Redesign /login (ui-design.md "Login / Signup").
- Create an AuthLayout component: centred split card (max-w-4xl). Left panel (hidden below md): gradient banner, large banana, tagline "Solve. Climb. Repeat.", three bullets (5 rounds of live puzzles, 30s timer, global leaderboard). Right panel: the form area.
- Login form uses the shared Input (email with mail icon, password with lock icon), a full-width brand Button, error alert box above the form, and a link to /signup.
- Keep the existing submit logic and field names exactly.
```
**Commit:** `style(auth): redesign login page with split layout`

### U3-T2: Signup page redesign + inline validation
**Prompt:**
```
Task U3-T2. Redesign /signup with the same AuthLayout.
- Fields: username (user icon), email, password (min 6, helper text). Inline validation on blur: username 3+ chars, valid email format, password 6+ chars, with error text under each field and red border.
- Disable submit while invalid or submitting. Keep the existing submit logic and field names exactly. Link to /login.
```
**Commit:** `style(auth): redesign signup page with inline validation`

### U3-T3: Password toggle, loading states, logged-in redirect
**Prompt:**
```
Task U3-T3. Auth polish.
- Show/hide password toggle (eye icon, accessible label) on both forms.
- Buttons show the loading spinner while the request is in flight and ignore double clicks.
- Autofocus the first field. Pressing Enter submits.
- If a logged-in user visits /login or /signup, redirect to /game (UI routing only; no auth logic changes).
```
**Commit:** `feat(auth-ui): add password toggle, loading states and logged-in redirect`

**Git (finish):**
```
git push -u origin feature/ui-auth-pages
git checkout develop
git merge --no-ff feature/ui-auth-pages -m "merge: feature/ui-auth-pages into develop"
git push origin develop
git tag -a v1.3.0 -m "Auth pages redesign"
git push origin v1.3.0
```

---

# U4: Game hub
**Branch:** `feature/ui-game-hub`

**Git (start):**
```
git checkout develop
git pull origin develop
git checkout -b feature/ui-game-hub
```

### U4-T1: Hero banner + how it works
**Prompt:**
```
Task U4-T1. Redesign the idle state of /game (ui-design.md "Game hub").
- Hero capsule: large gradient panel with the banana art, title "Banana Puzzle Challenge" (Rajdhani), a one-line description, tag chips (Puzzle, Maths, Single-player, Timed), and a large green Start Game button (play variant, play icon). Keep the existing start logic.
- Next to it a "How it works" card with 3 numbered steps (Solve the missing digit / 30 seconds per round / Faster answers score more).
- Greeting uses the username.
```
**Commit:** `style(game): redesign game hub with hero banner and how-it-works`

### U4-T2: Stats tiles + badges
**Prompt:**
```
Task U4-T2. Add to the hub, using the EXISTING history data (no new endpoints):
- Stats row, 4 tiles: Games played, Best score, Total correct answers, Accuracy %.
- Badges row: First Game, Perfect 5/5, Score 500+, 5 Games Played. Unlocked = coloured with icon, locked = greyed with lock icon and a short "how to unlock" tooltip/title.
- Compute everything client-side in a small helper (utils/stats.js). Handle empty history gracefully (zeros, all locked).
```
**Commit:** `feat(game-ui): add player stats tiles and achievement badges to hub`

### U4-T3: Recent games library list
**Prompt:**
```
Task U4-T3. Restyle "My Recent Games" as a library-style list: each row has a banana thumbnail, score in brand yellow, 5 pips (green = correct, red = wrong, based on the existing per-game correct count if per-round data is not available just show X filled pips), date/time, and a "View breakdown" link to the existing results route. Skeleton rows while loading, friendly empty state with a Start Game button. Keep existing data fetching.
```
**Commit:** `style(game): restyle recent games as a library-style list`

**Git (finish):**
```
git push -u origin feature/ui-game-hub
git checkout develop
git merge --no-ff feature/ui-game-hub -m "merge: feature/ui-game-hub into develop"
git push origin develop
git tag -a v1.4.0 -m "Game hub redesign"
git push origin v1.4.0
```

---

# U5: Gameplay
**Branch:** `feature/ui-gameplay`

**Git (start):**
```
git checkout develop
git pull origin develop
git checkout -b feature/ui-gameplay
```

### U5-T1: In-game layout (HUD, timer, puzzle frame)
**Prompt:**
```
Task U5-T1. Redesign the playing state of /game (ui-design.md "In-game").
- HUD: Score, Round x/5, Streak as three stat tiles with icons.
- Timer: bar with seconds on the right; green above 10s, amber 5-10s, red with gentle pulse under 5s. Keep the existing countdown logic and timeout event exactly; only change presentation.
- Puzzle panel: framed with accent corner marks, centred image keeping aspect ratio, Skeleton while the image loads.
Keep the ScoreHud subscription to the event bus working.
```
**Commit:** `style(game): redesign in-game HUD, timer and puzzle frame`

### U5-T2: Keypad and submit restyle
**Prompt:**
```
Task U5-T2. Restyle the DigitPad and submit area.
- Large square digit keys 0-9 in a 5x2 grid; selected key gets a brand-yellow ring and glow; subtle press animation; hover in info blue.
- Submit button uses the play variant, disabled until a digit is selected, shows loading state while submitting.
- Keep keyboard hint chips (0-9 select, Enter submits). All click and keyboard behaviour must work exactly as before.
```
**Commit:** `style(game): restyle digit keypad and submit button`

### U5-T3: Answer feedback animations and round transitions
**Prompt:**
```
Task U5-T3. Add feedback animation for the existing feedback state (about 1 second after each answer):
- Correct: green flash on the puzzle panel and a floating "+points".
- Wrong: red shake on the panel and show "Answer was X".
- Timeout: amber "Time's up" overlay.
- Fade/slide transition between rounds.
- Wrap all motion in a prefers-reduced-motion check (no shake/pulse for reduced motion).
Use CSS transitions/keyframes in Tailwind config or a small CSS file; no new animation libraries. Do not change when/how the next round loads.
```
**Commit:** `feat(game-ui): add answer feedback animations and round transitions`

### U5-T4: Results page redesign
**Prompt:**
```
Task U5-T4. Redesign /results/:id (ui-design.md "Results"). Read the current page first.
- Hero panel: score counting up (respect reduced motion), letter grade badge (S >= 650, A >= 500, B >= 350, C >= 150, else D), "X / 5 correct" and 5 pips.
- Per-round cards in a responsive grid: puzzle thumbnail, your answer vs correct answer, points, green/red left border.
- Actions: Play Again (play variant -> /game) and View Leaderboard (secondary).
- Skeleton while loading, error state with retry button. Keep the data fetching unchanged.
```
**Commit:** `style(results): redesign results page with grade, count-up score and round cards`

**Git (finish):**
```
git push -u origin feature/ui-gameplay
git checkout develop
git merge --no-ff feature/ui-gameplay -m "merge: feature/ui-gameplay into develop"
git push origin develop
git tag -a v1.5.0 -m "Gameplay and results redesign"
git push origin v1.5.0
```

---

# U6: Leaderboard and polish
**Branch:** `feature/ui-leaderboard-polish`

**Git (start):**
```
git checkout develop
git pull origin develop
git checkout -b feature/ui-leaderboard-polish
```

### U6-T1: Leaderboard podium
**Prompt:**
```
Task U6-T1. Redesign the top of /leaderboard (ui-design.md "Leaderboard").
- Header banner with trophy, title, subtitle and a Play Game button (play variant).
- Podium for the top 3 players: order 2nd, 1st, 3rd with the 1st card taller; gold/silver/bronze accents; Avatar initial, username, best score in brand yellow, games played. Highlight the logged-in user's card with a ring and a "You" badge.
- Handle fewer than 3 players gracefully. Keep existing data fetching.
```
**Commit:** `style(leaderboard): add podium for top three players`

### U6-T2: Leaderboard table, skeleton, empty state
**Prompt:**
```
Task U6-T2. Complete the leaderboard.
- Table/list for ranks 4-10 (or all rows if there is no podium data): rank, Avatar + username, best score, games played. Logged-in user's row highlighted with a yellow left border and "You" badge.
- Skeleton rows while loading, friendly empty state when there are no games, retry button on error.
- Keep the footer note about verified Banana API completions.
```
**Commit:** `style(leaderboard): restyle ranking table with skeleton and empty states`

### U6-T3: Responsive pass
**Prompt:**
```
Task U6-T3. Responsive pass over every page: login, signup, hub, playing, results, leaderboard, navbar.
- Test at 360px, 768px and 1280px widths. No horizontal scroll, tap targets at least 40px, keypad still usable on phones, podium stacks sensibly, tables scroll or collapse nicely.
- Fix any overflow or spacing issues using Tailwind responsive utilities only.
```
**Commit:** `style(ui): make all pages responsive from 360px to desktop`

### U6-T4: 404 page + accessibility
**Prompt:**
```
Task U6-T4. Final polish.
- Add a NotFound page (banana, message, button to /game) and route it as the catch-all.
- Accessibility: visible focus rings on all interactive elements, labels tied to inputs, aria-live on the feedback overlay, alt text on images, aria-labels on icon-only buttons, check text contrast on panels, respect prefers-reduced-motion globally.
- Remove unused styles/components from the old UI and any console warnings.
```
**Commit:** `feat(ui): add 404 page and accessibility improvements`

**Git (finish + final release):**
```
git push -u origin feature/ui-leaderboard-polish
git checkout develop
git merge --no-ff feature/ui-leaderboard-polish -m "merge: feature/ui-leaderboard-polish into develop"
git push origin develop
git tag -a v1.6.0 -m "Leaderboard and polish"
git push origin v1.6.0

# Final release
git checkout main
git pull origin main
git merge --no-ff develop -m "release: v2.0.0 UI redesign"
git tag -a v2.0.0 -m "UI redesign with notifications"
git push origin main --tags
git checkout develop
```
