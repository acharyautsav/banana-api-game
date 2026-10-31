// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * EVENT-DRIVEN PROGRAMMING THEME: Backend Event Emitter
 * ============================================================================
 * This module exports a shared Node.js EventEmitter instance used across the backend.
 * Implementing an event-driven architecture decouples core gameplay controllers
 * from ancillary side-effects (e.g., activity logging, achievement processing,
 * analytics, and post-game auditing).
 *
 * Supported Events:
 * - "game:started"   (gameId, userId)
 * - "round:answered" (gameId, round, correct, points)
 * - "game:finished"  (gameId, userId, score)
 * ============================================================================
 */
import { EventEmitter } from 'events';

export const gameEvents = new EventEmitter();

export default gameEvents;
