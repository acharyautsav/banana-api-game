# progress.md

The agent updates this file after every task: tick the box, add a one-line note, and set "Next task".

**Current branch:** feature/game-ui-events
**Next task:** F3-T4

## Feature 1: feature/auth-jwt
- [x] F1-T1 User model + register/login endpoints
- [x] F1-T2 JWT cookie, protect middleware, logout, me
- [x] F1-T3 Frontend AuthContext + axios client
- [x] F1-T4 Login/Signup pages + protected routes

## Feature 2: feature/banana-api
- [x] F2-T1 bananaService (external API)
- [x] F2-T2 Game model + start-game endpoint
- [x] F2-T3 Answer validation, scoring, round progression
- [x] F2-T4 Backend events (EventEmitter) + error handling

## Feature 3: feature/game-ui-events
- [x] F3-T1 Game page + puzzle display + digit pad
- [x] F3-T2 Submit via click and keyboard events
- [x] F3-T3 Countdown timer + timeout event
- [ ] F3-T4 Frontend event bus + live score HUD

## Feature 4: feature/results-leaderboard
- [ ] F4-T1 Result and history endpoints
- [ ] F4-T2 Results page
- [ ] F4-T3 Leaderboard endpoint
- [ ] F4-T4 Leaderboard page + navbar

## Notes / decisions
- F1-T1: Created User Mongoose model and implemented POST /api/auth/register and POST /api/auth/login with 10-round bcrypt hashing and input validation.
- F1-T2: Integrated cookie-parser, JWT issuance in HTTP-only cookies on register/login, auth protect middleware, POST /api/auth/logout, and GET /api/auth/me.
- F1-T3: Created axios client with withCredentials enabled, built AuthContext with session restoration and auth actions, and wrapped App in AuthProvider.
- F1-T4: Built Login, Signup, Navbar, ProtectedRoute, and placeholder Game components with react-router routing.
- F2-T1: Created bananaService integrating with external Banana API (HTTP GET, 5s timeout, validation) and tested via temporary protected /api/dev/puzzle route.
- F2-T2: Created Game model, implemented protected POST /api/game/start with server-only solution storage, and removed temporary /api/dev/puzzle route.
- F2-T3: Implemented protected POST /api/game/:id/answer with 30s server timing, speed bonus scoring (100-150 pts), 5-round progression, and finished game sealing.
- F2-T4: Implemented backend EventEmitter for game lifecycle events (game:started, round:answered, game:finished), console event listeners, and centralized errorHandler.
- F3-T1: Built DigitPad component and Game page supporting idle, loading, and playing states with real-time puzzle display and digit selection.
- F3-T2: Implemented click and keydown (0-9 to select, Enter to submit) answer handlers, double-submit protection, 1s visual feedback, and /results/:id placeholder routing.
- F3-T3: Created Timer component with 30s countdown, visual progress bar, color warning in last 10s, and automatic answer null submission on timeout.
