// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Authentication Middleware
 * Protects private endpoints by inspecting the HTTP-only 'token' cookie.
 * Verifies the signed JWT, queries the database for the active user, and attaches
 * the user object to the Express request (req.user) for downstream route handlers.
 */
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { SERVER_INSTANCE_ID, getJwtSecret } from '../config/session.js';

const cookieClearOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

export const protect = async (req, res, next) => {
  try {
    // 1. Read token from HTTP-only cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, no token provided',
      });
    }

    // 2. Verify JWT signature using instance-bound secret
    const decoded = jwt.verify(token, getJwtSecret());

    // 3. Verify that token was issued by the current running server instance
    if (!decoded.serverInstanceId || decoded.serverInstanceId !== SERVER_INSTANCE_ID) {
      res.clearCookie('token', cookieClearOptions);
      return res.status(401).json({
        message: 'Server was restarted. Please log in again.',
      });
    }

    // 4. Load user from database excluding passwordHash
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      res.clearCookie('token', cookieClearOptions);
      return res.status(401).json({
        message: 'Not authorized, user not found',
      });
    }

    // 5. Attach verified user to request object
    req.user = user;
    next();
  } catch (error) {
    // Clear dead/invalid token cookie
    res.clearCookie('token', cookieClearOptions);
    return res.status(401).json({
      message: 'Not authorized, invalid or expired token',
    });
  }
};
