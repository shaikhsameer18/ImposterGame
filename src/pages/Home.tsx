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
    <div className="h-screen max-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto"
      >
        {/* Game Logo */}
        <div className="text-center mb-6">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="inline-flex p-5 rounded-full bg-primary-900/50 shadow-glow mb-2 relative"
          >
            <Ghost className="h-16 w-16 text-primary-400" />
            <motion.div 
              animate={{ 
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute inset-0 rounded-full bg-primary-500/20"
            />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-3xl font-bold bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent"
          >
            Imposter Game
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-1 text-surface-300 text-sm"
          >
            Find the imposter among you!
          </motion.p>
        </div>

        {/* Resume Game Notice */}
        {hasExistingGame && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-primary-900/30 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-primary-600/30 mb-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-primary-300 font-medium">Resume existing game?</h3>
                <p className="text-xs text-surface-300 mt-1">
                  You have an existing game in room <span className="font-mono font-medium text-primary-300">{roomId}</span>
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNewGame}
                className="text-xs flex items-center px-3 py-1.5 rounded-lg bg-surface-800/60 hover:bg-surface-700/60 text-surface-300 border border-surface-700/50"
              >
                <RotateCw className="w-3 h-3 mr-1.5" />
                New Game
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Join Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-surface-800/70 backdrop-blur-lg p-5 rounded-xl shadow-xl border border-primary-600/20 mb-4"
        >
          <form className="space-y-4" onSubmit={handleJoin}>
            <div>
              <label htmlFor="playerName" className="flex items-center text-xs font-medium text-surface-300 mb-1.5 ml-1">
                <User className="w-3.5 h-3.5 mr-1.5" />
                YOUR NAME
              </label>
              <div className="relative">
                <input
                  id="playerName"
                  type="text"
                  required
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="appearance-none rounded-lg relative block w-full px-4 py-2.5 pl-10 border border-surface-600 placeholder-surface-400 text-white bg-surface-800/60 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-surface-500" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="roomId" className="flex items-center text-xs font-medium text-surface-300 mb-1.5 ml-1">
                  <HomeIcon className="w-3.5 h-3.5 mr-1.5" />
                  ROOM ID
                </label>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={generateRandomRoomId}
                  className="text-xs flex items-center text-primary-400 hover:text-primary-300 mb-1"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Generate random
                </motion.button>
              </div>
              <div className="relative">
                <input
                  id="roomId"
                  type="text"
                  required
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="Enter room ID"
                  className="appearance-none rounded-lg relative block w-full px-4 py-2.5 pl-10 border border-surface-600 placeholder-surface-400 text-white bg-surface-800/60 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all uppercase"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-surface-500" />
                </div>
              </div>
              <p className="mt-1.5 text-xs text-surface-400">
                Join an existing room or create a new one with any ID
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isJoining}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-lg shadow-primary-900/30 disabled:opacity-70"
            >
              {isJoining ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Joining...
                </div>
              ) : (
                <div className="flex items-center">
                  <Zap className="mr-2 w-4 h-4 text-white/80" />
                  Join Game
                  <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Game features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-2 mb-3"
        >
          <div className="flex flex-col items-center text-center p-2 bg-surface-800/40 rounded-lg border border-surface-700/30">
            <Shield className="w-4 h-4 text-primary-400 mb-1" />
            <span className="text-xs text-surface-300">Secret Roles</span>
          </div>
          
          <div className="flex flex-col items-center text-center p-2 bg-surface-800/40 rounded-lg border border-surface-700/30">
            <User className="w-4 h-4 text-primary-400 mb-1" />
            <span className="text-xs text-surface-300">Multiplayer</span>
          </div>
          
          <div className="flex flex-col items-center text-center p-2 bg-surface-800/40 rounded-lg border border-surface-700/30">
            <Ghost className="w-4 h-4 text-primary-400 mb-1" />
            <span className="text-xs text-surface-300">Word Guessing</span>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <p className="text-xs text-surface-400">
            Made with <span className="text-red-500">♥</span> | Find the imposter edition
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;