// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Navbar Component
 * Displays the application header brand, navigation links, and dynamic user controls.
 * Shows the logged-in user's username and Logout button, or Login/Signup buttons for guests.
 */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Link */}
        <Link to="/game" className="flex items-center gap-2 hover:opacity-90 transition">
          <span className="text-2xl" role="img" aria-label="banana">🍌</span>
          <span className="font-extrabold text-lg tracking-tight text-white">
            Banana <span className="text-yellow-400">Puzzle</span>
          </span>
        </Link>

        {/* User Navigation / Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">
                Welcome, <strong className="text-yellow-400">{user.username}</strong>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-semibold transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
