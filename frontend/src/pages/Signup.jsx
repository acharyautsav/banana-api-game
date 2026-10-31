// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Signup Page
 * Controlled registration form collecting username, email, and password.
 * Interacts with AuthContext to create a new user, automatically acquires the JWT cookie,
 * displays validation/duplicate errors, and redirects to /game on success.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Update inputs in local state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  // Submit new registration to Express backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/game');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-2" role="img" aria-label="banana">🍌</span>
          <h2 className="text-2xl font-bold text-white">Create an Account</h2>
          <p className="text-sm text-slate-400 mt-1">
            Join the Banana Puzzle challenge and climb the leaderboard
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/80 border border-red-800 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              minLength={3}
              value={formData.username}
              onChange={handleChange}
              placeholder="puzzle_master"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="player@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-slate-950 font-bold text-sm transition cursor-pointer"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-400 hover:underline font-semibold">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
