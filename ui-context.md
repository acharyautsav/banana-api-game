# ui-context.md

## Where the project is
Banana Puzzle Game (CIS046-3). ALL FUNCTIONALITY IS COMPLETE and merged (4 features, tagged v0.1.0 to v0.4.0, release v1.0.0 on `main`). Stack: React + Tailwind, Node/Express, MongoDB, JWT in HTTP-only cookie, external Banana API.

**This phase is UI/UX only.** Goals:
1. Redesign the UI with a Steam-inspired look (dark blue-grey game-store feel), keeping the banana-yellow brand accent. Original design only: no Steam logos, fonts or assets copied.
2. Add clear user feedback (toast notifications) for every action: register, login, logout, game events, errors.

## Current UI (before this phase)
Dark navy background, slate cards, banana-yellow buttons, emoji icons. Routes and pages:
- `/signup`: centred card (username, email, password, yellow Sign Up button).
- `/login`: centred card (email, password, Log In).
- `/game` (idle hub): card with banana emoji, title "Banana Puzzle Challenge", 3 mini info cards (5 Rounds, 30s Timer, 0-9 Digits), Start Game button, "My Recent Games" list (points, X/5 correct, date, "View Breakdown").
- `/game` (playing): HUD tiles (Score, Round, Streak), green timer bar, puzzle image in a panel, digit pad 0-9 (two rows of 5), keyboard hint, Submit Answer button.
- `/results/:id`: results page (read the code; no screenshot).
- `/leaderboard`: header card with trophy + Play Game button, table (rank medal, player, best score, games played), current user row highlighted with a "You" badge.
- Navbar: logo, Game and Leaderboard tabs, "Welcome, username" and Logout; logged out shows Log In and Sign Up.
There is currently NO feedback after register/login/logout or other actions.

## HARD CONSTRAINTS (do not break the working app)
- Do NOT change anything in the backend (`server/`).
- Do NOT change API endpoints, request/response shapes, or how the frontend calls them.
- Do NOT change game logic, scoring, auth logic or cookie handling.
- Do NOT rename or remove the frontend event bus events (`round:start`, `answer:submit`, `round:timeout`, `game:finish`) or the keyboard behaviour (0-9 select, Enter submits) or the 30s timer behaviour. Restyling these components is fine; keep their behaviour and event emission.
- Adding toast calls and small presentation-only state is fine.
- Keep Tailwind as the styling approach. Allowed new dependencies: `react-hot-toast`, `lucide-react`. Ask before adding anything else.
- Keep the code simple and readable. The student must explain it in a video.

## Rules for the agent (same as before, plus UI specifics)
1. The `ui-*` files override the older `context.md`/`progress.md`/`task-prompts.md` for this phase. The older `context.md` and `architecture.md` are still the reference for how the app works.
2. Do ONE task per "go", exactly as written in `ui-task-prompts.md`. Never build ahead.
3. Follow the design spec in `ui-design.md` (tokens, components, page specs). Reuse shared components instead of duplicating styles.
4. Add a short comment above each new component explaining its purpose. At the top of every file you create or substantially edit add: `// AI-assisted: generated with Claude, reviewed and adapted by the author.` (Antigravity/other AI tools count too, so use "AI-assisted" and name the tool if different.)
5. After each task: verify (run `npm run build` in the client, start the app if possible, check the page renders and nothing in the console errors), update `ui-progress.md`, commit with the exact commit message, push, report.
6. You handle git and GitHub yourself. Base branch is `develop`. NEVER delete any branch (local or remote), never force-push, never reset --hard or rewrite history. All branches stay for the final showcase.
7. Never commit secrets or `.env` files.
8. If anything is unclear or conflicts with the existing code, ask before changing it.
