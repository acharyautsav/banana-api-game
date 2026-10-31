// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ProtectedRoute Component
 * Route guard that verifies the player is authenticated before allowing access.
 * Waits for session restoration (loading state) and redirects unauthenticated users to /login.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a neutral loading screen while checking cookie credentials
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Authenticating session...</span>
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
