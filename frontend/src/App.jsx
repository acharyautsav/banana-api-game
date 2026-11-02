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
 * ============================================================================
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
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
        <div className="min-h-screen flex flex-col font-sans text-[#c7d5e0]">
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
