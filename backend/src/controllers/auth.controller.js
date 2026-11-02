// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Authentication Controller
 * Handles user registration, login, logout, and session profile retrieval.
 * Issues signed JSON Web Tokens (JWT) stored in HTTP-only cookies for secure
 * virtual identity management.
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { SERVER_INSTANCE_ID, getJwtSecret } from '../config/session.js';

/**
 * Helper to generate an instance-bound JWT for authenticated sessions
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId, serverInstanceId: SERVER_INSTANCE_ID },
    getJwtSecret(),
    { expiresIn: '1d' }
  );
};

/**
 * Cookie options ensuring security against XSS attacks via httpOnly flag
 */
const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});

/**
 * Register a new user
 * Validates input, hashes password with bcrypt, saves user to MongoDB,
 * signs a JWT, and sets it in an HTTP-only cookie.
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Username, email, and password are required',
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        message: 'Username must be at least 3 characters long',
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedUsername = username.trim();

    // Check for duplicate credentials
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(409).json({
        message: 'An account with this email already exists',
      });
    }

    const existingUsername = await User.findOne({ username: trimmedUsername });
    if (existingUsername) {
      return res.status(409).json({
        message: 'Username is already taken',
      });
    }

    // Hash password with bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Persist new user in MongoDB
    const user = await User.create({
      username: trimmedUsername,
      email: normalizedEmail,
      passwordHash,
    });

    // Sign JWT and set in HTTP-only cookie
    const token = generateToken(user._id);
    res.cookie('token', token, getCookieOptions());

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      message: 'Internal server error during registration',
    });
  }
};

/**
 * Login user
 * Authenticates user credentials, generates JWT, and sets it in HTTP-only cookie.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Sign JWT and set in HTTP-only cookie
    const token = generateToken(user._id);
    res.cookie('token', token, getCookieOptions());

    return res.status(200).json({
      message: 'Logged in successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Internal server error during login',
    });
  }
};

/**
 * Logout user
 * Clears the HTTP-only 'token' cookie to invalidate the client session.
 */
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res.status(200).json({
    message: 'Logged out successfully',
  });
};

/**
 * Get current authenticated user profile
 * Handled after protect middleware attaches req.user.
 */
export const getMe = (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
};
