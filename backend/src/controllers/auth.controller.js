// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Authentication Controller
 * Handles user registration and login requests.
 * Uses bcrypt for 10-round password hashing and returns user objects without exposing password hashes.
 */
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

/**
 * Register a new user
 * Validates input, verifies unique email and username, hashes password, and saves the user.
 * HTTP 400 for invalid inputs, 409 for duplicate conflicts, 201 on success.
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

    // Check for existing duplicates
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

    // Create and save new user
    const user = await User.create({
      username: trimmedUsername,
      email: normalizedEmail,
      passwordHash,
    });

    // Return created user without passwordHash
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
 * Verifies credentials by matching lowercase email and comparing bcrypt password hashes.
 * HTTP 400 for missing inputs, 401 for invalid credentials, 200 on success.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Locate user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Verify password against stored bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // Return user without passwordHash (cookie is added in F1-T2)
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
