// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Root Application Component
 * Sets up BrowserRouter and routes according to architecture.md:
 * - Public routes: /login, /signup
 * - Protected routes: /game, /results/:id
 * - Default redirect: / -> /game
 * Wraps entire tree in AuthProvider and includes the Navbar.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Game } from './pages/Game';
import { Results } from './pages/Results';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/game"
                element={
                  <ProtectedRoute>
                    <Game />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results/:id"
                element={
                  <ProtectedRoute>
                    <Results />
                  </ProtectedRoute>
                }
              />

              {/* Redirect root to /game */}
              <Route path="/" element={<Navigate to="/game" replace />} />
              <Route path="*" element={<Navigate to="/game" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
