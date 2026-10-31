// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * ============================================================================
 * Backend Event Listeners
 * ============================================================================
 * Registers listeners for game lifecycle events emitted by the game controller.
 * These listeners format and log real-time game activity to the console.
 *
 * NOTE FOR PRESENTATION / EXTENSIBILITY:
 * This is the modular extension point where additional business logic should live:
 * - Post-game leaderboards invalidation / caching
 * - Badge / achievement evaluations upon "game:finished"
 * - Fraud / speedrun anomaly detection based on round answer times
 * - Webhook notifications to external services
 * ============================================================================
 */
import { gameEvents } from './gameEvents.js';

export const registerGameEventListeners = () => {
  // Listener: Game started
  gameEvents.on('game:started', (gameId, userId) => {
    const timestamp = new Date().toISOString();
    console.log(
      `[GAME EVENT] [${timestamp}] 🎮 Game Started | Game ID: ${gameId} | Player ID: ${userId}`
    );
  });

  // Listener: Round answered
  gameEvents.on('round:answered', (gameId, round, correct, points) => {
    const timestamp = new Date().toISOString();
    const resultIcon = correct ? '✅ Correct' : '❌ Wrong';
    console.log(
      `[GAME EVENT] [${timestamp}] 🎯 Round ${round} Answered | Game ID: ${gameId} | Result: ${resultIcon} | Points: +${points}`
    );
  });

  // Listener: Game finished
  gameEvents.on('game:finished', (gameId, userId, score) => {
    const timestamp = new Date().toISOString();
    console.log(
      `[GAME EVENT] [${timestamp}] 🏆 Game Finished | Game ID: ${gameId} | Player ID: ${userId} | Final Score: ${score} pts`
    );
    // (Extra finish-time logic, badge awards, or webhook notifications are executed here)
  });

  console.log('Registered backend game event listeners successfully.');
};

export default registerGameEventListeners;
