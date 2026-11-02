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
import { MotionConfig } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PageTransition } from './components/PageTransition';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Game } from './pages/Game';
import { Results } from './pages/Results';
import { Leaderboard } from './pages/Leaderboard';

function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <div className="min-h-screen flex flex-col font-sans text-text relative z-10">
            {/* Game Toast Notifications Provider */}
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'toast-game',
                style: {
                  background: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-line)',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
                  padding: '12px 16px',
                  fontSize: '0.875rem',
                  fontFamily: 'var(--font-sans)',
                  maxWidth: '420px',
                },
                success: {
                  duration: 3000,
                  className: 'toast-game toast-success',
                  iconTheme: {
                    primary: 'var(--color-jungle)',
                    secondary: 'var(--color-surface)',
                  },
                },
                error: {
                  duration: 4500,
                  className: 'toast-game toast-error',
                  iconTheme: {
                    primary: 'var(--color-coral)',
                    secondary: 'var(--color-text)',
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
                <Route
                  path="/login"
                  element={
                    <PageTransition>
                      <Login />
                    </PageTransition>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PageTransition>
                      <Signup />
                    </PageTransition>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/game"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <Game />
                      </PageTransition>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results/:id"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <Results />
                      </PageTransition>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leaderboard"
                  element={
                    <ProtectedRoute>
                      <PageTransition>
                        <Leaderboard />
                      </PageTransition>
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
      </MotionConfig>
    </BrowserRouter>
  );
}

export default App;
