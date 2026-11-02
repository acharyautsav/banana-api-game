// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Axios API Client Configuration
 * Pre-configures an Axios instance with base URL pointing to the Express API.
 * Configured with `withCredentials: true` to ensure HTTP-only session cookies
 * are automatically sent with every request across cross-origin domains.
 *
 * Includes response interceptors for:
 * - Network errors: Displays user-friendly "Can't reach the server. Check your connection."
 * - Session expiration: Detects 401 Unauthorized responses for active user sessions,
 *   displays a notification once, resets session status, and redirects to /login.
 */
import axios from 'axios';
import notify from '../utils/notify';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track whether a user is currently authenticated in the client app
let isUserLoggedIn = false;
let onSessionExpiredCallback = null;

/**
 * Update authenticated session status to control session-expiration interceptor
 * @param {boolean} active - True if user has an active authenticated session
 */
export const setAuthSessionActive = (active) => {
  isUserLoggedIn = Boolean(active);
};

/**
 * Register a listener to be notified when an active session expires
 * @param {Function|null} callback - Callback to invoke when session expires
 */
export const setOnSessionExpired = (callback) => {
  onSessionExpiredCallback = callback;
};

// Response Interceptor for global network errors and session expiration
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Network / connectivity error (no HTTP response received from server)
    if (!error.response) {
      if (isUserLoggedIn) {
        isUserLoggedIn = false;
        notify.error('Server disconnected. Please log in again.', 'server-disconnected');

        if (typeof onSessionExpiredCallback === 'function') {
          onSessionExpiredCallback();
        }

        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else {
        notify.error("Can't reach the server. Check your connection.", 'network-error');
      }
      return Promise.reject(error);
    }

    const { status, config } = error.response;
    const url = config?.url || '';

    // Check if the request is to login/register credential submission
    const isAuthLoginOrRegister = url.includes('/auth/login') || url.includes('/auth/register');

    // 2. 401 Session Expired or Server Restarted:
    // Only fire when an active user encounters a 401 on an API request.
    // Never fire on unauthenticated visitors (isUserLoggedIn is false) or login/register failures.
    if (status === 401 && !isAuthLoginOrRegister && isUserLoggedIn) {
      isUserLoggedIn = false;
      const message = error.response?.data?.message || 'Your session expired. Please log in again.';
      notify.error(message, 'session-expired');

      if (typeof onSessionExpiredCallback === 'function') {
        onSessionExpiredCallback();
      }

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default client;
