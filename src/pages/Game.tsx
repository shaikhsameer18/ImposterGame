import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft } from 'lucide-react';
import PlayerList from '../components/PlayerList';
import AdminPanel from '../components/AdminPanel';
import WaitingScreen from '../components/WaitingScreen';
import GameScreen from '../components/GameScreen';
import EmoteReactions from '../components/EmoteReactions';
import { motion } from 'framer-motion';

const Game = () => {
  const { gameState, gameInfo, resetGame } = useGame();
  const navigate = useNavigate();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    if (!gameInfo.playerName || !gameInfo.roomId) {
      navigate('/');
    }

    // Set up a listener for the back button/escape key
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (gameState.gameStarted || gameState.players.length > 1) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameInfo, navigate, gameState]);

  const handleExit = () => {
    if (gameState.gameStarted || gameState.players.length > 1) {
      setShowExitConfirm(true);
    } else {
      confirmExit();
    }
  };

  const confirmExit = () => {
    resetGame();
    navigate('/');
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden">
      <header className="flex items-center justify-center p-4 relative">
        <button 
          onClick={handleExit}
          className="absolute left-4 flex items-center px-2 py-1 text-surface-300 hover:text-white bg-surface-800/50 rounded-md hover:bg-surface-700/70 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Exit
        </button>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-primary-500/30 border border-primary-400/30 flex items-center justify-center">
            <div className="w-3 h-3 bg-primary-400 rounded-full animate-pulse" />
          </div>
          <span className="text-lg font-medium text-primary-200">Room: {gameInfo.roomId}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 p-4 overflow-y-auto">
          {!gameState.gameStarted ? (
            gameState.isAdmin ? (
              <AdminPanel />
            ) : (
              <WaitingScreen />
            )
          ) : (
            <GameScreen />
          )}
        </main>
        
        <aside className="w-80 p-4 bg-surface-900/30 backdrop-blur-sm flex flex-col space-y-4 overflow-y-auto">
          <PlayerList />
          
          {gameState.gameStarted && (
            <div className="mt-auto">
              <EmoteReactions />
            </div>
          )}
        </aside>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface-800 rounded-lg p-6 max-w-sm text-center"
          >
            <h3 className="text-xl font-bold mb-4">Are you sure you want to exit?</h3>
            <p className="text-surface-300 mb-6">
              {gameState.isAdmin 
                ? "As the admin, leaving will end the game for everyone."
                : "Leaving the game will remove you from the room."}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={cancelExit}
                className="px-4 py-2 bg-surface-700 hover:bg-surface-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmExit}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                Exit Game
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Game;
