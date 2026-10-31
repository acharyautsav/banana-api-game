# context.md

## Project
Banana Puzzle Game: a university assignment (CIS046-3 Software For Enterprise, University of Bedfordshire).
Users sign up / log in, start a game, solve 5 puzzles from the external Banana API, and see their results. A leaderboard shows the best scores.

The assignment is marked on a 10-minute video about four themes, each of which must be clearly visible in the code:
1. **Version control** – branch per feature, small commits, merges, tags.
2. **Interoperability** – our app talks to the third-party Banana API over HTTP/JSON.
3. **Event-driven programming** – GUI events in React, timer events, and a Node EventEmitter on the backend.
4. **Virtual identity** – register/login, bcrypt password hashing, JWT in an HTTP-only cookie.

## Tech stack (already set up, do not re-scaffold)
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT (in HTTP-only cookie) + bcrypt
- External API: Banana API (https://marcconrad.com/uob/banana/doc.php). `GET https://marcconrad.com/uob/banana/api.php?out=json` returns a puzzle: `question` (image URL) and `solution` (a single digit 0-9). Verify the exact response shape against the doc page before coding.

## Game rules
- One game = 5 rounds. One puzzle per round, fetched from the Banana API by the backend.
- 30 seconds per round. Timing is measured on the server, never trusted from the client.
- Score per correct answer: 100 points + speed bonus (up to 50, linearly lower the slower the answer). Wrong or timed out = 0.
- The puzzle solution is stored server-side only and is NEVER sent to the client.

## Rules for the agent
1. Read `architecture.md`, `plan.md`, `progress.md` before every session.
2. Work on ONE task at a time, exactly as written in the task prompt. Do not build ahead.
3. Follow the existing folder structure. Match the architecture in `architecture.md` (routes, models, naming).
4. Keep code simple and readable. The student must be able to explain every file in a video.
5. Put a short comment above every file or function you write explaining what it does and why (these are used in the video).
6. **AI attribution (required by the assignment):** at the top of every file you create or substantially edit, add: `// AI-assisted: generated with Claude, reviewed and adapted by the author.` Mark any code copied from external sources with a comment and a link.
7. Do NOT run git commands. The student commits manually after each task.
8. When a task is finished, update `progress.md` (tick the task, add a one-line note, set the next task), then summarise what you changed and which files were touched.
9. If something is unclear or the existing code conflicts with the plan, ask before changing it.
10. Never commit secrets. Use `.env` and keep `.env.example` updated.
