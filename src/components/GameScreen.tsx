import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import {
  Target, AlertTriangle, CheckCircle2, Info, Shield, Hash, User, Users, RefreshCw, Home,
  Sparkles, Flame, Eye, EyeOff, ChevronUp, ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center mt-3"
        >
          <EyeOff className="w-4 h-4 md:w-5 md:h-5 text-red-400 mr-2" />
          <p className="text-surface-300 text-sm md:text-base">
            Category: <span className="opacity-0">hidden</span>
          </p>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center mt-3"
      >
        <Target className="w-4 h-4 md:w-5 md:h-5 text-primary-400 mr-2" />
        <p className="text-surface-300 text-sm md:text-base">
          Category: <span className="font-bold text-primary-300">{gameState.category}</span>
        </p>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 md:p-6 space-y-5 md:space-y-6 glass-card rounded-2xl"
    >
      <div className="space-y-5 md:space-y-6">
        {gameState.isImposter ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 md:space-y-5"
          >
            {/* Imposter Icon */}
            <div className="flex justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-flex p-5 md:p-6 rounded-3xl bg-gradient-to-br from-red-900/50 to-red-800/30 shadow-2xl border-2 border-red-500/50"
              >
                <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-red-400" />
              </motion.div>
            </div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-4xl font-bold text-center bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent"
            >
              You are an Imposter!
            </motion.h2>

            {/* Tips Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 md:p-5 rounded-xl glass-card border border-red-500/30"
            >
              <div className="flex items-center mb-3 md:mb-4">
                <Flame className="w-5 h-5 md:w-6 md:h-6 text-red-400 mr-2 md:mr-3" />
                <p className="text-red-300 font-bold text-base md:text-lg">
                  Imposter Strategy
                </p>
              </div>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-surface-300">
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start glass-card-hover p-2 md:p-3 rounded-lg"
                >
                  <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                  <span>Listen carefully to identify the word without revealing you don't know it</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start glass-card-hover p-2 md:p-3 rounded-lg"
                >
                  <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                  <span>Ask vague questions that could apply to many topics</span>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start glass-card-hover p-2 md:p-3 rounded-lg"
                >
                  <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400 mr-2 md:mr-3 mt-0.5 flex-shrink-0" />
                  <span>If there are multiple imposters, try to identify your allies</span>
                </motion.li>
              </ul>
            </motion.div>

            {renderCategoryInfo()}

            {/* Other Imposters */}
            {gameState.otherImposters && gameState.otherImposters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="p-4 md:p-5 rounded-xl glass-card border border-red-500/30"
              >
                <div className="flex items-center mb-3 md:mb-4">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-red-400 mr-2 md:mr-3" />
                  <p className="text-surface-200 font-bold text-sm md:text-base">
                    Your Fellow Imposters:
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {gameState.otherImposters.map((name, index) => (
                    <motion.span
                      key={name}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-red-900/50 to-red-800/30 text-red-300 rounded-xl text-xs md:text-sm flex items-center font-semibold border border-red-500/30"
                    >
                      <User className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                      {name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 md:space-y-5"
          >
            <div className="flex flex-col items-center">
              {/* Regular Player Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-flex p-5 md:p-6 rounded-3xl bg-gradient-to-br from-primary-900/50 to-accent-900/30 shadow-2xl border-2 border-primary-500/50 mb-5 md:mb-6"
              >
                <CheckCircle2 className="w-12 h-12 md:w-16 md:w-16 text-primary-400" />
              </motion.div>

              {/* Word Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 md:mb-5 text-center"
              >
                <motion.h2
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(168, 85, 247, 0.5)",
                      "0 0 40px rgba(168, 85, 247, 0.8)",
                      "0 0 20px rgba(168, 85, 247, 0.5)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="text-3xl md:text-5xl font-black bg-gradient-to-r from-primary-300 via-accent-300 to-secondary-300 bg-clip-text text-transparent mb-2 md:mb-3"
                >
                  {gameState.word}
                </motion.h2>
                {renderCategoryInfo()}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm text-primary-200 bg-gradient-to-r from-primary-900/50 to-accent-900/30 rounded-xl mb-5 md:mb-6 font-semibold border border-primary-500/30"
              >
                <Eye className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                You are a Regular Player
              </motion.p>

              {/* Game Hints */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-md p-4 md:p-5 rounded-xl glass-card border border-primary-500/30"
              >
                <div className="flex items-center mb-3">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary-400 mr-2 md:mr-3" />
                  <h3 className="text-sm md:text-base font-bold text-primary-200">Playing as Regular Player</h3>
                </div>
                <p className="text-xs md:text-sm text-surface-300 leading-relaxed">
                  Ask questions that reveal your knowledge of the word, but be careful not to make it too obvious for the imposters to guess. Use reactions to show your suspicions about other players.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Admin Controls */}
      {gameState.isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 md:space-y-5 pt-5 md:pt-6 border-t border-surface-700/50"
        >
          <div className="glass-card p-4 md:p-5 rounded-xl border border-amber-500/30">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-amber-400 mr-2 md:mr-3" />
              <h3 className="text-base md:text-lg font-bold text-amber-200">Admin Controls</h3>
            </div>

            {/* Imposter Count */}
            <div className="mb-4">
              <label className="flex items-center text-xs md:text-sm font-semibold text-surface-300 mb-3">
                <Hash className="w-4 h-4 md:w-5 md:h-5 mr-2 text-primary-400" />
                Update Imposter Count
              </label>
              <div className="flex border-2 border-surface-700/50 rounded-xl overflow-hidden bg-surface-900/50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpdateImposterCount(Math.max(1, gameState.imposterCount - 1))}
                  disabled={gameState.imposterCount <= 1}
                  className="w-12 md:w-14 bg-surface-800/70 text-white flex items-center justify-center border-r-2 border-surface-700/50 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-700/70 transition-all"
                >
                  <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={gameState.imposterCount}
                  onChange={(e) => handleUpdateImposterCount(Number(e.target.value))}
                  className="w-full px-4 py-3 md:py-4 text-center text-lg md:text-xl font-bold bg-surface-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpdateImposterCount(Math.min(10, gameState.imposterCount + 1))}
                  className="w-12 md:w-14 bg-surface-800/70 text-white flex items-center justify-center border-l-2 border-surface-700/50 hover:bg-surface-700/70 transition-all"
                >
                  <ChevronUp className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
              </div>
            </div>

            {/* Show Categories Toggle */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-3 md:p-4 rounded-xl glass-card-hover cursor-pointer mb-4"
            >
              <span className="text-sm md:text-base font-semibold text-surface-200">Show Categories</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localShowCategories}
                  onChange={(e) => setLocalShowCategories(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 md:w-12 md:h-7 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 md:after:h-6 md:after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-600 peer-checked:to-accent-600"></div>
              </label>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex gap-3 md:gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextGame}
                className="flex-1 btn-primary px-4 py-3 md:py-3.5 font-semibold text-sm md:text-base flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Next Game
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleResetGame}
                className="flex-1 px-4 py-3 md:py-3.5 font-semibold text-sm md:text-base text-white transition-all bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/30"
              >
                <Home className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Reset Game
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GameScreen;
