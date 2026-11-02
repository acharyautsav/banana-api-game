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
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Game } from './pages/Game';
import { Results } from './pages/Results';
import { Leaderboard } from './pages/Leaderboard';

function App() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col font-sans text-[#c7d5e0]">
          {/* Game Toast Notifications Provider */}
          <Toaster
            position={isMobile ? 'top-center' : 'top-right'}
            toastOptions={{
              className: 'toast-game',
              style: {
                background: '#16202d',
                color: '#c7d5e0',
                border: '1px solid #2a3f55',
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
                  primary: '#a4d007',
                  secondary: '#16202d',
                },
              },
              error: {
                duration: 4500,
                className: 'toast-game toast-error',
                iconTheme: {
                  primary: '#d94b4b',
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
          <footer className="w-full py-4 border-t border-[#2a3f55]/60 bg-[#171a21]/60 backdrop-blur-sm text-center text-xs text-[#8f98a0]">
            <div className="max-w-6xl mx-auto px-4">
              Banana Puzzle · CIS046-3 · Powered by the Banana API
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
