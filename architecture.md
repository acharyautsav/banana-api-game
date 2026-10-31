# architecture.md

Paths below are a guide. If the existing project uses different folder names, follow the existing ones.

## High-level flow
```
React (Tailwind) --HTTP/JSON, cookie--> Express API --Mongoose--> MongoDB
                                            |
                                            +--HTTPS/JSON--> Banana API (external)
```
The browser never calls the Banana API directly. The backend fetches puzzles, keeps the solution, and checks answers.

## Backend (server/)
```
src/
  config/db.js              # mongoose connection
  models/User.js            # username, email, passwordHash, createdAt
  models/Game.js            # user, rounds[], currentRound, totalRounds, score, status, startedAt, finishedAt
  middleware/auth.js        # protect(): reads JWT from cookie, sets req.user
  middleware/errorHandler.js
  services/bananaService.js # fetches + normalises a puzzle from the Banana API
  events/gameEvents.js      # shared Node EventEmitter
  routes/auth.routes.js
  routes/game.routes.js
  routes/leaderboard.routes.js
  controllers/auth.controller.js
  controllers/game.controller.js
  controllers/leaderboard.controller.js
  app.js / server.js
```

### Data models
**User**: `username` (unique), `email` (unique), `passwordHash`, `createdAt`.

**Game**:
- `user` (ref User), `status` ("active" | "finished"), `totalRounds` (5), `currentRound` (0-based), `score`
- `rounds[]`: `{ questionUrl, solution, startedAt, answeredAt, answer, correct, points }`
- `startedAt`, `finishedAt`
- `solution` of the current/unanswered round must never be returned in any response.

### API endpoints
| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | no | create user, set JWT cookie |
| POST | /api/auth/login | no | verify password, set JWT cookie |
| POST | /api/auth/logout | no | clear cookie |
| GET | /api/auth/me | yes | current user |
| POST | /api/game/start | yes | create Game, fetch puzzle 1, return `{ gameId, round, totalRounds, question }` |
| POST | /api/game/:id/answer | yes | body `{ answer }`; validate, score, return `{ correct, points, score, finished, next? }` |
| GET | /api/game/history | yes | my finished games |
| GET | /api/game/:id/result | yes | full result with per-round breakdown |
| GET | /api/leaderboard | no/yes | top 10 users by best score |

### Auth
- Passwords hashed with bcrypt (10 salt rounds).
- JWT signed with `JWT_SECRET`, 1 day expiry, sent as cookie `token` with `httpOnly: true`, `sameSite: "lax"`, `secure` in production.
- `protect` middleware reads `req.cookies.token` (cookie-parser), verifies, loads user.
- CORS: `origin = CLIENT_URL`, `credentials: true`.

### Backend events (event-driven)
`events/gameEvents.js` exports one EventEmitter. The game controller emits `game:started`, `round:answered`, `game:finished`. Listeners (registered at startup) log activity and are the place where finish-time logic lives.

### Interoperability
`bananaService.getPuzzle()` calls the Banana API with axios (HTTP GET, JSON, 5s timeout), validates the response, and returns `{ questionUrl, solution }`. API failure returns a friendly 502 to the client.

## Frontend (client/)
```
src/
  api/client.js             # axios instance, baseURL, withCredentials: true
  context/AuthContext.jsx   # user state, login, register, logout, loadMe
  events/gameEvents.js      # EventTarget-based event bus (round:start, answer:submit, round:timeout, game:finish)
  components/ProtectedRoute.jsx, Navbar.jsx, DigitPad.jsx, Timer.jsx, ScoreHud.jsx
  pages/Login.jsx, Signup.jsx, Game.jsx, Results.jsx, Leaderboard.jsx
  App.jsx                   # react-router routes
```

### Frontend events
- Click events: start game, digit buttons, submit.
- Keyboard events: keys 0-9 select an answer, Enter submits.
- Form events: onChange / onSubmit for login and signup.
- Timer events: `setInterval` tick every second, a timeout event auto-submits when time runs out.
- Custom events: the event bus decouples the Game page from the HUD (score, progress).

## Routes (React)
`/login`, `/signup` public. `/game`, `/results/:id`, `/leaderboard` protected. `/` redirects to `/game`.
