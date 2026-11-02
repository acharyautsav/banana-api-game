// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Server Instance and Session Configuration
 * Generates a runtime instance identifier that is reset on every server boot.
 * This guarantees that whenever the server process is quit and restarted,
 * all authentication tokens issued by prior server runs are invalidated.
 */
import crypto from 'crypto';

export const SERVER_INSTANCE_ID = crypto.randomUUID();

export const getJwtSecret = () => {
  const baseSecret = process.env.JWT_SECRET || 'banana_jwt_secret_dev_key_2026';
  return `${baseSecret}_${SERVER_INSTANCE_ID}`;
};
