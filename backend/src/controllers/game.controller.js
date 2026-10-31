// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Game Controller
 * Manages game session lifecycle:
 * - startGame: Initializes 5-round puzzle session, fetches initial puzzle, emits "game:started"
 * - answerRound: Validates user answers, computes speed-based scoring, enforces 30s server timeout,
 *   advances rounds, emits "round:answered", and emits "game:finished" upon round 5 completion.
 */
import mongoose from 'mongoose';
import { Game } from '../models/Game.js';
import { bananaService } from '../services/bananaService.js';
import { gameEvents } from '../events/gameEvents.js';

/**
 * Start a new game session
 * Creates a new Game record in MongoDB, fetches puzzle 1 from the external Banana API,
 * stores the secret solution strictly on the server, emits "game:started", and returns
 * the puzzle question to the player.
 */
export const startGame = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch initial round puzzle from third-party Banana API
    let puzzle;
    try {
      puzzle = await bananaService.getPuzzle();
    } catch (apiError) {
      console.error('Failed to fetch initial puzzle from Banana API:', apiError.message);
      return res.status(502).json({
        message: 'Puzzle service unavailable, please try again',
      });
    }

    // Initialize game document with round 0
    const initialRound = {
      questionUrl: puzzle.questionUrl,
      solution: puzzle.solution, // Saved on server; never sent in client response
      startedAt: new Date(),
      points: 0,
    };

    const game = await Game.create({
      user: userId,
      status: 'active',
      currentRound: 0,
      totalRounds: 5,
      score: 0,
      rounds: [initialRound],
      startedAt: new Date(),
    });

    // Emit backend event: game started
    gameEvents.emit('game:started', game._id, userId);

    // Return game details and question URL to client (NEVER the solution)
    return res.status(201).json({
      gameId: game._id,
      round: 1, // Displayed as 1-based to the player
      totalRounds: game.totalRounds,
      question: puzzle.questionUrl,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Answer current round puzzle
 * Validates player answer against server-held solution digit.
 * Enforces server-side timing: answers taking > 30 seconds count as wrong.
 * Emits "round:answered" and "game:finished" events.
 */
export const answerRound = async (req, res, next) => {
  try {
    const { id: gameId } = req.params;
    const { answer } = req.body;
    const userId = req.user._id;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: 'Invalid game ID format' });
    }

    // Find game and verify ownership & active status
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    if (game.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: this game does not belong to you' });
    }

    if (game.status !== 'active') {
      return res.status(400).json({ message: 'Game is already finished' });
    }

    const currentRoundIndex = game.currentRound;
    const round = game.rounds[currentRoundIndex];

    if (!round) {
      return res.status(400).json({ message: 'Current round not found' });
    }

    const now = new Date();
    // Calculate elapsed time from server-recorded round start timestamp
    const secondsTaken = Math.max(0, (now.getTime() - new Date(round.startedAt).getTime()) / 1000);

    // Enforce 30-second server timing constraint
    const hasTimedOut = secondsTaken > 30 || answer === null || answer === undefined;
    const isNumericAnswer =
      typeof answer === 'number' ||
      (typeof answer === 'string' && answer.trim() !== '' && !isNaN(Number(answer)));
    const parsedAnswer = isNumericAnswer ? Number(answer) : null;

    // Compare with server-side secret solution
    const isCorrect = !hasTimedOut && parsedAnswer !== null && parsedAnswer === round.solution;

    // Compute speed bonus: 50 at 0s down to 0 at 30s
    let points = 0;
    if (isCorrect) {
      const speedBonus = Math.round(Math.max(0, 50 * (1 - secondsTaken / 30)));
      points = 100 + speedBonus;
    }

    // Update current round record
    round.answeredAt = now;
    round.answer = parsedAnswer;
    round.correct = isCorrect;
    round.points = points;
    game.score += points;

    // Emit backend event: round answered
    gameEvents.emit('round:answered', game._id, currentRoundIndex + 1, isCorrect, points);

    const isLastRound = currentRoundIndex + 1 >= game.totalRounds;

    if (!isLastRound) {
      // Fetch next puzzle from external Banana API for the upcoming round
      let nextPuzzle;
      try {
        nextPuzzle = await bananaService.getPuzzle();
      } catch (apiError) {
        console.error('Failed to fetch next puzzle from Banana API:', apiError.message);
        return res.status(502).json({
          message: 'Puzzle service unavailable, please try again',
        });
      }

      // Append new round with server-side solution and start timestamp
      game.rounds.push({
        questionUrl: nextPuzzle.questionUrl,
        solution: nextPuzzle.solution,
        startedAt: now,
        points: 0,
      });

      game.currentRound += 1;
      await game.save();

      return res.status(200).json({
        correct: isCorrect,
        points,
        score: game.score,
        finished: false,
        round: game.currentRound + 1, // 1-based index for client
        question: nextPuzzle.questionUrl,
      });
    } else {
      // Final round completed: seal game status
      game.status = 'finished';
      game.finishedAt = now;
      await game.save();

      // Emit backend event: game finished
      gameEvents.emit('game:finished', game._id, userId, game.score);

      return res.status(200).json({
        correct: isCorrect,
        points,
        score: game.score,
        finished: true,
        gameId: game._id,
      });
    }
  } catch (error) {
    next(error);
  }
};
