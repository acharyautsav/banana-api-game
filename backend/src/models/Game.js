// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Game Mongoose Schema
 * Represents a 5-round puzzle session linked to a player.
 * Manages rounds progression, server-side puzzle solution storage (hidden from client),
 * timestamps for anti-cheat timing measurement, and accumulated score.
 */
import mongoose from 'mongoose';

const roundSchema = new mongoose.Schema(
  {
    questionUrl: {
      type: String,
      required: [true, 'Puzzle question image URL is required'],
    },
    solution: {
      type: Number,
      required: [true, 'Server-side solution digit is required'],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    answeredAt: {
      type: Date,
    },
    answer: {
      type: Number,
      default: null,
    },
    correct: {
      type: Boolean,
      default: null,
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const gameSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Game must belong to a registered user'],
    index: true,
  },
  status: {
    type: String,
    enum: ['active', 'finished'],
    default: 'active',
    index: true,
  },
  currentRound: {
    type: Number,
    default: 0, // 0-based index of the current active round
  },
  totalRounds: {
    type: Number,
    default: 5,
  },
  score: {
    type: Number,
    default: 0,
  },
  rounds: {
    type: [roundSchema],
    default: [],
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  finishedAt: {
    type: Date,
  },
});

export const Game = mongoose.model('Game', gameSchema);
