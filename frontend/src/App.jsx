// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * ROOT APPLICATION COMPONENT & LAYOUT SHELL
 * ============================================================================
 * Sets up BrowserRouter and routes according to architecture.md:
 * - Public routes: /login, /signup
 * - Protected routes: /game, /results/:id, /leaderboard
 * - Default redirect: / -> /game
 *
 * Layout Shell:
 * - Top sticky Steam-inspired Navbar (56px) with dynamic tabs and player avatar.
 * - Central content container (max-w-6xl, horizontal padding, flexible vertical rhythm).
 * - Global footer displaying course attribution and Banana API credit.
 * - Game HUD Toaster provider with custom dark aesthetics and responsive positioning.
 * ============================================================================
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Game } from './pages/Game';
import { Results } from './pages/Results';
import { Leaderboard } from './pages/Leaderboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col font-sans text-text relative z-10">
          {/* Game Toast Notifications Provider */}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'toast-game',
              style: {
                background: '#121826',
                color: '#F3F5FA',
                border: '1px solid #27314A',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
                padding: '12px 16px',
                fontSize: '0.875rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                maxWidth: '420px',
              },
              success: {
                duration: 3000,
                className: 'toast-game toast-success',
                iconTheme: {
                  primary: '#34D399',
                  secondary: '#121826',
                },
              },
              error: {
                duration: 4500,
                className: 'toast-game toast-error',
                iconTheme: {
                  primary: '#FF5C7A',
                  secondary: '#ffffff',
                },
              },
            }}
            containerStyle={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
              pointerEvents: 'none',
            }}
          />

          {/* Sticky Game Navbar */}
          <Navbar />

          {/* Central Layout Shell Container */}
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col">
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
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />

              {/* Redirect root to /game */}
              <Route path="/" element={<Navigate to="/game" replace />} />
              <Route path="*" element={<Navigate to="/game" replace />} />
            </Routes>
          </main>

          {/* Global Game Footer */}
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
