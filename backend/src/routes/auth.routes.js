// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Authentication Routes
 * Maps auth endpoints (/api/auth) to controller actions.
 * Endpoints:
 * - POST /register: Create new player account (sets JWT cookie)
 * - POST /login: Authenticate credentials (sets JWT cookie)
 * - POST /logout: Clear session cookie
 * - GET  /me: Retrieve current player profile (protected by auth middleware)
 */
import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes (requires valid JWT cookie)
router.get('/me', protect, getMe);

export default router;
