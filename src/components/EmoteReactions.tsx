import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Smile, ThumbsUp, ThumbsDown, Heart, Star, MessageSquareHeart, X, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emotes = [
    { icon: Smile, name: 'smile', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30', hoverBg: 'hover:bg-yellow-900/50', label: 'Smile' },
    { icon: ThumbsUp, name: 'thumbs-up', color: 'text-primary-400', bgColor: 'bg-primary-900/30', hoverBg: 'hover:bg-primary-900/50', label: 'Agree' },
    { icon: ThumbsDown, name: 'thumbs-down', color: 'text-red-400', bgColor: 'bg-red-900/30', hoverBg: 'hover:bg-red-900/50', label: 'Disagree' },
    { icon: Heart, name: 'heart', color: 'text-pink-400', bgColor: 'bg-pink-900/30', hoverBg: 'hover:bg-pink-900/50', label: 'Love' },
    { icon: Star, name: 'star', color: 'text-amber-400', bgColor: 'bg-amber-900/30', hoverBg: 'hover:bg-amber-900/50', label: 'Wow' },
];

const EmoteReactions = () => {
    const { gameInfo, gameState } = useGame();
    const { sendMessage } = useWebSocket();
    const [showEmotes, setShowEmotes] = useState(false);
    const [currentEmote, setCurrentEmote] = useState<string | null>(null);
    const [recentlyChanged, setRecentlyChanged] = useState(false);
    
    // Get the current player's emote from gameState
    useEffect(() => {
        const myPlayer = gameState.players.find(player => player.id === gameInfo.playerId);
        setCurrentEmote(myPlayer?.emote || null);
    }, [gameState.players, gameInfo.playerId]);

    const handleEmote = (emoteName: string) => {
        // If clicking current emote, clear it
        const newEmote = currentEmote === emoteName ? '' : emoteName;
        
        sendMessage({
            type: 'emote',
            roomId: gameInfo.roomId,
            playerId: gameInfo.playerId,
            emoteName: newEmote,
        });
        
        setCurrentEmote(newEmote || null);
        setShowEmotes(false);
        
        // Show animation feedback
        if (newEmote) {
            setRecentlyChanged(true);
            setTimeout(() => setRecentlyChanged(false), 1000);
        }
    };

    const handleClearEmote = () => {
        sendMessage({
            type: 'emote',
            roomId: gameInfo.roomId,
            playerId: gameInfo.playerId,
            emoteName: '',
        });
        
        setCurrentEmote(null);
    };

    // Find the current emote data
    const activeEmote = currentEmote ? emotes.find(e => e.name === currentEmote) : null;
    const ActiveEmoteIcon = activeEmote?.icon;

    return (
        <div className="relative">
            <AnimatePresence>
                {currentEmote && ActiveEmoteIcon ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`flex items-center justify-between mb-3 p-2 rounded-lg bg-surface-900/70 border border-surface-700/50 ${recentlyChanged ? 'ring-2 ring-primary-500/50' : ''}`}
                    >
                        <div className="flex items-center">
                            <motion.div 
                                animate={recentlyChanged ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.4 }}
                                className={`p-1.5 rounded-full ${activeEmote.bgColor} mr-2`}
                            >
                                <ActiveEmoteIcon className={`w-5 h-5 ${activeEmote.color}`} />
                            </motion.div>
                            <span className="text-sm text-surface-300">Your current reaction</span>
                        </div>
                        <button
                            onClick={handleClearEmote}
                            className="p-1.5 text-surface-400 hover:text-surface-200 hover:bg-surface-700/50 rounded-full transition-colors"
                            title="Clear reaction"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ) : null}
            </AnimatePresence>
            
            <button
                onClick={() => setShowEmotes(!showEmotes)}
                className="group px-4 py-2.5 font-medium text-white transition-all bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 rounded-lg flex items-center justify-center space-x-2 w-full shadow-lg shadow-primary-900/20"
            >
                <MessageSquareHeart className="w-5 h-5 mr-1.5 group-hover:animate-pulse" />
                <span>React with Emote</span>
                <ChevronUp className={`w-4 h-4 ml-1 transition-transform duration-300 ${showEmotes ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
                {showEmotes && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 10, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 p-3 mb-3 space-y-2 bg-surface-800 border border-surface-700 rounded-lg shadow-xl bottom-full z-50"
                    >
                        <div className="text-xs font-medium text-primary-400 mb-1 pl-1 flex items-center">
                            <MessageSquareHeart className="w-3.5 h-3.5 mr-1.5" />
                            Select your reaction:
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                            {emotes.map((emote) => {
                                const isActive = currentEmote === emote.name;
                                return (
                                    <motion.button
                                        key={emote.name}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleEmote(emote.name)}
                                        className={`p-2.5 flex flex-col items-center transition-all rounded-lg hover:bg-surface-700 ${
                                            isActive ? `${emote.bgColor} ring-2 ring-${emote.color.split('-')[1]}-400` : 'bg-surface-900/70'
                                        } ${emote.hoverBg}`}
                                        title={emote.label}
                                    >
                                        <motion.div
                                            animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                                            transition={{ duration: 0.7, repeat: isActive ? Infinity : 0, repeatType: "reverse" }}
                                        >
                                            <emote.icon className={`w-6 h-6 ${emote.color}`} />
                                        </motion.div>
                                        <span className="text-xs mt-1 text-surface-300">{emote.label}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EmoteReactions;

