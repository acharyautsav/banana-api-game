# plan.md

Full task prompts and commit messages are in `task-prompts.md`. Status is tracked in `progress.md`.

## Git strategy (the "version control" theme)
- `main`: stable, only receives merges from `develop` at the end (tagged).
- `develop`: integration branch. Features merge here with `--no-ff` so the branch history stays visible.
- `feature/<name>`: one branch per feature, 3-4 commits each, one commit per task.
- Commit messages follow Conventional Commits: `feat(scope): ...`, `fix(scope): ...`.
- Tag after each merged feature: `v0.1.0`, `v0.2.0`, ... and `v1.0.0` on main.

## Features (build in this order)
| # | Branch | Theme covered | Tasks |
|---|---|---|---|
| 1 | `feature/auth-jwt` | Virtual identity | 4 |
| 2 | `feature/banana-api` | Interoperability (+ backend events) | 4 |
| 3 | `feature/game-ui-events` | Event-driven programming | 4 |
| 4 | `feature/results-leaderboard` | Results + leaderboard | 4 |

Order matters: auth first (everything else is protected), then the backend game logic with the external API, then the game UI, then results and the leaderboard.

## Deadlines
- Tutor progress check: **Week 8 or earlier** (missing it caps the grade). Features 1-3 should be done before it.
- Final submission: **04/12/2026, before 10:00**: video (max 10 min, own voice, no AI) + source code submitted separately.

## Done when
A user can sign up, log in, play 5 rounds with puzzles from the Banana API, see their result, and see the leaderboard.
