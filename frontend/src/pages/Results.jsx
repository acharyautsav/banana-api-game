// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Results Page Component (Placeholder for Feature 3)
 * Destination upon game completion (/results/:id).
 * Full round breakdown, score summary, and leaderboard integration will be built in Feature 4.
 */
import { useParams, Link } from 'react-router-dom';

export const Results = () => {
  const { id } = useParams();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl space-y-4">
        <span className="text-5xl block" role="img" aria-label="trophy">🏆</span>
        <h1 className="text-2xl font-black text-white">Game Completed!</h1>
        <p className="text-xs text-slate-400 font-mono">
          Game ID: {id}
        </p>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
          <p className="font-semibold text-yellow-400">Feature 3 Navigation Verified</p>
          <p className="mt-1">
            Detailed per-round breakdown and leaderboard submissions will be added in Feature 4.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/game"
            className="inline-block px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-sm transition"
          >
            Play Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
