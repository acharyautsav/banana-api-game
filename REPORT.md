# CIS046-3 Software for Enterprise – AY 26/27

**Student Name:** Utsav Acharya &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Student Number:** 

**Student Signature:** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Date:** November 2026 (Week 8)

---

*Please answer the questions below, print this form and bring it to the presentation where it will be checked against reality and signed off by the tutor. Once signed off, scan this form and submit on BREO with all other deliverables (video, code). At this stage, Week 8, (at least) a working prototype should be presented plus some ideas on how to continue with the development.*

---

## Version Control
*How did you develop your code (e.g., what features have been added after first version)?*

- Git and GitHub were used as the core version control foundation throughout the entire project lifecycle, following a strict feature-branch workflow (`feature/*`, `develop`, `main`), atomic commits with semantic commit conventions, and release tags at key milestones.
- **Initial Setup (Baseline):** Initialised monorepo architecture configured with concurrently to run Express REST API (port 5000) and Vite React frontend (port 5173), environment configurations, and baseline Git repository structure.
- **Authentication & Virtual Identity (`v0.1.0` - `feature/auth-jwt`):** Implemented Mongoose `User` schema with unique username and email constraints, bcrypt password hashing with 10 salt rounds, JWT issuance over secure HTTP-only cookies, auth middleware (`protect`), frontend `AuthContext` with Axios interceptors, Login and Signup pages, and React `ProtectedRoute` wrappers.
- **External API & Core Game Engine (`v0.2.0` - `feature/banana-api`):** Built `bananaService` to communicate with Dr. Marc Conrad's Banana API, created `Game` Mongoose model for 5-round sessions with server-only solution storage, implemented protected `POST /api/game/start` and `POST /api/game/:id/answer` with server-measured timing (30s limit), speed bonus scoring (100–150 points), and integrated Node.js `EventEmitter` for game lifecycle events.
- **Event-Driven Game UI (`v0.3.0` - `feature/game-ui-events`):** Created the interactive Game screen supporting idle, loading, and playing states; implemented 0–9 on-screen `DigitPad` and global keyboard listener (0–9 keys select, Enter submits); built 30-second `Timer` component with automatic timeout penalty submission; and implemented an `EventTarget`-based frontend event bus (`gameEvents`) powering a decoupled `ScoreHud` with live score, round pips, and streak tracking.
- **Results Breakdown & Global Leaderboard (`v0.4.0` - `feature/results-leaderboard`):** Added game history and result endpoints (`GET /api/game/history`, `GET /api/game/:id/result`) revealing verified solutions post-game; built the `Results` page with round-by-round visual review; engineered a high-performance MongoDB aggregation pipeline (`GET /api/leaderboard`) ranking top 10 players; and built the `Leaderboard` page with active player row highlighting.
- **Full Prototype Release (`v1.0.0`):** Tagged stable release on `main` providing a complete end-to-end game loop: registration/login $\rightarrow$ lobby $\rightarrow$ 5-round puzzle arena $\rightarrow$ round breakdown $\rightarrow$ global leaderboard.
- **UI Theme Foundation & Reusable Design System (`v1.1.0` - `feature/ui-theme-foundation`):** Established a Steam/arcade-inspired cyberpunk aesthetic using Tailwind CSS v4 `@theme` design tokens (ink `#0B0F17`, surface `#121826`, raised `#1A2236`, banana `#FFC829`, jungle `#34D399`, coral `#FF5C7A`), typography with Google Fonts (*Bungee*, *Chakra Petch*, *Inter*), and built an atomic component library (`Button`, `Card`, `Badge`, `Avatar`, `Input`, `Spinner`, `Skeleton`).
- **HUD Toast Feedback System (`feature/ui-notifications`):** Integrated `react-hot-toast` with dark theme styling and deduplicated event notifications across authentication and network boundaries.
- **Polish, Accessibility & Session Security (`ui-polish`):** Redesigned all application pages (Lobby with How to Play guide, Game arena with puzzle bezel and micro-feedback cards, Results hero with S/A/B/C/D grade badges, Leaderboard with top-3 podium); removed all text emojis in favor of Lucide SVG icons; added Framer Motion page transitions with reduced-motion support; audited responsive layouts across 360px–1440px; and implemented runtime server instance session invalidation (`session.js`) with active disconnection detection.

---

## Event Driven Architectures
*What in your code triggers events (e.g., GUI, buttons, timeout …)?*

The application uses event-driven architecture across both the client-side presentation layer (React) and the Node.js application server.

### Client-Side Events (`frontend/src/`):
- **Page & Session Lifecycle Events:** The `useEffect` hook on mount in `AuthContext.jsx` triggers session verification via `GET /api/auth/me`. Window `focus` events trigger an immediate server connectivity check to verify active session status.
- **GUI & Click Events:** Mouse and touch clicks on the on-screen numeric keypad (`DigitPad.jsx`) trigger digit selection (0–9), the `Submit Answer` button triggers answer evaluation, the `Start Game` button in `Lobby.jsx` initializes a new session, navbar tab clicks trigger route transitions, and the mobile hamburger icon toggles navigation drawer state.
- **Form Events:** Form submissions (`onSubmit`) on `Login.jsx` and `Signup.jsx` intercept browser reload, validate inputs (email format, password length), and initiate asynchronous JSON HTTP requests via Axios.
- **Keyboard Events:** A global window `keydown` event listener in `src/pages/Game.jsx` captures physical keyboard input: keys `0` through `9` select the corresponding digit, `Enter` submits the active answer without mouse interaction, and `Escape` closes the mobile navigation menu and returns focus.
- **Timer & Countdown Events:** A `setInterval` timer in `src/components/Timer.jsx` ticks every second to drive a 30-second round countdown. When the timer reaches 0, it fires an `onTimeout` callback that automatically submits `{ answer: null }` to simulate an expired round penalty. An active 5-second interval heartbeat in `AuthContext.jsx` monitors backend server health.
- **Decoupled Frontend Event Bus (`src/events/gameEvents.js`):** Built using the browser's native `EventTarget` interface to publish and subscribe to domain lifecycle events (`round:start`, `answer:submit`, `round:timeout`, `game:finish`). Decoupled components such as `ScoreHud.jsx` listen to these events to update score, streak, and round counters with zero prop drilling.
- **Animation Events:** Framer Motion transition hooks trigger enter/exit animations, number count-up transitions in `ResultHero.jsx`, and stagger effects on round review cards.

### Server-Side Events (`backend/src/`):
- **Node.js Event Loop:** Incoming HTTP client requests, MongoDB database queries via Mongoose, and third-party API calls are handled asynchronously through the Node.js event loop and Promise-based `async/await`.
- **Express Middleware Pipeline:** Express routes and middleware handle CORS validation, JSON body parsing, cookie extraction, JWT authentication verification, and centralized error handling.
- **Node.js EventEmitter (`backend/src/events/gameEvents.js`):** A custom Node.js `EventEmitter` instance broadcasts internal domain lifecycle events: `game:started`, `round:answered`, and `game:finished`.
- **Decoupled Event Listeners (`backend/src/events/listeners.js`):** Dedicated event listeners subscribe to game events at server startup, handling audit logging, console diagnostics, and analytics without cluttering the game controller logic.

---

## Interoperability
*Do you use the API https://marcconrad.com/uob/tomato/api.php?*  
*If no, where in your code do you demonstrate interoperability? What protocols do you use?*

No, the application does not use the Tomato API endpoint. Instead, it demonstrates interoperability by connecting to Dr. Marc Conrad's official Banana API.

- **External API:** `https://marcconrad.com/uob/banana/api.php?out=json`
- **Where Implemented:** The external API integration is encapsulated in `backend/src/services/bananaService.js` through the `getPuzzle()` function.
- **How Integrated:** The game controller (`backend/src/controllers/game.controller.js`) invokes `bananaService.getPuzzle()` when initializing a 5-round session via `POST /api/game/start` and when advancing rounds in `POST /api/game/:id/answer`.
- **Protocol:** The application communicates with the external service using the HTTPS protocol with REST-like GET requests over TLS.
- **Data Transfer:** The external API returns a JSON payload containing:
  - `question`: URL string pointing to the dynamically generated math puzzle image.
  - `solution`: Integer digit (0–9) representing the correct solution to the puzzle.
- **Security (Server-Side Gateway Pattern):** The Node.js server acts as an API gateway. The puzzle solution returned by the external API is stored exclusively on the server in MongoDB (`rounds[].solution`). Only the puzzle image URL (`question`) is forwarded to the React frontend. The solution is never transmitted to the client during active gameplay, preventing client-side inspection or cheating.
- **Error Handling & Fault Tolerance:** An Axios timeout of 5,000 milliseconds is enforced on all outgoing requests to the Banana API. If the external API is unreachable or returns malformed data, the service intercepts the error and returns a clean HTTP 502 Bad Gateway response to the client with an actionable error message, ensuring system stability.

---

## Virtual Identity
*How did you implement virtual identity in your code? (e.g., Passwords, Cookies, IP Numbers …)*

Virtual identity is implemented using registered player accounts, cryptographic password hashing, stateless JSON Web Tokens (JWT) stored in HTTP-only cookies, and server-instance binding. This enables the system to reliably authenticate players, track persistent match histories, secure private endpoints, and prevent session tampering.

- **User Accounts:** Players register with a unique `username`, unique `email`, and `password`. The identity is persisted in MongoDB via the Mongoose `User` schema (`backend/src/models/User.js`), recording user credentials and account creation timestamps.
- **Password Security:** Passwords are validated (minimum 6 characters) and hashed using `bcryptjs` with 10 salt rounds before being written to the database (`passwordHash`). Plaintext passwords are never stored in the database or logged. During login, `bcrypt.compare()` verifies credentials against the stored hash.
- **Stateless JWT and Secure HTTP-Only Cookies:** Upon successful authentication (`/api/auth/register` or `/api/auth/login`), the server signs a JSON Web Token containing the user's MongoDB `_id` and sets it in an HTTP-only cookie named `token`. The cookie is configured with:
  - `httpOnly: true`: Blocks client-side JavaScript access, mitigating Cross-Site Scripting (XSS) token theft.
  - `sameSite: 'lax'`: Protects against Cross-Site Request Forgery (CSRF).
  - `secure: process.env.NODE_ENV === 'production'`: Ensures transmission exclusively over HTTPS in production.
- **Server-Restart Runtime Session Invalidation (`backend/src/config/session.js`):** To prevent session persistence after server restarts, the backend generates a dynamic `SERVER_INSTANCE_ID = crypto.randomUUID()` on every server boot. The JWT signing secret is bound to this instance ID, and `serverInstanceId` is embedded in the token payload. If the server is quit and rerun, tokens from prior server runs are invalidated, rejected with HTTP 401, and cookies are cleared.
- **Route Protection & Guards:**
  - *Backend:* `backend/src/middleware/auth.js` (`protect`) reads incoming cookies via `cookie-parser`, validates JWT signature against the current server instance, queries MongoDB for the user (omitting `passwordHash`), and attaches `req.user`. Missing, expired, or invalid tokens return HTTP 401 Unauthorized.
  - *Frontend:* `frontend/src/components/ProtectedRoute.jsx` checks the authentication state from `AuthContext`. If unauthenticated, it immediately redirects the user to `/login`.
- **Active Disconnection & Offline Detection:** `frontend/src/api/client.js` and `AuthContext.jsx` monitor network connectivity. If the server is stopped or disconnected (`!error.response`), any active user session is immediately terminated (`user = null`) and the user is redirected to `/login`.
- **Puzzle Integrity & Cheat Prevention:** Round answers are submitted to `POST /api/game/:id/answer` where the server verifies the answer against `rounds[currentRound].solution`. Round timing (30s) is calculated using server timestamps (`startedAt`), preventing client-side timer manipulation.

---

## Any other interesting features:
The application includes several additional features that enhance its architecture, gameplay, security, usability, and reliability:

### A. Game Mechanics and Dynamic Scoring
- **5-Round Game Sessions:** Each match consists of 5 consecutive puzzle rounds fetched on demand from the Banana API.
- **Server-Measured 30-Second Countdown:** Each round enforces a strict 30-second timer measured on the server. The client UI features a real-time progress bar that turns coral-red with a warning pulse during the final 10 seconds.
- **Speed Bonus Scoring Formula:** Correct answers award 100 base points plus a speed bonus of up to 50 points linearly scaled by remaining time ($50 \times (1 - \text{elapsedTime} / 30)$). Incorrect answers and timeouts award 0 points.
- **Animated Micro-Feedback Loop:** When an answer is evaluated, the interface displays an animated Framer Motion feedback card (Jungle Green `CORRECT` banner with awarded points, or Coral Red `INCORRECT` / `TIME'S UP` alert) before transitioning to the next round.
- **Performance Grading System:** The Results screen evaluates the total score (max 750 points) and assigns an arcade performance grade: **S Tier** ($\ge 700$ pts), **A Tier** ($\ge 600$ pts), **B Tier** ($\ge 500$ pts), **C Tier** ($\ge 400$ pts), and **D Tier** ($< 400$ pts).

### B. Warm Cream & Casual Arcade UI Architecture
- **Curated Off-White & Warm Cream Palette:** Built with Tailwind CSS v4 `@theme` tokens featuring a layered warm cream aesthetic (Canvas `#F9F6F0`, Surface `#FFFFFF`, Raised Butter-Cream `#F0EAE1`, Line `#E4DBD0`) accented by rich game colors (Honey Banana `#E58A00`, Forest Jungle `#047857`, Ruby Coral `#BE123C`, Marine Cyan `#0369A1`, and Deep Espresso Text `#1F1A16`).
- **Game Typography Pairing:** Integrates Google Fonts with `display=swap`: *Bungee* for arcade display titles, *Chakra Petch* for HUD numbers, timers, and scores, and *Inter* for readable UI copy.
- **Atomic Shared Component Library:** Restyled, reusable components with consistent focus rings and styling (`Button`, `Card`, `Badge`, `Avatar`, `Input`, `Spinner`, `Skeleton`).
- **Zero-Emoji Professional Iconography:** All visual symbols are rendered with scalable, accessible Lucide SVG icons (`aria-hidden="true"`), eliminating inconsistency across operating systems.
- **Smooth Page Transitions & Accessibility:** Global `<MotionConfig reducedMotion="user">` respects player OS accessibility settings (`prefers-reduced-motion`). All route changes feature a 200ms fade-and-slide `<PageTransition>`. All text meets WCAG AA 4.5:1 contrast standards.
- **Multi-Device Responsive Design:** Tested and optimized across 360px (mobile), 768px (tablet), 1024px (laptop), and 1440px (desktop) with zero horizontal overflow.

### C. Real-Time Feedback, Decoupled Architecture, and Leaderboard
- **Decoupled Frontend Event Bus:** `src/events/gameEvents.js` allows the `ScoreHud` component to track live score, round pips, and streak counters without prop drilling or unnecessary parent re-renders.
- **Backend Event Logging:** Node.js `EventEmitter` cleanly separates audit logging from request/response handlers.
- **Comprehensive Match Breakdown:** The `Results` page renders individual `RoundCard` components displaying the puzzle image, player's submitted answer, revealed correct solution, time taken, and points earned.
- **Global Leaderboard & Podium:** MongoDB aggregation pipeline calculates the highest score achieved per user and outputs the top 10 rankings. The page highlights the active player and features an Olympic-style top-3 podium (Gold/Silver/Bronze) with podium tiers.
- **Active Server Disconnection Protection:** If the backend server goes offline while a player is active, the app detects disconnection within 5 seconds, clears session credentials, and redirects to the login screen.
