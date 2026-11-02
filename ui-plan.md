# ui-plan.md

Detailed prompts and commit messages: `ui-task-prompts.md`. Status: `ui-progress.md`. Design spec: `ui-design.md`.

## Git strategy (continues the existing version control story)
- Base branch: `develop` (already holds all functionality; `main` is at v1.0.0).
- One `feature/ui-*` branch per feature, one commit per task (conventional commits: `style(...)`, `feat(...)`).
- Merge each feature into `develop` with `--no-ff`, then tag.
- Final release: merge `develop` into `main`, tag `v2.0.0`.
- NEVER delete branches. Never force-push.

## Features, in order
| # | Branch | Purpose | Tasks | Tag |
|---|---|---|---|---|
| U1 | `feature/ui-theme-foundation` | Tokens, fonts, shared components, navbar/layout | 3 | v1.1.0 |
| U2 | `feature/ui-notifications` | Toast system and feedback for every action | 3 | v1.2.0 |
| U3 | `feature/ui-auth-pages` | Login and signup redesign | 3 | v1.3.0 |
| U4 | `feature/ui-game-hub` | Hero, stats, badges, recent games | 3 | v1.4.0 |
| U5 | `feature/ui-gameplay` | In-game screen, keypad, feedback animations, results | 4 | v1.5.0 |
| U6 | `feature/ui-leaderboard-polish` | Podium leaderboard, responsive, 404, accessibility | 4 | v1.6.0 |

Order matters: foundation first (everything reuses it), notifications second (later pages hook into them), then pages.

## Done when
Every page uses the shared theme and components, every user action gives visible feedback, the app works at phone width, nothing functional has changed, and `main` is tagged `v2.0.0`.
