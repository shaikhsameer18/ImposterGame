import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import { 
  Target, AlertTriangle, CheckCircle2, Info, Shield, Hash, User, Users, RefreshCw, Home
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const GameScreen = () => {
  const { gameState, gameInfo, resetGame } = useGame();
  const { sendMessage } = useWebSocket();
  const [localShowCategories, setLocalShowCategories] = useState(true);
  const navigate = useNavigate();

  const handleNextGame = () => {
    if (gameState.isAdmin) {
      sendMessage({
        type: 'nextGame',
        roomId: gameInfo.roomId,
        imposterCount: gameState.imposterCount,
        randomImposter: gameState.randomImposter,
        showCategories: localShowCategories,
      });
    }
  };

  const handleResetGame = () => {
    if (gameState.isAdmin) {
      resetGame();
      toast.success('Game reset successfully');
      navigate('/');
    }
  };

  const handleUpdateImposterCount = (newCount: number) => {
    if (gameState.isAdmin) {
      sendMessage({
        type: 'updateImposterCount',
        roomId: gameInfo.roomId,
        imposterCount: newCount
      });
    }
  };

  const renderCategoryInfo = () => {
    if (!gameState.showCategories) return null;

    if (gameState.isImposter) {
      return (
        <div className="flex items-center justify-center mt-2">
          <Target className="w-5 h-5 text-red-400 mr-2" />
          <p className="text-surface-300">
            Category: <span className="opacity-0">hidden</span>
          </p>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center mt-2">
        <Target className="w-5 h-5 text-primary-400 mr-2" />
        <p className="text-surface-300">
          Category: <span className="font-medium text-primary-300">{gameState.category}</span>
        </p>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-surface-800/70 backdrop-blur-lg rounded-xl border border-primary-600/20 shadow-xl">
      <div className="space-y-6">
        {gameState.isImposter ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="inline-flex p-4 rounded-full bg-red-900/50 shadow-lg border border-red-900/50 animate-pulse-slow">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-red-400 text-center">You are an Imposter!</h2>
            
            <div className="p-4 rounded-lg bg-surface-900/70 border border-red-900/30 mt-4">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-300 font-medium">
                  Imposter Tips:
                </p>
              </div>
              <ul className="space-y-2 text-sm text-surface-300">
                <li className="flex items-start">
                  <Info className="w-3.5 h-3.5 text-red-400 mr-1.5 mt-0.5 flex-shrink-0" />
                  <span>Listen carefully to identify the word without revealing you don't know it</span>
                </li>
                <li className="flex items-start">
                  <Info className="w-3.5 h-3.5 text-red-400 mr-1.5 mt-0.5 flex-shrink-0" />
                  <span>Ask vague questions that could apply to many topics</span>
                </li>
                <li className="flex items-start">
                  <Info className="w-3.5 h-3.5 text-red-400 mr-1.5 mt-0.5 flex-shrink-0" />
                  <span>If there are multiple imposters, try to identify your allies</span>
                </li>
              </ul>
            </div>
            
            {renderCategoryInfo()}
            {gameState.otherImposters && gameState.otherImposters.length > 0 && (
              <div className="p-4 rounded-lg bg-surface-900/60 border border-red-900/30 mt-4">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-red-400 mr-2" />
                  <p className="text-surface-300">
                    Other Imposters:
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {gameState.otherImposters.map(name => (
                    <span key={name} className="px-3 py-1.5 bg-red-900/50 text-red-300 rounded-full text-sm flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col items-center">
              <div className="inline-flex p-4 rounded-full bg-primary-900/50 shadow-lg border border-primary-800/50 mb-4">
                <CheckCircle2 className="w-12 h-12 text-primary-400" />
              </div>
              
              {/* Word display */}
              <div className="mb-3">
                <h2 className="text-3xl font-bold text-primary-300 text-center mb-1">{gameState.word}</h2>
                {renderCategoryInfo()}
              </div>
              
              <p className="inline-block px-3 py-1 text-sm text-primary-200 bg-primary-900/50 rounded-full mb-5">
                You are a regular player
              </p>
              
              {/* Game hints */}
              <div className="w-full max-w-md p-4 rounded-lg bg-surface-900/60 border border-primary-800/20">
                <div className="flex items-center mb-2">
                  <Info className="w-4 h-4 text-primary-400 mr-2" />
                  <h3 className="text-sm font-medium text-primary-200">Playing as Regular Player</h3>
                </div>
                <p className="text-xs text-surface-300">
                  Ask questions that reveal your knowledge of the word, but be careful not to make it too obvious for the imposters to guess. Use reactions to show your suspicions about other players.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {gameState.isAdmin && (
        <div className="space-y-5 pt-5 border-t border-surface-700/50">
          <div>
            <label className="flex items-center text-sm font-medium text-surface-300 mb-2">
              <Hash className="w-4 h-4 mr-1.5 text-primary-400" />
              Update Imposter Count
            </label>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => handleUpdateImposterCount(Math.max(1, gameState.imposterCount - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-900/70 text-white border border-surface-700 hover:bg-surface-800"
                disabled={gameState.imposterCount <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={gameState.imposterCount}
                onChange={(e) => handleUpdateImposterCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 border rounded-lg bg-surface-900/50 border-surface-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-400 text-center"
              />
              <button 
                onClick={() => handleUpdateImposterCount(Math.min(10, gameState.imposterCount + 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-900/70 text-white border border-surface-700 hover:bg-surface-800"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-surface-900/50 border border-surface-700/50">
            <span className="text-sm font-medium text-surface-300">Show Categories</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localShowCategories}
                onChange={(e) => setLocalShowCategories(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleNextGame}
              className="flex-1 px-4 py-3 font-medium text-white transition-all bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-900/20"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Next Game
            </button>
            
            <button
              onClick={handleResetGame}
              className="flex-1 px-4 py-3 font-medium text-white transition-all bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20"
            >
              <Home className="w-4 h-4 mr-2" />
              Reset Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
