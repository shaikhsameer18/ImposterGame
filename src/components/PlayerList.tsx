import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import { 
  Users, UserMinus, Smile, ThumbsUp, ThumbsDown, Heart, Star, 
  User, Crown, Shield, UserCheck, Clock, AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const emoteIcons = {
  smile: Smile,
  'thumbs-up': ThumbsUp,
  'thumbs-down': ThumbsDown,
  heart: Heart,
  star: Star,
};

const emoteColors = {
  smile: 'text-yellow-400 bg-yellow-900/30',
  'thumbs-up': 'text-primary-400 bg-primary-900/30',
  'thumbs-down': 'text-red-400 bg-red-900/30',
  heart: 'text-pink-400 bg-pink-900/30',
  star: 'text-amber-400 bg-amber-900/30',
};

const PlayerList = () => {
  const { gameState, gameInfo } = useGame();
  const { sendMessage } = useWebSocket();
  const [confirmingKick, setConfirmingKick] = useState<string | null>(null);
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);

  const handleKickPlayer = (playerId: string) => {
    if (confirmingKick === playerId) {
      // Confirm kick
      if (gameState.isAdmin && playerId !== gameInfo.playerId) {
        sendMessage({
          type: 'kickPlayer',
          roomId: gameInfo.roomId,
          playerId
        });
      }
      setConfirmingKick(null);
    } else {
      // First click - ask for confirmation
      setConfirmingKick(playerId);
      
      // Auto-reset after 3 seconds
      setTimeout(() => {
        setConfirmingKick(null);
      }, 3000);
    }
  };

  // Sort players - admin (first player) first, then current user, then others
  const sortedPlayers = [...gameState.players].sort((a, b) => {
    if (gameState.players[0] && a.id === gameState.players[0].id) return -1;
    if (gameState.players[0] && b.id === gameState.players[0].id) return 1;
    if (a.id === gameInfo.playerId) return -1;
    if (b.id === gameInfo.playerId) return 1;
    return 0;
  });

  const getPlayerStatusIndicator = (player: any, isAdmin: boolean, isCurrentPlayer: boolean) => {
    if (isAdmin) {
      return {
        icon: Crown,
        color: 'text-amber-400',
        label: 'Admin'
      };
    } else if (isCurrentPlayer) {
      return {
        icon: UserCheck,
        color: 'text-secondary-400',
        label: 'You'
      };
    } else {
      return {
        icon: User,
        color: 'text-surface-400',
        label: 'Player'
      };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-1.5 rounded-full bg-primary-900/50 mr-2">
            <Users className="w-4 h-4 text-primary-400" />
          </div>
          <h2 className="text-lg font-semibold">Players</h2>
        </div>
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-surface-900/50 px-2.5 py-1 rounded-full text-xs font-medium border border-surface-700/50 flex items-center"
        >
          <User className="w-3 h-3 mr-1 text-primary-400" />
          {gameState.players.length} {gameState.players.length === 1 ? 'player' : 'players'}
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {gameState.players.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="p-6 flex flex-col items-center justify-center space-y-2 bg-surface-800/40 rounded-lg border border-surface-700/30"
          >
            <Clock className="w-6 h-6 text-surface-500 animate-pulse" />
            <p className="text-surface-400 text-sm text-center">Waiting for players to join...</p>
            <div className="text-xs text-surface-500 mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Need at least 3 players to start
            </div>
          </motion.div>
        ) : (
          <motion.ul 
            className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-20rem)] pr-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {sortedPlayers.map((player) => {
              const isAdmin = gameState.players[0] && player.id === gameState.players[0].id;
              const isCurrentPlayer = player.id === gameInfo.playerId;
              const isConfirmingKick = confirmingKick === player.id;
              const EmoteIcon = player.emote ? emoteIcons[player.emote as keyof typeof emoteIcons] : null;
              const emoteColor = player.emote ? emoteColors[player.emote as keyof typeof emoteColors] : '';
              const statusInfo = getPlayerStatusIndicator(player, isAdmin, isCurrentPlayer);
              
              return (
                <motion.li
                  key={player.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setHoveredPlayer(player.id)}
                  onMouseLeave={() => setHoveredPlayer(null)}
                  className={`p-3 rounded-lg transition-all ${
                    isAdmin
                      ? 'bg-primary-900/30 border border-primary-800/50 shadow-glow-sm'
                      : isCurrentPlayer
                      ? 'bg-secondary-900/30 border border-secondary-800/50 shadow-sm'
                      : 'bg-surface-800/60 hover:bg-surface-800/80 border border-surface-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1.5 rounded-full ${
                        isAdmin 
                          ? 'bg-primary-800/80 text-primary-300' 
                          : isCurrentPlayer 
                          ? 'bg-secondary-800/80 text-secondary-300'
                          : 'bg-surface-800 text-surface-300'
                      }`}>
                        <statusInfo.icon className={`w-4 h-4 ${statusInfo.color}`} />
                      </motion.div>
                      
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className={`font-medium ${isAdmin ? 'text-primary-200' : isCurrentPlayer ? 'text-secondary-200' : ''}`}>
                            {player.name}
                          </span>
                          
                          {/* Player status indicators */}
                          <AnimatePresence>
                            {(hoveredPlayer === player.id || isAdmin || isCurrentPlayer) && (
                              <motion.div 
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -5 }}
                                className="flex ml-2 space-x-1"
                              >
                                {isCurrentPlayer && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 text-xs bg-secondary-900/60 text-secondary-300 rounded-sm border border-secondary-800/50">
                                    <UserCheck className="w-3 h-3 mr-1" />
                                    You
                                  </span>
                                )}
                                
                                {isAdmin && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 text-xs bg-primary-900/60 text-primary-300 rounded-sm border border-primary-800/50">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Admin
                                  </span>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {EmoteIcon && (
                        <motion.div 
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className={`p-1.5 rounded-full ${emoteColor}`}
                        >
                          <EmoteIcon className={`w-4 h-4`} />
                        </motion.div>
                      )}
                      
                      {gameState.isAdmin && !isCurrentPlayer && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleKickPlayer(player.id)}
                          className={`p-1.5 transition-all rounded-full ${
                            isConfirmingKick 
                              ? 'bg-red-900/80 text-white animate-pulse' 
                              : 'text-red-400 bg-surface-900/50 hover:bg-red-900/30 hover:text-red-300'
                          }`}
                          title={isConfirmingKick ? "Click again to confirm" : "Kick player"}
                        >
                          <UserMinus className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerList;

