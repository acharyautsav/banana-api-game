# ui-design.md (design spec: the "architecture" of the UI phase)

Inspiration: Steam's dark blue-grey store/library feel, green "Play/Install" buttons, hero capsules, activity lists, achievements, and podium-style rankings. Make it ORIGINAL: do not use Steam's logo, fonts, icons or artwork.

## 1. Design tokens (define in tailwind.config + CSS variables)
| Token | Value | Use |
|---|---|---|
| `bg-deep` | #0e141b | page bottom / deepest areas |
| `bg-nav` | #171a21 | navbar |
| `bg-panel` | #16202d | cards |
| `bg-panel-2` | #1b2838 | raised cards, inputs, hover |
| `border` | #2a3f55 | card/input borders |
| `text` | #c7d5e0 | body text |
| `text-bright` | #ffffff | headings |
| `text-muted` | #8f98a0 | secondary text |
| `brand` | #fdc800 | banana yellow: logo accent, scores, highlights |
| `info` | #66c0f4 | links, hover, focus rings, active tab |
| `success` | #5ba32b (light #a4d007) | Play/Start/Submit buttons, correct |
| `danger` | #d94b4b | wrong, errors |
| `warning` | #f59e0b | time running out, timeout |

Page background: `linear-gradient(to bottom, #1b2838 0%, #0e141b 65%)` fixed, plus a very subtle radial yellow glow near the top centre.
Radius: cards `rounded-xl`, buttons/inputs `rounded-lg`. Shadows: soft dark; glow only on primary buttons.

## 2. Typography
- Headings/display: **Rajdhani** (600/700), uppercase tracking on small labels.
- Body: **Inter**.
- Numbers (scores, timer, digits): tabular-nums / monospace feel.
Load via Google Fonts in `index.html` (display=swap).

## 3. Shared components (src/components/ui/)
- **Button**: variants `play` (green gradient #75b022 to #588a1b, white text, subtle glow, used for Start Game / Submit / Play Again), `brand` (yellow, used for Sign Up / main auth CTA), `secondary` (panel-2 with border), `ghost` (text only), `danger`. Sizes sm/md/lg. Props: `loading` (spinner + disabled), `icon`. Visible focus ring (info colour).
- **Card**: panel background, border, rounded-xl, optional header.
- **Input**: label above (uppercase small), icon slot, error text, helper text, focus ring info colour; works for password with show/hide toggle.
- **Badge**: small pill (variants: brand, info, success, muted).
- **Spinner**, **Skeleton** (pulsing block) for loading states.
- **Avatar**: circle with the user's initial, colour derived from username.
Icons: `lucide-react` replaces most emoji (keep the banana emoji as the brand mark).

## 4. Layout and navbar
- Navbar: sticky, height 56px, `bg-nav`, bottom border. Left: banana logo + "Banana Puzzle" (Puzzle in yellow). Centre/left: uppercase tab links (PLAY, LEADERBOARD) with a 2px underline on the active tab (info blue). Right: Avatar + username + Logout (secondary, sm). Logged out: Log In (ghost) + Sign Up (brand).
- Content container: `max-w-6xl`, horizontal padding, vertical rhythm 24-32px.
- Small footer: "Banana Puzzle · CIS046-3 · Powered by the Banana API".
- Responsive: navbar collapses tabs under the logo row on small screens; everything usable at 360px width.

## 5. Page specs
### Login / Signup
Split card (max-w-4xl, centred). Left panel (hidden on mobile): gradient banner with large banana, tagline "Solve. Climb. Repeat.", three bullet points (5 rounds of live puzzles, 30s timer, global leaderboard). Right: form. Features: icon inputs, show/hide password, inline validation on blur (username 3+ chars, valid email, password 6+), submit button with loading spinner, server error shown in an alert box above the form, link to the other page. Already-logged-in users visiting these pages are redirected to `/game`.

### Game hub (idle `/game`)
- Hero "capsule" banner: big gradient panel, game title "Banana Puzzle Challenge" in Rajdhani, one-line description, tag chips (Puzzle, Maths, Single-player, Timed), large green **Start Game** button with play icon, and a "How it works" list on the right (1. Solve the missing digit 2. 30s per round 3. Faster answers score more).
- Stats row (4 tiles): Games played, Best score, Total correct, Accuracy %. Derived client-side from the existing history endpoint.
- Badges ("achievements") row: First Game, Perfect 5/5, Score 500+, 5 Games Played. Unlocked = coloured, locked = greyed with lock icon. Derived client-side from history.
- Recent games: library-style rows (banana thumbnail, score in yellow, 5 pips showing correct/wrong, date, "View breakdown" link). Empty state with call to action.

### In-game (playing)
- Top HUD: Score, Round x/5, Streak as three stat tiles; below, a timer bar with seconds on the right: green > 10s, amber 5-10s, red + gentle pulse < 5s.
- Puzzle in a framed panel with accent corner marks, centred, image keeps aspect ratio with a skeleton while loading.
- Keypad: digits 0-9 as large square keys in a 5x2 grid, selected key gets yellow ring and glow, pressing animates.
- Submit button (play variant) disabled until a digit is selected. Keyboard hint chips remain.
- Feedback overlay after each answer (about 1s): correct = green flash + "+points" float, wrong = red shake + "Answer was X", timeout = amber "Time's up". Smooth fade between rounds.
- Respect `prefers-reduced-motion`: disable shake/pulse/count-up.

### Results (`/results/:id`)
Hero panel: score counting up, letter grade badge (S >= 650, A >= 500, B >= 350, C >= 150, else D), "X / 5 correct", pips. Below: per-round cards in a grid (puzzle thumbnail, your answer vs correct answer, points, green/red left border). Actions: Play Again (play variant), View Leaderboard (secondary).

### Leaderboard
Header banner (trophy, title, Play Game button). Podium for top 3 (order 2nd, 1st, 3rd; gold/silver/bronze accents, avatar initial, score). Ranks 4-10 in a clean table. Current user's row highlighted with a "You" badge, and if the user is in the podium their card gets a ring. Skeleton while loading, empty state if no games. Keep footer note.

### Not found
Simple 404 page with banana, message, and a button back to `/game`.

## 6. Toast notifications (react-hot-toast)
Provider mounted once in `App`. Position top-right (top-center on mobile). Dark panel style matching `bg-panel`, border, coloured left accent and icon per type. Durations: success/info 3s, error 4.5s. One helper `src/utils/notify.js` exposing `notify.success/error/info(message, id?)`. Use fixed `id`s so the same toast never stacks twice.

| Moment | Type | Message |
|---|---|---|
| Registered | success | "Account created! Welcome, {username} 🍌" |
| Register error | error | server message, e.g. "Username or email already in use" |
| Login | success | "Welcome back, {username}!" |
| Login error | error | "Invalid email or password" (or server message) |
| Logout | info | "You've been logged out. See you soon!" |
| Session expired (401 while logged in) | error | "Your session expired. Please log in again." |
| Game started | info | "Game started. Good luck!" |
| Correct answer | success | "Correct! +{points} points" |
| Wrong answer | error | "Wrong! The answer was {digit}" |
| Timeout | warning/info | "Time's up!" |
| Game finished | success | "Game complete! You scored {score}" |
| Puzzle API down | error | "Puzzle service unavailable. Please try again." |
| Network error | error | "Can't reach the server. Check your connection." |
| Leaderboard/history/results load fail | error | "Couldn't load {leaderboard / your games / results}." |
Toasts for correct/wrong/timeout must be short and must not block input or the next round.

## 7. Accessibility and quality
Visible focus states, labels tied to inputs, `aria-live` for toasts and feedback, sufficient contrast (text on panels at least 4.5:1), buttons at least 40px tall, keyboard operable everywhere, `prefers-reduced-motion` respected.
