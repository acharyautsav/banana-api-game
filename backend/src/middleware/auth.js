// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Authentication Middleware
 * Protects private endpoints by inspecting the HTTP-only 'token' cookie.
 * Verifies the signed JWT, queries the database for the active user, and attaches
 * the user object to the Express request (req.user) for downstream route handlers.
 */
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    // 1. Read token from HTTP-only cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, no token provided',
      });
    }

    // 2. Verify JWT signature using secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'banana_jwt_secret_dev_key_2026'
    );

    // 3. Load user from database excluding passwordHash
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        message: 'Not authorized, user not found',
      });
    }

    // 4. Attach verified user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication protect error:', error.message);
    return res.status(401).json({
      message: 'Not authorized, invalid or expired token',
    });
  }
};
