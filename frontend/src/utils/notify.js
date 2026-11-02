// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * GAME NOTIFICATION SYSTEM: Toast Helper
 * ============================================================================
 * Exposes a clean, typed wrapper around react-hot-toast tailored for the
 * game HUD aesthetic:
 * - notify.success(msg, id?): 3000ms duration, tactical green left accent.
 * - notify.error(msg, id?): 4500ms duration, alert red left accent.
 * - notify.info(msg, id?): 3000ms duration, cyan tactical info accent.
 * - notify.dismiss(id?): Programmatically dismiss active toast(s).
 *
 * Deduplication:
 * Providing an optional `id` ensures rapid repeated events (e.g. repeated clicks,
 * network retries, or double submits) update the existing toast in-place
 * rather than stacking duplicate notifications on the player's screen.
 * ============================================================================
 */
import toast from 'react-hot-toast';

const DEFAULT_OPTIONS = {
  style: {
    background: '#121826',
    color: '#F3F5FA',
    border: '1px solid #27314A',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.75)',
    padding: '12px 16px',
    fontSize: '0.875rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    maxWidth: '420px',
  },
};

export const notify = {
  /**
   * Display a success toast notification
   * @param {string} message - Notification text
   * @param {string} [id] - Optional fixed ID to prevent stacking duplicates
   */
  success: (message, id = null) => {
    return toast.success(message, {
      ...DEFAULT_OPTIONS,
      id: id || undefined,
      duration: 3000,
      className: 'toast-game toast-success',
      iconTheme: {
        primary: '#34D399',
        secondary: '#121826',
      },
    });
  },

  /**
   * Display an error toast notification
   * @param {string} message - Notification text
   * @param {string} [id] - Optional fixed ID to prevent stacking duplicates
   */
  error: (message, id = null) => {
    return toast.error(message, {
      ...DEFAULT_OPTIONS,
      id: id || undefined,
      duration: 4500,
      className: 'toast-game toast-error',
      iconTheme: {
        primary: '#FF5C7A',
        secondary: '#ffffff',
      },
    });
  },

  /**
   * Display an informational toast notification
   * @param {string} message - Notification text
   * @param {string} [id] - Optional fixed ID to prevent stacking duplicates
   */
  info: (message, id = null) => {
    return toast(message, {
      ...DEFAULT_OPTIONS,
      id: id || undefined,
      duration: 3000,
      icon: 'ℹ️',
      className: 'toast-game toast-info',
    });
  },

  /**
   * Display a warning toast notification
   * @param {string} message - Notification text
   * @param {string} [id] - Optional fixed ID to prevent stacking duplicates
   */
  warning: (message, id = null) => {
    return toast(message, {
      ...DEFAULT_OPTIONS,
      id: id || undefined,
      duration: 3500,
      icon: '⚠️',
      className: 'toast-game toast-warning',
    });
  },

  /**
   * Dismiss an active toast or all toasts
   * @param {string} [id] - Optional toast ID to dismiss
   */
  dismiss: (id = null) => {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  },
};

export default notify;
