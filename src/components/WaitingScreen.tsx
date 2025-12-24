import { Clock, AlertCircle, Info, Users, User, Copy, Sparkles, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const WaitingScreen = () => {
  const { gameState, gameInfo } = useGame();

  const copyRoomId = () => {
    navigator.clipboard.writeText(gameInfo.roomId)
      .then(() => toast.success('Room ID copied to clipboard!'))
      .catch(() => toast.error('Failed to copy room ID'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-4 md:p-8"
    >
      <div className="flex flex-col items-center">
        {/* Animated Clock Icon */}
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
          className="inline-flex p-5 md:p-6 rounded-3xl glass-card mb-5 md:mb-6 relative"
        >
          <Clock className="h-14 w-14 md:h-16 md:w-16 text-primary-400" />
          <motion.div
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary-300 via-accent-300 to-secondary-300 bg-clip-text text-transparent text-center"
        >
          Waiting for the game to start...
        </motion.h2>

        {/* Room ID */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center mb-6 md:mb-8 glass-card-hover px-4 py-2 rounded-xl"
        >
          <p className="text-surface-300 text-sm md:text-base">
            Room ID: <span className="font-mono font-bold text-primary-300 text-base md:text-lg">{gameInfo.roomId}</span>
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyRoomId}
            className="ml-3 p-2 rounded-lg hover:bg-surface-700/50 transition-colors"
          >
            <Copy className="h-4 w-4 md:h-5 md:w-5 text-surface-400 hover:text-primary-300" />
          </motion.button>
        </motion.div>

        {/* Players section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md glass-card rounded-xl overflow-hidden mb-5 md:mb-6 border border-surface-700/50"
        >
          <div className="bg-gradient-to-r from-primary-900/30 to-accent-900/20 p-3 md:p-4 flex items-center justify-between border-b border-surface-700/50">
            <div className="flex items-center">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-primary-400 mr-2" />
              <h3 className="text-sm md:text-base font-bold text-primary-200">
                Players ({gameState.players.length})
              </h3>
            </div>
            {gameState.isAdmin && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs md:text-sm bg-amber-900/50 text-amber-300 px-2 md:px-3 py-1 rounded-lg font-semibold border border-amber-700/50"
              >
                Admin
              </motion.span>
            )}
          </div>

          <div className="p-3 md:p-4">
            {gameState.players.length === 0 ? (
              <p className="text-sm text-surface-400 text-center italic py-4">Waiting for players to join...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                {gameState.players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center p-2.5 md:p-3 rounded-xl ${player.id === gameInfo.playerId
                        ? 'bg-gradient-to-r from-primary-900/40 to-accent-900/30 border-2 border-primary-500/50'
                        : 'glass-card-hover border border-surface-700/30'
                      }`}
                  >
                    <div className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center ${player.id === gameInfo.playerId
                        ? 'bg-gradient-to-br from-primary-600 to-accent-600'
                        : 'bg-surface-700/50'
                      }`}>
                      <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div className="ml-2 md:ml-3 truncate flex-1">
                      <p className={`text-sm md:text-base font-semibold ${player.id === gameInfo.playerId ? 'text-primary-300' : 'text-surface-200'
                        }`}>
                        {player.name}
                        {player.id === gameInfo.playerId && <span className="ml-1.5 text-xs">(you)</span>}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Tips section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-md glass-card rounded-xl overflow-hidden border border-surface-700/50"
        >
          <div className="bg-gradient-to-r from-accent-900/30 to-secondary-900/20 p-3 md:p-4 flex items-center border-b border-surface-700/50">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-accent-400 mr-2" />
            <h3 className="text-sm md:text-base font-bold text-accent-200">Game Tips</h3>
          </div>

          <div className="p-3 md:p-4 space-y-3">
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start glass-card-hover p-2 md:p-3 rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary-400 mr-2 md:mr-3" />
              </div>
              <p className="text-xs md:text-sm text-surface-300">
                If you're an <span className="font-bold text-red-400">imposter</span>, try to blend in without revealing that you don't know the word.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start glass-card-hover p-2 md:p-3 rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-accent-400 mr-2 md:mr-3" />
              </div>
              <p className="text-xs md:text-sm text-surface-300">
                If you're a <span className="font-bold text-primary-400">regular player</span>, identify the imposters by asking questions about the word.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-start glass-card-hover p-2 md:p-3 rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-secondary-400 mr-2 md:mr-3" />
              </div>
              <p className="text-xs md:text-sm text-surface-300">
                Use <span className="font-bold text-secondary-400">emotes</span> to react to other players' responses during discussions.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 md:mt-8 flex justify-center"
        >
          <div className="flex space-x-2">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              className="w-2.5 h-2.5 md:w-3 md:h-3 bg-primary-400 rounded-full shadow-glow"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
              className="w-2.5 h-2.5 md:w-3 md:h-3 bg-accent-400 rounded-full shadow-accent-glow"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
              className="w-2.5 h-2.5 md:w-3 md:h-3 bg-secondary-400 rounded-full shadow-warm-glow"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WaitingScreen;