// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * BANANA ARCADE NOTIFICATION SYSTEM: Toast Helper
 * ============================================================================
 * Custom wrapper around react-hot-toast styled for the Banana Arcade HUD:
 * - notify.success(msg, id?): 3000ms duration, jungle green left accent & CheckCircle2.
 * - notify.error(msg, id?): 4500ms duration, coral red left accent & XCircle.
 * - notify.info(msg, id?): 3000ms duration, cyan tactical info accent & Info.
 * - notify.warning(msg, id?): 3500ms duration, banana yellow accent & AlertTriangle.
 * - notify.dismiss(id?): Programmatically dismiss active toast(s).
 *
 * Deduplication:
 * Uses optional `id` parameter so rapid duplicate events never stack.
 * Clean: NO emoji icons; pure Lucide icons across all toast variants.
 * ============================================================================
 */
import React from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';

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
      icon: React.createElement(CheckCircle2, {
        className: 'w-5 h-5 text-jungle shrink-0',
        'aria-hidden': 'true',
      }),
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
      icon: React.createElement(XCircle, {
        className: 'w-5 h-5 text-coral shrink-0',
        'aria-hidden': 'true',
      }),
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
      className: 'toast-game toast-info',
      icon: React.createElement(Info, {
        className: 'w-5 h-5 text-cyan shrink-0',
        'aria-hidden': 'true',
      }),
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
      className: 'toast-game toast-warning',
      icon: React.createElement(AlertTriangle, {
        className: 'w-5 h-5 text-banana shrink-0',
        'aria-hidden': 'true',
      }),
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
