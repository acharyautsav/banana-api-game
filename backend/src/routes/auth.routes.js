// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Authentication Routes
 * Maps auth endpoints (/api/auth) to auth controller handlers.
 */
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

// Public routes for user registration and authentication
router.post('/register', register);
router.post('/login', login);

export default router;
