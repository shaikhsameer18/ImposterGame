import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import {
  Settings, PlayCircle, RefreshCw, Tag,
  Share2, Copy, Crown, AlertCircle, Users, Hash,
  ChevronUp, ChevronDown, Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  const { gameState, gameInfo } = useGame();
  const { sendMessage } = useWebSocket();
  const [imposterCount, setImposterCount] = useState(gameState.imposterCount);
  const [randomImposter, setRandomImposter] = useState(gameState.randomImposter);
  const [showCategories, setShowCategories] = useState(gameState.showCategories);

  const handleStartGame = () => {
    sendMessage({
      type: 'start',
      roomId: gameInfo.roomId,
      imposterCount,
      randomImposter,
      showCategories,
    });

    toast.success('Starting game!', {
      icon: '🎮',
      duration: 3000,
    });
  };

  const handleToggleCategory = () => {
    setShowCategories(!showCategories);
  };

  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(gameInfo.roomId)
      .then(() => {
        toast.success('Room ID copied to clipboard!', {
          icon: '📋',
          duration: 2000,
        });
      })
      .catch(() => {
        toast.error('Failed to copy Room ID');
      });
  };

  const handleImposterCountChange = (value: number) => {
    const maxImposters = Math.min(5, Math.max(1, gameState.players.length - 1));
    const newValue = Math.max(1, Math.min(value, maxImposters));
    setImposterCount(newValue);
  };

  const incrementImposterCount = () => {
    const maxImposters = Math.min(5, Math.max(1, gameState.players.length - 1));
    if (imposterCount < maxImposters) {
      handleImposterCountChange(imposterCount + 1);
    }
  };

  const decrementImposterCount = () => {
    if (imposterCount > 1) {
      handleImposterCountChange(imposterCount - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 space-y-4 md:space-y-6 glass-card rounded-2xl"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-surface-700/50 gap-3">
        <div className="flex items-center">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-2.5 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 mr-3 border border-primary-400/30"
          >
            <Settings className="w-5 h-5 md:w-6 md:h-6 text-primary-400" />
          </motion.div>
          <div>
            <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
              Game Settings
            </h2>
            <p className="text-xs md:text-sm text-surface-400">Configure before starting</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyRoomIdToClipboard}
          className="flex items-center text-xs md:text-sm px-3 md:px-4 py-2 glass-card-hover rounded-xl text-surface-300 hover:text-white transition-all group"
          title="Copy Room ID"
        >
          <Share2 className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 group-hover:text-primary-400 transition-colors" />
          <span className="font-mono font-bold">{gameInfo.roomId}</span>
          <Copy className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1.5 md:ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
        </motion.button>
      </div>

      <div className="space-y-4 md:space-y-5">
        {/* Admin Controls Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl overflow-hidden border border-surface-700/50"
        >
          <div className="p-3 md:p-4 bg-gradient-to-r from-amber-900/20 to-amber-800/10 flex items-center border-b border-amber-700/30">
            <Crown className="w-4 h-4 md:w-5 md:h-5 text-amber-400 mr-2" />
            <span className="text-sm md:text-base font-semibold text-amber-200">Admin Controls</span>
          </div>

          <div className="p-4 md:p-5 space-y-5">
            {/* Imposter Count */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center text-sm md:text-base font-semibold text-surface-200">
                  <Hash className="w-4 h-4 md:w-5 md:h-5 text-primary-400 mr-2" />
                  Number of Imposters
                </label>
                <span className="text-xs md:text-sm text-surface-400 bg-surface-800/50 px-2 py-1 rounded-lg">
                  Max: {Math.min(5, Math.max(1, gameState.players.length - 1))}
                </span>
              </div>

              <div className="flex border-2 border-surface-700/50 rounded-xl overflow-hidden bg-surface-900/50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={decrementImposterCount}
                  disabled={imposterCount <= 1}
                  className="w-14 md:w-16 bg-surface-800/70 text-white flex items-center justify-center border-r-2 border-surface-700/50 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-700/70 transition-all"
                >
                  <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
                <input
                  type="number"
                  min="1"
                  max={Math.min(5, Math.max(1, gameState.players.length - 1))}
                  value={imposterCount}
                  onChange={(e) => handleImposterCountChange(Number(e.target.value))}
                  className="w-full px-4 py-3 md:py-4 text-center text-lg md:text-xl font-bold bg-surface-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={incrementImposterCount}
                  disabled={imposterCount >= Math.min(5, Math.max(1, gameState.players.length - 1))}
                  className="w-14 md:w-16 bg-surface-800/70 text-white flex items-center justify-center border-l-2 border-surface-700/50 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-700/70 transition-all"
                >
                  <ChevronUp className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
              </div>

              <div className="flex items-center mt-2 md:mt-3">
                <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-surface-400 mr-1.5 md:mr-2" />
                <p className="text-xs md:text-sm text-surface-400">
                  Players: <span className="font-bold text-primary-400">{gameState.players.length}</span> (Need at least 3 to play)
                </p>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="flex flex-col space-y-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-3 md:p-4 rounded-xl glass-card-hover cursor-pointer"
              >
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 md:w-5 md:h-5 text-accent-400 mr-2 md:mr-3" />
                  <div>
                    <span className="text-sm md:text-base font-semibold text-surface-200 block">Randomize Count</span>
                    <span className="text-xs text-surface-400">Random imposter selection</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomImposter}
                    onChange={(e) => setRandomImposter(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 md:w-12 md:h-7 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 md:after:h-6 md:after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-600 peer-checked:to-accent-600"></div>
                </label>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-3 md:p-4 rounded-xl glass-card-hover cursor-pointer"
              >
                <div className="flex items-center">
                  <Tag className="w-4 h-4 md:w-5 md:h-5 text-secondary-400 mr-2 md:mr-3" />
                  <div>
                    <span className="text-sm md:text-base font-semibold text-surface-200 block">Show Categories</span>
                    <span className="text-xs text-surface-400">Display word categories</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCategories}
                    onChange={handleToggleCategory}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 md:w-12 md:h-7 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 md:after:h-6 md:after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-600 peer-checked:to-accent-600"></div>
                </label>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Start Game Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-4 md:p-5 border border-surface-700/50"
        >
          <div className="flex items-center mb-4">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-primary-400 mr-2" />
            <p className="text-sm md:text-base text-surface-300">
              <span className="font-bold text-primary-300">{gameState.players.length}</span> {gameState.players.length === 1 ? 'player' : 'players'} in the game
            </p>
          </div>

          <motion.button
            whileHover={{ scale: gameState.players.length >= 3 ? 1.02 : 1 }}
            whileTap={{ scale: gameState.players.length >= 3 ? 0.98 : 1 }}
            onClick={handleStartGame}
            disabled={gameState.players.length < 3}
            className="btn-primary w-full px-4 md:px-6 py-3.5 md:py-4 font-bold text-base md:text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 group-hover:rotate-12 transition-transform" />
            Start Game
            <PlayCircle className="w-5 h-5 md:w-6 md:h-6 ml-2 md:ml-3 group-hover:scale-110 transition-transform" />
          </motion.button>

          {gameState.players.length < 3 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs md:text-sm text-amber-400 mt-3 text-center flex items-center justify-center"
            >
              <AlertCircle className="w-4 h-4 mr-1.5" />
              Need at least 3 players to start the game
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
