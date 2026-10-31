// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Game Page (Placeholder for Feature 1)
 * Destination of protected route /game. Displays player session state.
 * Interactive puzzle board and digit pad will be integrated in Feature 2 & 3.
 */
import { useAuth } from '../context/AuthContext';

export const Game = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
        <span className="text-5xl block mb-3" role="img" aria-label="banana">🍌</span>
        <h1 className="text-2xl font-black text-white">Banana Puzzle Arena</h1>
        <p className="text-sm text-slate-400 mt-2">
          Signed in as <strong className="text-yellow-400">{user?.username}</strong> ({user?.email})
        </p>
        <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
          <p className="font-semibold text-slate-300">Feature 1: Virtual Identity Complete</p>
          <p className="mt-1">
            Puzzle fetching, 5-round progression, and external Banana API integration will start in Feature 2.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Game;
