// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * EVENT-DRIVEN PROGRAMMING THEME: Frontend Event Bus
 * ============================================================================
 * Why an Event Bus decouples components:
 * In traditional React component architectures, sharing state between distant or
 * sibling components requires either prop drilling through intermediary components
 * or binding all components to a centralized, monolithic context/state store.
 *
 * By introducing an event bus built on the browser's native `EventTarget`:
 * 1. Decoupling: Event publishers (like the Game screen) produce domain lifecycle
 *    events (round:start, answer:submit, round:timeout, game:finish) without
 *    needing any knowledge of who is listening, what props they require, or how
 *    they render.
 * 2. Independent Consumers: Components like `ScoreHud` subscribe independently
 *    inside their lifecycle (`useEffect`) with cleanup, managing their own isolated
 *    presentation state (score, streak, round progression) with zero props from Game.
 * 3. Scalability & Reusability: Multiple listeners can subscribe to the same event
 *    stream (e.g. analytics, audio managers, HUD, visual effects) without altering
 *    the Game component's code or props.
 * ============================================================================
 */

class GameEventBus {
  constructor() {
    this.bus = new EventTarget();
    this.handlers = new Map();
    this.latestEvents = new Map();
  }

  /**
   * Emit a custom domain event with an optional detail payload.
   * Caches the latest payload for each event type so late-mounting components
   * can synchronize their initial state.
   *
   * @param {string} eventName - Name of the event (e.g., 'round:start', 'answer:submit')
   * @param {Object} [detail={}] - Event payload object
   */
  emit(eventName, detail = {}) {
    this.latestEvents.set(eventName, detail);
    const customEvent = new CustomEvent(eventName, { detail });
    this.bus.dispatchEvent(customEvent);
  }

  /**
   * Subscribe to a custom event.
   *
   * @param {string} eventName - Name of the event to listen for
   * @param {Function} callback - Function receiving event detail payload
   * @returns {Function} Unsubscribe function for easy cleanup in useEffect
   */
  on(eventName, callback) {
    const handler = (e) => callback(e.detail);

    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Map());
    }
    this.handlers.get(eventName).set(callback, handler);
    this.bus.addEventListener(eventName, handler);

    return () => this.off(eventName, callback);
  }

  /**
   * Unsubscribe from an event listener.
   *
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Original callback reference passed to `on`
   */
  off(eventName, callback) {
    const eventMap = this.handlers.get(eventName);
    if (eventMap && eventMap.has(callback)) {
      const handler = eventMap.get(callback);
      this.bus.removeEventListener(eventName, handler);
      eventMap.delete(callback);
    }
  }

  /**
   * Retrieve the latest emitted payload for an event, if any.
   * Useful for initializing components mounted after the first event fired.
   *
   * @param {string} eventName - Name of the event
   * @returns {Object|null} Latest payload or null
   */
  getLatest(eventName) {
    return this.latestEvents.get(eventName) || null;
  }

  /**
   * Reset cached event state (e.g. on new game session).
   */
  resetCache() {
    this.latestEvents.clear();
  }
}

export const gameEvents = new GameEventBus();
export default gameEvents;
