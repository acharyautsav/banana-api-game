// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Authentication Context and Provider
 * Manages player authentication state globally across the React application.
 * On application load, automatically requests GET /api/auth/me to verify and
 * restore player session from the browser's HTTP-only cookie.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on mount from cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await client.get('/auth/me');
        setUser(response.data.user);
      } catch {
        // No active session or cookie expired
        setUser(null);
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
    const response = await client.post('/auth/login', { email, password });
    setUser(response.data.user);
    return response.data.user;
  };

  /**
   * Register a new user account with username, email, and password
   */
  const register = async (username, email, password) => {
    const response = await client.post('/auth/register', {
      username,
      email,
      password,
    });
    setUser(response.data.user);
    return response.data.user;
  };

  /**
   * Log out the current user and clear the server session cookie
   */
  const logout = async () => {
    try {
      await client.post('/auth/logout');
    } finally {
      setUser(null);
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
