# progress.md

The agent updates this file after every task: tick the box, add a one-line note, and set "Next task".

**Current branch:** feature/auth-jwt
**Next task:** F1-T3

## Feature 1: feature/auth-jwt
- [x] F1-T1 User model + register/login endpoints
- [x] F1-T2 JWT cookie, protect middleware, logout, me
- [ ] F1-T3 Frontend AuthContext + axios client
- [ ] F1-T4 Login/Signup pages + protected routes

## Feature 2: feature/banana-api
- [ ] F2-T1 bananaService (external API)
- [ ] F2-T2 Game model + start-game endpoint
- [ ] F2-T3 Answer validation, scoring, round progression
- [ ] F2-T4 Backend events (EventEmitter) + error handling

## Feature 3: feature/game-ui-events
- [ ] F3-T1 Game page + puzzle display + digit pad
- [ ] F3-T2 Submit via click and keyboard events
- [ ] F3-T3 Countdown timer + timeout event
- [ ] F3-T4 Frontend event bus + live score HUD

## Feature 4: feature/results-leaderboard
- [ ] F4-T1 Result and history endpoints
- [ ] F4-T2 Results page
- [ ] F4-T3 Leaderboard endpoint
- [ ] F4-T4 Leaderboard page + navbar

## Notes / decisions
- F1-T1: Created User Mongoose model and implemented POST /api/auth/register and POST /api/auth/login with 10-round bcrypt hashing and input validation.
- F1-T2: Integrated cookie-parser, JWT issuance in HTTP-only cookies on register/login, auth protect middleware, POST /api/auth/logout, and GET /api/auth/me.
