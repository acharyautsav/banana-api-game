// AI-assisted: generated with Claude, reviewed and adapted by the author.

/**
 * Root Application Component
 * Wraps the application tree in AuthProvider to distribute authentication context.
 */
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-yellow-400">Banana Puzzle Game</h1>
          <p className="text-slate-400 mt-2 text-sm">Auth state ready</p>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
