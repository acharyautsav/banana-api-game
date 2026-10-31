# task-prompts.md

How to use: for each task, paste the prompt to the agent. When it finishes and you've checked it works, run the commit command. Prompts assume the agent has already read context.md, architecture.md, plan.md, progress.md.

---

# Feature 1: Auth (virtual identity)

**Branch:** `feature/auth-jwt`

**Git commands (start):**
```
git checkout develop
git pull origin develop
git checkout -b feature/auth-jwt
```

### F1-T1: User model + register/login
**Prompt:**
```
Task F1-T1 (feature/auth-jwt). Build the User model and the register and login endpoints.
- models/User.js: username (unique, required), email (unique, required, lowercase), passwordHash, createdAt.
- controllers/auth.controller.js: register (validate input, check duplicates, hash with bcrypt 10 rounds, save) and login (find by email, bcrypt.compare). Return the user without passwordHash. Do NOT set the cookie yet; just return JSON.
- routes/auth.routes.js mounted at /api/auth with POST /register and POST /login.
- Clear error messages and proper status codes (400, 401, 409).
Follow architecture.md. Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(auth): add User model with register and login endpoints"
```

### F1-T2: JWT cookie + protect middleware
**Prompt:**
```
Task F1-T2. Add JWT authentication using an HTTP-only cookie.
- Install/use jsonwebtoken and cookie-parser. Add JWT_SECRET and CLIENT_URL to .env and .env.example.
- On register and login: sign a JWT (payload: user id, 1 day expiry) and set it as cookie "token" (httpOnly, sameSite lax, secure only in production).
- middleware/auth.js: protect() reads req.cookies.token, verifies it, loads the user, sets req.user, else 401.
- Add POST /api/auth/logout (clears the cookie) and GET /api/auth/me (protected, returns current user).
- Make sure CORS uses origin CLIENT_URL with credentials: true.
Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(auth): issue JWT in HTTP-only cookie and add protect middleware"
```

### F1-T3: Frontend AuthContext + API client
**Prompt:**
```
Task F1-T3. Frontend auth state.
- src/api/client.js: axios instance with baseURL from env and withCredentials: true.
- src/context/AuthContext.jsx: provides { user, loading, login, register, logout }. On app load it calls GET /api/auth/me to restore the session from the cookie.
- Wrap the app in AuthProvider.
Do not build the pages yet. Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(auth): add AuthContext and axios client with credentials"
```

### F1-T4: Login/Signup pages + protected routes
**Prompt:**
```
Task F1-T4. Auth UI with React + Tailwind.
- pages/Login.jsx and pages/Signup.jsx: controlled forms (onChange / onSubmit), show server errors, redirect to /game on success.
- components/ProtectedRoute.jsx: redirects to /login if there is no user (wait for loading).
- components/Navbar.jsx: shows username and a Logout button when logged in.
- Set up react-router routes as in architecture.md (/game can be a placeholder page for now).
Keep styling clean and simple. Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(auth-ui): add login/signup pages and protected routes"
```

**Git commands (finish):**
```
git push -u origin feature/auth-jwt
git checkout develop
git merge --no-ff feature/auth-jwt -m "merge: feature/auth-jwt into develop"
git push origin develop
git tag -a v0.1.0 -m "Auth with JWT cookie"
git push origin v0.1.0
```

---

# Feature 2: Banana API integration (interoperability)

**Branch:** `feature/banana-api`

**Git commands (start):**
```
git checkout develop
git pull origin develop
git checkout -b feature/banana-api
```

### F2-T1: bananaService
**Prompt:**
```
Task F2-T1 (feature/banana-api). Create services/bananaService.js.
- getPuzzle(): HTTP GET to https://marcconrad.com/uob/banana/api.php?out=json using axios, 5 second timeout.
- First check the doc page (https://marcconrad.com/uob/banana/doc.php) for the exact response shape. Validate that the response has a question image URL and a solution digit, then return { questionUrl, solution }.
- On any failure throw an error with a clear message so controllers can return a 502.
- Add a comment block at the top explaining this is the interoperability point (HTTP + JSON with a third-party service).
- Add a temporary GET /api/dev/puzzle route that is protected and returns only the questionUrl (never the solution), just to check it works. Mark it TODO to remove.
Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(api): add banana service to fetch puzzles from external API"
```

### F2-T2: Game model + start-game
**Prompt:**
```
Task F2-T2. Game model and start endpoint.
- models/Game.js as in architecture.md (rounds[] with questionUrl, solution, startedAt, answeredAt, answer, correct, points; status; currentRound; totalRounds default 5; score).
- POST /api/game/start (protected): create a Game, fetch ONE puzzle via bananaService, push it as round 0 with startedAt = now, save.
- Response: { gameId, round: 1, totalRounds, question: questionUrl }. NEVER include the solution.
- Remove the temporary /api/dev/puzzle route from F2-T1.
Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(game): add Game model and start-game endpoint"
```

### F2-T3: Answer validation + scoring
**Prompt:**
```
Task F2-T3. POST /api/game/:id/answer (protected).
- Body { answer } (digit 0-9, or null for timeout). Verify the game belongs to req.user and is active.
- Compare to the current round's solution on the server. Compute secondsTaken from the round's startedAt on the server (max 30s; if over 30s it counts as wrong).
- Points: correct = 100 + speed bonus (0-50, linearly decreasing from 50 at 0s to 0 at 30s, rounded). Wrong/timeout = 0.
- Save the answer, then: if more rounds remain, fetch the next puzzle (bananaService), push the new round with startedAt = now, and return { correct, points, score, finished: false, round, question }. If it was the last round, set status "finished", finishedAt, and return { correct, points, score, finished: true, gameId }.
- Never return a solution for an unanswered round. After answering you may return the correct solution for that round only.
Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(game): add answer validation, scoring and round progression"
```

### F2-T4: Backend events + error handling
**Prompt:**
```
Task F2-T4. Backend event-driven layer and error handling.
- events/gameEvents.js: export a single Node EventEmitter.
- In game.controller emit: "game:started" (gameId, userId), "round:answered" (gameId, round, correct, points), "game:finished" (gameId, userId, score).
- Create listeners (e.g. events/listeners.js, registered at server start) that log these events to the console in a readable format. Comment that this is where extra finish-time logic would be added.
- middleware/errorHandler.js: central error handler. Banana API failures return 502 with message "Puzzle service unavailable, please try again".
Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(events): emit game events with EventEmitter and add error handler"
```

**Git commands (finish):**
```
git push -u origin feature/banana-api
git checkout develop
git merge --no-ff feature/banana-api -m "merge: feature/banana-api into develop"
git push origin develop
git tag -a v0.2.0 -m "Banana API integration and game logic"
git push origin v0.2.0
```

---

# Feature 3: Game UI + events (event-driven programming)

**Branch:** `feature/game-ui-events`

**Git commands (start):**
```
git checkout develop
git pull origin develop
git checkout -b feature/game-ui-events
```

### F3-T1: Game page + digit pad
**Prompt:**
```
Task F3-T1 (feature/game-ui-events). Build pages/Game.jsx with React + Tailwind.
- States: "idle" (Start Game button), "playing", "loading".
- Start click calls POST /api/game/start and shows the puzzle image (question URL), "Round X of 5", and a DigitPad component (buttons 0-9) in components/DigitPad.jsx.
- Clicking a digit selects it (highlighted). No submit yet.
- Handle loading and error states (e.g. puzzle service unavailable).
Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(ui): add game page with puzzle display and digit pad"
```

### F3-T2: Submit via click and keyboard
**Prompt:**
```
Task F3-T2. Answer submission with events.
- Submit button (onClick) calls POST /api/game/:id/answer with the selected digit.
- Keyboard events: a keydown listener (added in useEffect, removed in cleanup) so keys 0-9 select a digit and Enter submits.
- After a response show brief feedback (correct/wrong + points) for about 1 second, then show the next puzzle from the response. When finished is true, navigate to /results/:gameId (the results page is built in feature 4, so a placeholder is fine).
- Disable inputs while a request is in flight to prevent double submits.
Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(events): handle answer submit via click and keyboard events"
```

### F3-T3: Countdown timer + timeout event
**Prompt:**
```
Task F3-T3. Per-round countdown.
- components/Timer.jsx: 30 second countdown driven by setInterval (tick every second), cleaned up on unmount and reset on each new round.
- When it reaches 0 it fires an onTimeout callback and the Game page auto-submits with answer null.
- Visual: bar or number that changes colour in the last 10 seconds.
Remember the server is the source of truth for timing; the timer is only a UI aid. Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(events): add per-round countdown and timeout event"
```

### F3-T4: Frontend event bus + HUD
**Prompt:**
```
Task F3-T4. Custom event bus and HUD.
- src/events/gameEvents.js: a small event bus built on EventTarget (or a tiny emit/on/off helper) with events: round:start, answer:submit, round:timeout, game:finish.
- Game page emits these events at the right moments.
- components/ScoreHud.jsx subscribes (in useEffect, with cleanup) and shows live score, round progress and a streak counter, without being passed props from Game.
- Add a short comment explaining why an event bus decouples the components.
Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(events): add frontend event bus and live score HUD"
```

**Git commands (finish):**
```
git push -u origin feature/game-ui-events
git checkout develop
git merge --no-ff feature/game-ui-events -m "merge: feature/game-ui-events into develop"
git push origin develop
git tag -a v0.3.0 -m "Game UI with event handling"
git push origin v0.3.0
```

---

# Feature 4: Results + leaderboard

**Branch:** `feature/results-leaderboard`

**Git commands (start):**
```
git checkout develop
git pull origin develop
git checkout -b feature/results-leaderboard
```

### F4-T1: Result and history endpoints
**Prompt:**
```
Task F4-T1 (feature/results-leaderboard). Backend endpoints.
- GET /api/game/:id/result (protected, owner only, game must be finished): return score, correct count, total rounds, and per-round breakdown { questionUrl, yourAnswer, correctAnswer, correct, points }. The solution may be returned here because the game is finished.
- GET /api/game/history (protected): the user's finished games, newest first, with id, score, correct count, finishedAt.
Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(results): add game result and history endpoints"
```

### F4-T2: Results page
**Prompt:**
```
Task F4-T2. pages/Results.jsx at /results/:id (protected).
- Fetch the result and show total score, correct/total, and a per-round list (puzzle image, your answer, correct answer, points) with green/red styling.
- Buttons: "Play again" (-> /game) and "View leaderboard" (-> /leaderboard).
- Replace the placeholder navigation from F3-T2 if needed.
Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(results-ui): add results page with round breakdown"
```

### F4-T3: Leaderboard endpoint
**Prompt:**
```
Task F4-T3. GET /api/leaderboard.
- MongoDB aggregation on finished games: group by user, take the best score, sort descending, limit 10, join username from User. Return [{ rank, username, bestScore, gamesPlayed }].
- Put the logic in controllers/leaderboard.controller.js and mount routes/leaderboard.routes.js.
- Do not expose emails or password hashes.
Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(leaderboard): add leaderboard aggregation endpoint"
```

### F4-T4: Leaderboard page + navbar
**Prompt:**
```
Task F4-T4. pages/Leaderboard.jsx.
- Table with rank, username, best score, games played. Highlight the logged-in user's row.
- Add Game, Leaderboard links to Navbar.
- Add a "My recent games" list on the Game idle screen using GET /api/game/history (last 5, each linking to its results page).
Update progress.md when done.
```
**Commit:**
```
git add .
git commit -m "feat(leaderboard-ui): add leaderboard page and navbar links"
```

**Git commands (finish + release):**
```
git push -u origin feature/results-leaderboard
git checkout develop
git merge --no-ff feature/results-leaderboard -m "merge: feature/results-leaderboard into develop"
git push origin develop
git tag -a v0.4.0 -m "Results and leaderboard"
git push origin v0.4.0

# Final release
git checkout main
git merge --no-ff develop -m "release: v1.0.0"
git tag -a v1.0.0 -m "Final submission"
git push origin main --tags
```
