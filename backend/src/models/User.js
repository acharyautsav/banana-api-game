// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * User Mongoose Schema
 * Represents a registered player in the Banana Puzzle Game.
 * Stores username, unique lowercase email, bcrypt password hash, and creation timestamp.
 */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model('User', userSchema);
