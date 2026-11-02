// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE UI: Navbar Component
 * ============================================================================
 * Sticky top-0 z-50 navigation header:
 * - bg-ink/70 backdrop-blur, border-b border-line.
 * - Left: Official Banana Arcade Logo.
 * - Center: Play & Leaderboard links with animated banana underline (framer-motion layoutId).
 * - Right: Logged-in user chip (Avatar + username) and Logout button; or Log In / Sign Up buttons.
 * - Mobile (<768px): Hamburger (Menu/X) slide-down panel, closes on route change and Escape.
 * ============================================================================
 */
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import { Button, Avatar } from './ui';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const isLinkActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-ink/70 backdrop-blur-md border-b border-line shadow-lg shadow-black/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left: Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-6 sm:gap-10">
            <Link
              to="/game"
              className="group focus-visible:outline-2 focus-visible:outline-banana rounded-lg py-1"
              aria-label="Banana Puzzle Home"
            >
              <Logo size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            {user && (
              <nav
                className="hidden md:flex items-center gap-1"
                aria-label="Main Navigation"
              >
                <NavLink
                  to="/game"
                  className={({ isActive }) =>
                    `relative px-4 py-2 font-ui uppercase tracking-wider text-xs sm:text-sm font-bold transition-colors select-none ${
                      isActive ? 'text-text' : 'text-muted hover:text-text'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>Play</span>
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active-indicator"
                          className="absolute bottom-0 left-2 right-2 h-[2px] bg-banana shadow-glow-banana"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/leaderboard"
                  className={({ isActive }) =>
                    `relative px-4 py-2 font-ui uppercase tracking-wider text-xs sm:text-sm font-bold transition-colors select-none ${
                      isActive ? 'text-text' : 'text-muted hover:text-text'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>Leaderboard</span>
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active-indicator"
                          className="absolute bottom-0 left-2 right-2 h-[2px] bg-banana shadow-glow-banana"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </nav>
            )}
          </div>

          {/* Right: Auth Profile / Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* User Chip */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-raised border border-line">
                  <Avatar username={user.username} size="sm" />
                  <span className="font-ui font-semibold text-sm text-text max-w-[140px] truncate">
                    {user.username}
                  </span>
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={<LogOut className="w-4 h-4 text-muted group-hover:text-text" />}
                  className="group text-xs"
                >
                  Logout
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
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="p-2 text-muted hover:text-text rounded-lg hover:bg-raised transition focus-visible:outline-2 focus-visible:outline-banana cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden border-t border-line bg-surface/95 backdrop-blur-lg px-4 py-4 space-y-4 overflow-hidden"
          >
            {user ? (
              <>
                {/* Mobile User Chip */}
                <div className="flex items-center justify-between pb-3 border-b border-line/60">
                  <div className="flex items-center gap-2.5">
                    <Avatar username={user.username} size="md" />
                    <div>
                      <p className="font-ui text-xs text-muted uppercase font-bold">Player</p>
                      <p className="font-ui font-bold text-base text-text">{user.username}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    leftIcon={<LogOut className="w-4 h-4" />}
                  >
                    Logout
                  </Button>
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation Drawer">
                  <Link
                    to="/game"
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-ui font-bold uppercase tracking-wider text-sm transition ${
                      isLinkActive('/game')
                        ? 'bg-raised text-banana border-l-4 border-banana'
                        : 'text-muted hover:text-text hover:bg-raised/50'
                    }`}
                  >
                    <span>Play</span>
                    {isLinkActive('/game') && <span className="w-2 h-2 rounded-full bg-banana shadow-glow-banana" />}
                  </Link>

                  <Link
                    to="/leaderboard"
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-ui font-bold uppercase tracking-wider text-sm transition ${
                      isLinkActive('/leaderboard')
                        ? 'bg-raised text-banana border-l-4 border-banana'
                        : 'text-muted hover:text-text hover:bg-raised/50'
                    }`}
                  >
                    <span>Leaderboard</span>
                    {isLinkActive('/leaderboard') && <span className="w-2 h-2 rounded-full bg-banana shadow-glow-banana" />}
                  </Link>
                </nav>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link to="/login" onClick={closeMobileMenu} className="w-full">
                  <Button variant="secondary" size="md" className="w-full justify-center">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" onClick={closeMobileMenu} className="w-full">
                  <Button variant="primary" size="md" className="w-full justify-center">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
