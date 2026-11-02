// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE: LeaderboardTable Component
 * ============================================================================
 * Renders rankings 4 through 10 in a semantic arcade table:
 * - Proper HTML table hierarchy (table, thead, th scope="col", tbody).
 * - Compact badges for numerical rank.
 * - Player info with Avatar, truncated username, and "YOU" badge for current user.
 * - Score highlighted in banana with muted "pts" suffix.
 * - Responsive: hides Games column on mobile (< sm) and places it under username.
 * - Empty/Minimal fallback: slim dashed-border Card when <= 3 players exist.
 * - Footer note with Info icon.
 * ============================================================================
 */
import React from 'react';
import { Users, Info } from 'lucide-react';
import { Card, Badge, Avatar } from './ui';

export const LeaderboardTable = ({
  entries = [],
  currentUsername = '',
  totalCount = 0,
}) => {
  const isCurrentPlayer = (username) =>
    Boolean(
      currentUsername &&
      username &&
      username.toLowerCase() === currentUsername.toLowerCase()
    );

  // If there are 3 or fewer players, do not render table; show slim dashed card
  if (totalCount <= 3) {
    const isUserInTop3 = entries.length === 0 && Boolean(currentUsername);

    return (
      <div className="space-y-4">
        <Card
          className="border-dashed border-line bg-surface/50 text-center"
          bodyClassName="p-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 text-muted text-sm font-sans"
        >
          <Users className="w-5 h-5 text-banana shrink-0" aria-hidden="true" />
          <span>
            {isUserInTop3
              ? `Only ${totalCount} player${totalCount === 1 ? '' : 's'} on the leaderboard. You're on the podium! Invite more players to compete.`
              : `Only ${totalCount} player${totalCount === 1 ? '' : 's'} so far. Play a game to join the ranking.`}
          </span>
        </Card>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted pt-1">
          <Info className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
          <span>Aggregated across all verified Banana API game completions.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="w-full overflow-hidden shadow-xl" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-raised/40 font-ui text-[11px] sm:text-xs uppercase tracking-wider text-muted font-bold">
                <th scope="col" className="py-3.5 px-4 sm:px-6 w-16 sm:w-20 text-center">
                  RANK
                </th>
                <th scope="col" className="py-3.5 px-4 sm:px-6">
                  PLAYER
                </th>
                <th scope="col" className="py-3.5 px-4 sm:px-6 text-right">
                  BEST SCORE
                </th>
                <th
                  scope="col"
                  className="hidden sm:table-cell py-3.5 px-4 sm:px-6 text-right"
                >
                  GAMES PLAYED
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {entries.map((entry) => {
                const isYou = isCurrentPlayer(entry.username);
                const rankNumber = entry.rank || 4;

                return (
                  <tr
                    key={rankNumber}
                    className={`transition-colors ${
                      isYou
                        ? 'bg-banana/10 border-l-4 border-l-banana font-semibold'
                        : 'hover:bg-raised/70'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      <span className="inline-block px-2 sm:px-2.5 py-0.5 rounded-lg bg-raised border border-line font-display text-xs sm:text-sm text-muted">
                        #{rankNumber}
                      </span>
                    </td>

                    {/* Player Info */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <Avatar username={entry.username} size="sm" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-ui font-bold text-sm sm:text-base truncate max-w-[120px] sm:max-w-[200px] md:max-w-xs ${
                                isYou ? 'text-banana' : 'text-text'
                              }`}
                              title={entry.username}
                            >
                              {entry.username}
                            </span>
                            {isYou && (
                              <Badge variant="banana" size="sm">
                                YOU
                              </Badge>
                            )}
                          </div>
                          {/* Mobile-only games played subtitle */}
                          <span className="sm:hidden block font-sans text-[11px] text-muted">
                            {entry.gamesPlayed} games played
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Best Score */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="inline-flex items-baseline justify-end gap-1">
                        <span className="font-ui font-bold text-base sm:text-lg text-banana">
                          {entry.bestScore}
                        </span>
                        <span className="font-ui text-xs text-muted font-normal uppercase">
                          pts
                        </span>
                      </div>
                    </td>

                    {/* Games Played (hidden on mobile) */}
                    <td className="hidden sm:table-cell py-3.5 px-4 sm:px-6 text-right font-sans text-sm text-muted">
                      {entry.gamesPlayed}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer Explanatory Note */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted pt-1">
        <Info className="w-4 h-4 text-muted shrink-0" aria-hidden="true" />
        <span>Aggregated across all verified Banana API game completions.</span>
      </div>
    </div>
  );
};

export default LeaderboardTable;
