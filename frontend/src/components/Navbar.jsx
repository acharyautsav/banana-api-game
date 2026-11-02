// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * GAME UI DESIGN SYSTEM: Navbar Component
 * ============================================================================
 * Steam/Game-inspired sticky header:
 * - 56px height, bg-nav (#171a21), border-b (#2a3f55).
 * - Left: Banana Puzzle logo mark (Banana in white, Puzzle in #fdc800).
 * - Center/Tabs: Uppercase navigation tabs (PLAY, LEADERBOARD) with animated
 *   2px cyan underline on the active route.
 * - Right: Player profile with Avatar, username, and Logout button (when authenticated);
 *   or Log In (ghost) and Sign Up (brand) actions (when guest).
 * - Responsive: On narrow screens (<640px), navigation tabs wrap below without
 *   clipping or breaking horizontal layout down to 360px.
 * ============================================================================
 */
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Avatar } from './ui';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) =>
    `relative py-3.5 sm:py-4 px-3 font-display uppercase tracking-wider text-xs sm:text-sm font-bold transition-colors select-none ${
      isActive
        ? 'text-white after:absolute after:bottom-0 after:left-1 after:right-1 after:h-[2px] after:bg-[#66c0f4] after:shadow-[0_0_8px_rgba(102,192,244,0.8)]'
        : 'text-[#8f98a0] hover:text-[#c7d5e0]'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#171a21] border-b border-[#2a3f55] shadow-lg shadow-black/40 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link
              to="/game"
              className="flex items-center gap-2 group transition focus:outline-none focus:ring-1 focus:ring-[#66c0f4] rounded-lg py-1 px-1.5"
            >
              <span className="text-2xl transition transform group-hover:scale-110" role="img" aria-label="banana">
                🍌
              </span>
              <span className="font-display font-black text-lg tracking-wide text-white uppercase">
                Banana <span className="text-[#fdc800]">Puzzle</span>
              </span>
            </Link>

            {/* Navigation Tabs (Desktop / Tablet) */}
            {user && (
              <nav className="hidden sm:flex items-center gap-1" aria-label="Main Navigation">
                <NavLink to="/game" className={navLinkStyle}>
                  Play
                </NavLink>
                <NavLink to="/leaderboard" className={navLinkStyle}>
                  Leaderboard
                </NavLink>
              </nav>
            )}
          </div>

          {/* Right: User Authentication & Profile Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Avatar username={user.username} size="sm" />
                  <span className="hidden md:inline-block font-display font-semibold text-sm text-[#ffffff] max-w-[120px] truncate">
                    {user.username}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  icon={<LogOut className="w-3.5 h-3.5 text-[#8f98a0]" />}
                  className="text-xs"
                >
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="brand" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs (wrapped under logo row for narrow screens) */}
        {user && (
          <nav
            className="sm:hidden flex items-center justify-around border-t border-[#2a3f55]/60 py-1"
            aria-label="Mobile Navigation"
          >
            <NavLink to="/game" className={navLinkStyle}>
              Play
            </NavLink>
            <NavLink to="/leaderboard" className={navLinkStyle}>
              Leaderboard
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
