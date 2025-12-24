import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import {
  Users, UserMinus, Smile, ThumbsUp, ThumbsDown, Heart, Star,
  User, Crown, Shield, UserCheck, Clock, AlertCircle,
  Laugh, Frown, PartyPopper, Flame, Sparkles as SparklesIcon
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const emoteIcons = {
  smile: Smile,
  laugh: Laugh,
  'thumbs-up': ThumbsUp,
  'thumbs-down': ThumbsDown,
  heart: Heart,
  star: Star,
  party: PartyPopper,
  fire: Flame,
  sparkles: SparklesIcon,
  sad: Frown,
};

const emoteColors = {
  smile: 'text-yellow-400 bg-yellow-900/30',
  laugh: 'text-amber-400 bg-amber-900/30',
  'thumbs-up': 'text-primary-400 bg-primary-900/30',
  'thumbs-down': 'text-red-400 bg-red-900/30',
  heart: 'text-pink-400 bg-pink-900/30',
  star: 'text-amber-400 bg-amber-900/30',
  party: 'text-secondary-400 bg-secondary-900/30',
  fire: 'text-orange-400 bg-orange-900/30',
  sparkles: 'text-accent-400 bg-accent-900/30',
  sad: 'text-blue-400 bg-blue-900/30',
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
    <div className="space-y-3 md:space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-2 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 mr-2 md:mr-3 border border-primary-400/30"
          >
            <Users className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
          </motion.div>
          <h2 className="text-base md:text-lg font-bold bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
            Players
          </h2>
        </div>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="glass-card-hover px-2.5 md:px-3 py-1 md:py-1.5 rounded-xl text-xs md:text-sm font-semibold border border-surface-700/50 flex items-center"
        >
          <User className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 md:mr-1.5 text-primary-400" />
          {gameState.players.length}
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {gameState.players.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="p-6 md:p-8 flex flex-col items-center justify-center space-y-3 glass-card rounded-xl border border-surface-700/30"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Clock className="w-8 h-8 md:w-10 md:h-10 text-surface-500" />
            </motion.div>
            <p className="text-surface-400 text-sm md:text-base text-center font-medium">Waiting for players to join...</p>
            <div className="text-xs md:text-sm text-surface-500 flex items-center">
              <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
              Need at least 3 players to start
            </div>
          </motion.div>
        ) : (
          <motion.ul
            className="space-y-2 md:space-y-2.5 overflow-y-auto max-h-[calc(100vh-20rem)] pr-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {sortedPlayers.map((player, index) => {
              const isAdmin = gameState.players[0] && player.id === gameState.players[0].id;
              const isCurrentPlayer = player.id === gameInfo.playerId;
              const isConfirmingKick = confirmingKick === player.id;
              const EmoteIcon = player.emote ? emoteIcons[player.emote as keyof typeof emoteIcons] : null;
              const emoteColor = player.emote ? emoteColors[player.emote as keyof typeof emoteColors] : '';
              const statusInfo = getPlayerStatusIndicator(player, isAdmin, isCurrentPlayer);

              return (
                <motion.li
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 3, scale: 1.01 }}
                  onMouseEnter={() => setHoveredPlayer(player.id)}
                  onMouseLeave={() => setHoveredPlayer(null)}
                  className={`p-3 md:p-3.5 rounded-xl transition-all ${isAdmin
                      ? 'bg-gradient-to-r from-amber-900/30 to-amber-800/20 border-2 border-amber-500/50 shadow-glow'
                      : isCurrentPlayer
                        ? 'bg-gradient-to-r from-primary-900/30 to-accent-900/20 border-2 border-primary-500/50 shadow-accent-glow'
                        : 'glass-card-hover border border-surface-700/30'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 md:p-2.5 rounded-xl ${isAdmin
                            ? 'bg-gradient-to-br from-amber-600 to-amber-500 shadow-lg shadow-amber-900/50'
                            : isCurrentPlayer
                              ? 'bg-gradient-to-br from-primary-600 to-accent-600 shadow-lg shadow-primary-900/50'
                              : 'bg-surface-800 border border-surface-700/50'
                          }`}
                      >
                        <statusInfo.icon className={`w-4 h-4 md:w-5 md:h-5 ${isAdmin || isCurrentPlayer ? 'text-white' : statusInfo.color
                          }`} />
                      </motion.div>

                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className={`font-semibold text-sm md:text-base truncate ${isAdmin ? 'text-amber-200' : isCurrentPlayer ? 'text-primary-200' : 'text-surface-200'
                            }`}>
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
                                  <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs bg-primary-900/60 text-primary-300 rounded-lg border border-primary-800/50 font-semibold">
                                    <UserCheck className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
                                    You
                                  </span>
                                )}

                                {isAdmin && (
                                  <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs bg-amber-900/60 text-amber-300 rounded-lg border border-amber-800/50 font-semibold">
                                    <Crown className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
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
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className={`p-1.5 md:p-2 rounded-xl ${emoteColor} border border-${emoteColor.split(' ')[0].split('-')[1]}-500/30`}
                        >
                          <EmoteIcon className="w-4 h-4 md:w-5 md:h-5" />
                        </motion.div>
                      )}

                      {gameState.isAdmin && !isCurrentPlayer && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleKickPlayer(player.id)}
                          className={`p-1.5 md:p-2 transition-all rounded-xl ${isConfirmingKick
                              ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-900/50'
                              : 'text-red-400 glass-card-hover hover:bg-red-900/30 hover:text-red-300 border border-surface-700/30'
                            }`}
                          title={isConfirmingKick ? "Click again to confirm" : "Kick player"}
                        >
                          <UserMinus className="w-4 h-4 md:w-5 md:h-5" />
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
