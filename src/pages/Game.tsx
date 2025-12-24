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
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Header - Compact */}
      <header className="relative z-10 glass-card border-b border-surface-700/30 px-3 md:px-5 py-2 md:py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExit}
            className="flex items-center px-2 md:px-3 py-1.5 md:py-2 text-surface-200 hover:text-white glass-card-hover rounded-lg transition-all duration-300 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1 md:mr-1.5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium text-xs md:text-sm">Exit</span>
          </motion.button>

          <div className="flex items-center space-x-2 md:space-x-2.5">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-primary-500/30 to-accent-500/30 border border-primary-400/40 flex items-center justify-center backdrop-blur-sm">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full animate-pulse shadow-glow" />
              </div>
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 rounded-lg bg-primary-400/20 blur-md"
              />
            </motion.div>
            <div>
              <p className="text-[9px] md:text-[10px] text-surface-400 font-medium leading-none">Room ID</p>
              <p className="text-sm md:text-base font-bold bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent font-mono tracking-wider leading-tight">
                {gameInfo.roomId}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Main Content */}
        <main className="flex-1 p-3 md:p-5 overflow-y-auto">
          <div className="max-w-5xl mx-auto h-full">
            {!gameState.gameStarted ? (
              gameState.isAdmin ? (
                <AdminPanel />
              ) : (
                <WaitingScreen />
              )
            ) : (
              <GameScreen />
            )}
          </div>
        </main>

        {/* Sidebar - Compact - Hidden on mobile */}
        <aside className="hidden md:flex w-80 glass-card border-l border-surface-700/30 flex-col overflow-y-auto p-4">
          <PlayerList />

          {gameState.gameStarted && (
            <div className="mt-auto pt-3 border-t border-surface-700/30">
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="glass-card rounded-2xl p-5 md:p-7 max-w-md w-full text-center border-2 border-surface-700/50 shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-flex p-3.5 rounded-2xl bg-red-500/20 mb-4"
            >
              <ArrowLeft className="w-7 h-7 md:w-8 md:h-8 text-red-400" />
            </motion.div>

            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-2.5 bg-gradient-to-r from-white to-surface-200 bg-clip-text text-transparent">
              Are you sure you want to exit?
            </h3>
            <p className="text-surface-300 mb-5 md:mb-6 text-xs md:text-sm leading-relaxed">
              {gameState.isAdmin
                ? "As the admin, leaving will end the game for everyone in the room."
                : "Leaving the game will remove you from the room and you'll lose your progress."}
            </p>

            <div className="flex gap-2 md:gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={cancelExit}
                className="flex-1 px-4 md:px-5 py-2.5 md:py-3 glass-card-hover rounded-xl font-semibold text-surface-200 transition-all duration-300 text-xs md:text-sm"
              >
                Stay in Game
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={confirmExit}
                className="flex-1 px-4 md:px-5 py-2.5 md:py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg shadow-red-900/30 text-xs md:text-sm"
              >
                Exit Game
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Game;
