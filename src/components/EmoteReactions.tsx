import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Smile, ThumbsUp, ThumbsDown, Heart, Star } from 'lucide-react';

const emotes = [
    { icon: Smile, name: 'smile' },
    { icon: ThumbsUp, name: 'thumbs-up' },
    { icon: ThumbsDown, name: 'thumbs-down' },
    { icon: Heart, name: 'heart' },
    { icon: Star, name: 'star' },
];

const EmoteReactions: React.FC = () => {
    const { gameInfo } = useGame();
    const { sendMessage } = useWebSocket();
    const [showEmotes, setShowEmotes] = useState(false);

    const handleEmote = (emoteName: string) => {
        sendMessage({
            type: 'emote',
            roomId: gameInfo.roomId,
            playerId: gameInfo.playerId,
            emoteName,
        });
        setShowEmotes(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowEmotes(!showEmotes)}
                className="px-4 py-2 font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
                Emote
            </button>
            {showEmotes && (
                <div className="absolute left-0 flex p-2 mb-2 space-x-2 bg-gray-800 rounded-lg shadow-lg bottom-full">
                    {emotes.map((emote) => (
                        <button
                            key={emote.name}
                            onClick={() => handleEmote(emote.name)}
                            className="p-2 transition-colors rounded-full hover:bg-gray-700"
                        >
                            <emote.icon className="w-6 h-6 text-white" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmoteReactions;

