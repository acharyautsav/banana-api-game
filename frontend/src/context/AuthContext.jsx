// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Authentication Context and Provider
 * Manages player authentication state globally across the React application.
 * On application load, automatically requests GET /api/auth/me to verify and
 * restore player session from the browser's HTTP-only cookie.
 * Provides toast notification feedback for login, registration, and logout.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import client, { setAuthSessionActive, setOnSessionExpired } from '../api/client';
import notify from '../utils/notify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync session expired handler with axios interceptor
  useEffect(() => {
    setOnSessionExpired(() => {
      setUser(null);
    });
    return () => setOnSessionExpired(null);
  }, []);

  // Restore authenticated session on mount from cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await client.get('/auth/me');
        setUser(response.data.user);
        setAuthSessionActive(true);
      } catch {
        // No active session or cookie expired
        setUser(null);
        setAuthSessionActive(false);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Log in an existing user with email and password
   */
  const login = async (email, password) => {
    try {
      const response = await client.post('/auth/login', { email, password });
      setUser(response.data.user);
      setAuthSessionActive(true);
      notify.success(`Welcome back, ${response.data.user.username}!`, 'auth-login');
      return response.data.user;
    } catch (err) {
      if (err.response) {
        const msg =
          err.response?.data?.message ||
          'Invalid email or password';
        notify.error(msg, 'auth-error');
      }
      throw err;
    }
  };

  /**
   * Register a new user account with username, email, and password
   */
  const register = async (username, email, password) => {
    try {
      const response = await client.post('/auth/register', {
        username,
        email,
        password,
      });
      setUser(response.data.user);
      setAuthSessionActive(true);
      notify.success(`Account created! Welcome, ${response.data.user.username} 🍌`, 'auth-register');
      return response.data.user;
    } catch (err) {
      if (err.response) {
        const msg =
          err.response?.data?.message ||
          'Registration failed. Please try again.';
        notify.error(msg, 'auth-error');
      }
      throw err;
    }
  };

  /**
   * Log out the current user and clear the server session cookie
   */
  const logout = async () => {
    try {
      await client.post('/auth/logout');
    } finally {
      setUser(null);
      setAuthSessionActive(false);
      notify.info("You've been logged out. See you soon!", 'auth-logout');
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook for components to access authentication state and methods
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
