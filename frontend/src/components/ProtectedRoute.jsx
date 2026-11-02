// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ProtectedRoute Component
 * Route guard that verifies the player is authenticated before allowing access.
 * Waits for session restoration (loading state) and redirects unauthenticated users to /login.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from './ui';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a neutral loading screen while checking cookie credentials
  if (loading) {
    return (
      <div className="min-h-screen bg-ink text-muted flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Spinner size="md" />
          <span className="font-ui text-sm font-semibold tracking-wide text-text uppercase">
            Authenticating session...
          </span>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render child components or nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
