// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE: Signup Page
 * ============================================================================
 * Controlled registration form collecting username, email, and password.
 * - Restyled with the split-screen AuthLayout.
 * - Uses shared Card, Input (with User/Mail/Lock icons and password toggle), and Button.
 * - Displays inline coral error banner for duplicate email/username or validation issues.
 * - Preserves existing registration logic, state handlers, and redirect to /game.
 * ============================================================================
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { Card, Input, Button } from '../components/ui';

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
    <AuthLayout>
      <Card accentTop className="p-6 sm:p-8">
        {/* Title and Subtitle */}
        <div className="text-left mb-8">
          <h2 className="font-ui text-3xl font-bold text-text uppercase tracking-wide">
            Create Your Account
          </h2>
          <p className="text-sm text-muted mt-1.5 font-sans">
            Join the Banana Puzzle challenge and climb the leaderboard
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <Input
            label="Username"
            type="text"
            name="username"
            required
            minLength={3}
            autoComplete="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="puzzle_master"
            leftIcon={<User className="w-4 h-4 text-muted" aria-hidden="true" />}
          />

          {/* Email Input */}
          <Input
            label="Email Address"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="player@example.com"
            leftIcon={<Mail className="w-4 h-4 text-muted" aria-hidden="true" />}
          />

          {/* Password Input */}
          <Input
            label="Password"
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            helperText="Minimum 6 characters"
            leftIcon={<Lock className="w-4 h-4 text-muted" aria-hidden="true" />}
          />

          {/* Inline Error Banner */}
          {error && (
            <div
              className="flex items-center gap-2.5 p-3.5 rounded-xl bg-coral/10 border border-coral/40 text-coral text-sm font-sans"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full mt-2"
          >
            CREATE ACCOUNT
          </Button>
        </form>

        {/* Login redirect footer */}
        <p className="text-center text-xs sm:text-sm text-muted mt-8 font-sans">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-banana hover:underline font-ui font-bold uppercase tracking-wider ml-1"
          >
            Log in
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
};

export default Signup;
