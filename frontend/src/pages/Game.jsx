// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Game Page Component
 * Main interactive puzzle screen implementing game UI states:
 * - "idle": Welcomes player with start button and game rules overview
 * - "loading": Displays feedback while fetching puzzle from external Banana API
 * - "playing": Renders puzzle question image, "Round X of 5", and DigitPad component
 *
 * In F3-T1, players can click digits on the DigitPad to select and highlight their chosen answer.
 */
import { useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { DigitPad } from '../components/DigitPad';

export const Game = () => {
  const { user } = useAuth();

  // Primary UI state: 'idle' | 'loading' | 'playing'
  const [gameState, setGameState] = useState('idle');
  const [gameData, setGameData] = useState(null); // { gameId, round, totalRounds, question }
  const [selectedDigit, setSelectedDigit] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Start Game Handler
   * Requests a new game session via POST /api/game/start.
   * Loads the initial round puzzle and transitions the interface into 'playing' state.
   */
  const handleStartGame = async () => {
    try {
      setGameState('loading');
      setError(null);
      setSelectedDigit(null);

      const response = await client.post('/game/start');
      setGameData(response.data);
      setGameState('playing');
    } catch (err) {
      console.error('Failed to start game:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Puzzle service unavailable, please try again.'
      );
      setGameState('idle');
    }
  };

  /**
   * Handle digit selection from keypad click events
   */
  const handleSelectDigit = (digit) => {
    setSelectedDigit(digit);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Error Notification Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-sm text-red-200 flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs text-red-400 hover:text-red-200 ml-4 font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. IDLE STATE */}
        {gameState === 'idle' && (
          <div className="text-center py-6 space-y-6">
            <span className="text-6xl block" role="img" aria-label="banana">🍌</span>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Banana Puzzle Challenge
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
                Ready, <strong className="text-yellow-400">{user?.username}</strong>? Solve 5 math
                equation puzzles fetched live from the Banana API.
              </p>
            </div>

            {/* Rules Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-yellow-400 block mb-1">5 Rounds</span>
                <span className="text-slate-400">One unique puzzle image per round.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-yellow-400 block mb-1">30s Timer</span>
                <span className="text-slate-400">Measured on the server for fairness.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-yellow-400 block mb-1">0-9 Digits</span>
                <span className="text-slate-400">Answer with a single digit key.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartGame}
              className="px-8 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-base shadow-lg shadow-yellow-400/20 transition transform active:scale-95 cursor-pointer"
            >
              Start Game
            </button>
          </div>
        )}

        {/* 2. LOADING STATE */}
        {gameState === 'loading' && (
          <div className="py-16 text-center space-y-4">
            <div className="w-10 h-10 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-300">
              Fetching puzzle from Banana API...
            </p>
          </div>
        )}

        {/* 3. PLAYING STATE */}
        {gameState === 'playing' && gameData && (
          <div className="space-y-6">
            {/* Header: Round Indicator */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Current Round:
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 text-xs font-bold font-mono">
                  Round {gameData.round} of {gameData.totalRounds}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Single-digit solution (0–9)
              </div>
            </div>

            {/* Puzzle Question Image Container */}
            <div className="w-full bg-slate-950 rounded-xl p-3 border border-slate-800 flex items-center justify-center min-h-[220px]">
              <img
                src={gameData.question}
                alt={`Banana Puzzle Round ${gameData.round}`}
                className="max-h-72 w-auto object-contain rounded-lg shadow-md"
              />
            </div>

            {/* Selection Feedback Indicator */}
            <div className="text-center">
              <span className="text-xs text-slate-400">Selected Answer: </span>
              {selectedDigit !== null ? (
                <span className="inline-block px-3 py-1 ml-1 rounded-lg bg-yellow-400 text-slate-950 font-black font-mono text-sm">
                  {selectedDigit}
                </span>
              ) : (
                <span className="text-xs text-slate-500 italic">Click a digit below</span>
              )}
            </div>

            {/* Digit Selection Keypad */}
            <div className="pt-2">
              <DigitPad
                selectedDigit={selectedDigit}
                onSelectDigit={handleSelectDigit}
                disabled={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
