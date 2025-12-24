import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import {
    Smile, ThumbsUp, ThumbsDown, Heart, Star,
    Laugh, Frown, PartyPopper, Flame, Sparkles,
    X, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emotes = [
    { icon: Smile, name: 'smile', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30', hoverBg: 'hover:bg-yellow-900/50', glowColor: 'shadow-yellow-500/50', label: '😊 Happy' },
    { icon: Laugh, name: 'laugh', color: 'text-amber-400', bgColor: 'bg-amber-900/30', hoverBg: 'hover:bg-amber-900/50', glowColor: 'shadow-amber-500/50', label: '😂 LOL' },
    { icon: ThumbsUp, name: 'thumbs-up', color: 'text-primary-400', bgColor: 'bg-primary-900/30', hoverBg: 'hover:bg-primary-900/50', glowColor: 'shadow-primary-500/50', label: '👍 Agree' },
    { icon: ThumbsDown, name: 'thumbs-down', color: 'text-red-400', bgColor: 'bg-red-900/30', hoverBg: 'hover:bg-red-900/50', glowColor: 'shadow-red-500/50', label: '👎 Disagree' },
    { icon: Heart, name: 'heart', color: 'text-pink-400', bgColor: 'bg-pink-900/30', hoverBg: 'hover:bg-pink-900/50', glowColor: 'shadow-pink-500/50', label: '❤️ Love' },
    { icon: Star, name: 'star', color: 'text-amber-400', bgColor: 'bg-amber-900/30', hoverBg: 'hover:bg-amber-900/50', glowColor: 'shadow-amber-500/50', label: '⭐ Amazing' },
    { icon: PartyPopper, name: 'party', color: 'text-secondary-400', bgColor: 'bg-secondary-900/30', hoverBg: 'hover:bg-secondary-900/50', glowColor: 'shadow-secondary-500/50', label: '🎉 Celebrate' },
    { icon: Flame, name: 'fire', color: 'text-orange-400', bgColor: 'bg-orange-900/30', hoverBg: 'hover:bg-orange-900/50', glowColor: 'shadow-orange-500/50', label: '🔥 Fire' },
    { icon: Sparkles, name: 'sparkles', color: 'text-accent-400', bgColor: 'bg-accent-900/30', hoverBg: 'hover:bg-accent-900/50', glowColor: 'shadow-accent-500/50', label: '✨ Brilliant' },
    { icon: Frown, name: 'sad', color: 'text-blue-400', bgColor: 'bg-blue-900/30', hoverBg: 'hover:bg-blue-900/50', glowColor: 'shadow-blue-500/50', label: '😢 Sad' },
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
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`flex items-center justify-between mb-3 p-3 rounded-xl glass-card-hover border ${recentlyChanged ? 'border-primary-500/50 shadow-glow' : 'border-surface-700/50'
                            }`}
                    >
                        <div className="flex items-center">
                            <motion.div
                                animate={recentlyChanged ? {
                                    scale: [1, 1.3, 1],
                                    rotate: [0, 10, -10, 0]
                                } : {}}
                                transition={{ duration: 0.5 }}
                                className={`p-2 rounded-xl ${activeEmote.bgColor} mr-3 border border-${activeEmote.color.split('-')[1]}-500/30`}
                            >
                                <ActiveEmoteIcon className={`w-5 h-5 md:w-6 md:h-6 ${activeEmote.color}`} />
                            </motion.div>
                            <div>
                                <span className="text-xs md:text-sm text-surface-400 block">Your reaction</span>
                                <span className="text-sm md:text-base font-semibold text-surface-200">{activeEmote.label}</span>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleClearEmote}
                            className="p-2 text-surface-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                            title="Clear reaction"
                        >
                            <X className="w-4 h-4 md:w-5 md:h-5" />
                        </motion.button>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEmotes(!showEmotes)}
                className="btn-primary group w-full px-4 py-3 md:py-3.5 font-semibold text-sm md:text-base flex items-center justify-center"
            >
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span>React with Emote</span>
                <motion.div
                    animate={{ rotate: showEmotes ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronUp className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {showEmotes && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 p-4 md:p-5 mb-3 glass-card rounded-2xl border border-surface-700/50 bottom-full z-[100] shadow-2xl"
                    >
                        <div className="text-xs md:text-sm font-semibold text-primary-300 mb-3 md:mb-4 flex items-center">
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2 text-primary-400" />
                            Choose your reaction:
                        </div>
                        <div className="grid grid-cols-5 gap-2 md:gap-3">
                            {emotes.map((emote, index) => {
                                const isActive = currentEmote === emote.name;
                                return (
                                    <motion.button
                                        key={emote.name}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ scale: 1.15, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleEmote(emote.name)}
                                        className={`p-2 md:p-3 flex flex-col items-center transition-all rounded-xl ${isActive
                                            ? `${emote.bgColor} border-2 border-${emote.color.split('-')[1]}-400 shadow-lg ${emote.glowColor}`
                                            : 'glass-card-hover border border-surface-700/30'
                                            }`}
                                        title={emote.label}
                                    >
                                        <motion.div
                                            animate={isActive ? {
                                                scale: [1, 1.2, 1],
                                                rotate: [0, 10, -10, 0]
                                            } : {}}
                                            transition={{
                                                duration: 0.8,
                                                repeat: isActive ? Infinity : 0,
                                                repeatType: "reverse"
                                            }}
                                        >
                                            <emote.icon className={`w-5 h-5 md:w-6 md:h-6 ${emote.color}`} />
                                        </motion.div>
                                        <span className="text-[10px] md:text-xs mt-1 text-surface-300 font-medium text-center leading-tight">
                                            {emote.label.split(' ')[0]}
                                        </span>
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
