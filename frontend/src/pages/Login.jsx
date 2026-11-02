// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE: Login Page
 * ============================================================================
 * Controlled login form collecting email and password credentials.
 * - Restyled with the split-screen AuthLayout.
 * - Uses shared Card, Input (with Mail/Lock icons and password toggle), and Button.
 * - Displays inline coral error banner upon invalid credentials or connection issues.
 * - Preserves existing authentication logic, state handlers, and redirect to /game.
 * ============================================================================
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { Card, Input, Button } from '../components/ui';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Update form inputs in local state
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  // Submit credentials to Express backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      navigate('/game');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to log in. Please check your credentials.'
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
            Welcome Back
          </h2>
          <p className="text-sm text-muted mt-1.5 font-sans">
            Log in to continue your Banana Puzzle journey
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
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
            LOG IN
          </Button>
        </form>

        {/* Sign up redirect footer */}
        <p className="text-center text-xs sm:text-sm text-muted mt-8 font-sans">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-banana hover:underline font-ui font-bold uppercase tracking-wider ml-1"
          >
            Sign up
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
};

export default Login;
