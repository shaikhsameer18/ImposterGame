import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/WebSocketContext';
import { useGame } from '../context/GameContext';
import { Ghost, User, Home as HomeIcon, Key, ArrowRight, Shield, RefreshCw, Zap, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [hasExistingGame, setHasExistingGame] = useState(false);
  const { connect } = useWebSocket();
  const { gameInfo, setGameInfo, resetGame } = useGame();
  const navigate = useNavigate();

  // Check for existing game on component mount
  useEffect(() => {
    if (gameInfo.roomId && gameInfo.playerName) {
      setHasExistingGame(true);
      setPlayerName(gameInfo.playerName);
      setRoomId(gameInfo.roomId);
    }
  }, [gameInfo]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !roomId.trim()) {
      toast.error('Please enter your name and a room ID');
      return;
    }

    setIsJoining(true);
    try {
      // Set game info first - important for the WebSocketProvider to have access to this
      const updatedGameInfo = {
        playerName,
        roomId,
        playerId: gameInfo.playerId || ''
      };
      setGameInfo(updatedGameInfo);

      // Connect to WebSocket
      await connect(roomId, playerName);

      // Navigate to game page on success
      navigate('/game');
    } catch (error) {
      setIsJoining(false);
      console.error('Failed to join the game:', error);
      toast.error('Failed to join the game. Please try again.');
    }
  };

  const handleNewGame = () => {
    resetGame();
    setHasExistingGame(false);
    setPlayerName('');
    setRoomId('');
    toast.success('Started a new game session');
  };

  // Generate a random 6-character room ID
  const generateRandomRoomId = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setRoomId(result);
    toast.success('Random room ID generated!', { id: 'room-id' });
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Animated floating orbs in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary-500/8 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-8"
      >
        {/* Left Side - Logo and Features */}
        <div className="flex-1 flex flex-col items-center lg:items-start w-full lg:w-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2
            }}
            className="inline-flex p-4 md:p-5 rounded-3xl glass-card mb-3 md:mb-4 relative group"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Ghost className="h-12 w-12 md:h-16 md:w-16 text-primary-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
            </motion.div>
            <motion.div
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-300 via-accent-300 to-secondary-300 bg-clip-text text-transparent drop-shadow-lg mb-1 md:mb-2 text-center"
          >
            Imposter Game
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-surface-300 text-xs md:text-sm font-medium mb-4 md:mb-8 text-center"
          >
            Find the imposter among you! 🕵️
          </motion.p>

          {/* Game features - Vertical Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="hidden lg:flex flex-col space-y-3 w-full max-w-xs"
          >
            <motion.div
              whileHover={{ scale: 1.03, x: 5 }}
              className="glass-card-hover flex items-center p-3 rounded-xl cursor-pointer"
            >
              <div className="p-2.5 bg-primary-500/20 rounded-lg mr-3">
                <Shield className="w-5 h-5 text-primary-400" />
              </div>
              <span className="text-sm font-semibold text-surface-200">Secret Roles</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, x: 5 }}
              className="glass-card-hover flex items-center p-3 rounded-xl cursor-pointer"
            >
              <div className="p-2.5 bg-accent-500/20 rounded-lg mr-3">
                <User className="w-5 h-5 text-accent-400" />
              </div>
              <span className="text-sm font-semibold text-surface-200">Multiplayer</span>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, x: 5 }}
              className="glass-card-hover flex items-center p-3 rounded-xl cursor-pointer"
            >
              <div className="p-2.5 bg-secondary-500/20 rounded-lg mr-3">
                <Ghost className="w-5 h-5 text-secondary-400" />
              </div>
              <span className="text-sm font-semibold text-surface-200">Word Guessing</span>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="hidden lg:block mt-8"
          >
            <p className="text-xs text-surface-400">
              Made with <span className="text-red-500 animate-pulse">♥</span>
            </p>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 w-full max-w-md">
          {/* Resume Game Notice */}
          {hasExistingGame && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="glass-card p-3 md:p-4 rounded-2xl mb-3 md:mb-4 border-primary-500/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-primary-300 font-semibold text-sm md:text-base flex items-center">
                    <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                    Resume game?
                  </h3>
                  <p className="text-[10px] md:text-xs text-surface-300 mt-1">
                    Room: <span className="font-mono font-bold text-primary-400 bg-primary-900/30 px-1 md:px-1.5 py-0.5 rounded">{roomId}</span>
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNewGame}
                  className="ml-2 md:ml-3 flex items-center px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-surface-800/80 hover:bg-surface-700/80 text-surface-200 border border-surface-600/50 transition-all duration-300 text-xs md:text-sm"
                >
                  <RotateCw className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 md:mr-1.5" />
                  New
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Join Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="glass-card p-4 md:p-6 rounded-2xl"
          >
            <form className="space-y-3 md:space-y-4" onSubmit={handleJoin}>
              <div>
                <label htmlFor="playerName" className="flex items-center text-[10px] md:text-xs font-semibold text-surface-200 mb-1.5 md:mb-2 ml-1">
                  <User className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 md:mr-1.5 text-primary-400" />
                  YOUR NAME
                </label>
                <div className="relative group">
                  <input
                    id="playerName"
                    type="text"
                    required
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your Name"
                    className="input-field w-full px-3 md:px-4 py-2.5 md:py-3 pl-9 md:pl-11 text-sm md:text-base"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-surface-400 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 md:mb-2">
                  <label htmlFor="roomId" className="flex items-center text-[10px] md:text-xs font-semibold text-surface-200 ml-1">
                    <HomeIcon className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 md:mr-1.5 text-accent-400" />
                    ROOM ID
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={generateRandomRoomId}
                    className="flex items-center text-[10px] md:text-xs text-accent-400 hover:text-accent-300 font-medium transition-colors"
                  >
                    <RefreshCw className="w-3 h-3 md:w-3.5 md:h-3.5 mr-0.5 md:mr-1" />
                    Generate
                  </motion.button>
                </div>
                <div className="relative group">
                  <input
                    id="roomId"
                    type="text"
                    required
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Enter Room ID"
                    className="input-field w-full px-3 md:px-4 py-2.5 md:py-3 pl-9 md:pl-11 text-sm md:text-base tracking-wider"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Key className="h-3.5 w-3.5 md:h-4 md:w-4 text-surface-400 group-focus-within:text-accent-400 transition-colors" />
                  </div>
                </div>
                <p className="mt-1 md:mt-1.5 text-[10px] md:text-xs text-surface-400 ml-1">
                  Join existing or create new room
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isJoining}
                className="btn-primary group relative w-full flex justify-center items-center py-3 md:py-3.5 px-4 md:px-6 text-sm md:text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isJoining ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Joining...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Zap className="mr-1.5 md:mr-2 w-4 h-4 md:w-5 md:h-5" />
                    Join Game
                    <ArrowRight className="ml-1.5 md:ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Footer - Visible only on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="lg:hidden text-center mt-3"
          >
            <p className="text-[10px] text-surface-400">
              Made with <span className="text-red-500 animate-pulse">♥</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;