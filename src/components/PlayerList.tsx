import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Users, UserMinus, Smile, ThumbsUp, ThumbsDown, Heart, Star } from 'lucide-react';

const emoteIcons = {
  smile: Smile,
  'thumbs-up': ThumbsUp,
  'thumbs-down': ThumbsDown,
  heart: Heart,
  star: Star,
};

const PlayerList = () => {
  const { gameState, gameInfo } = useGame();
  const { sendMessage } = useWebSocket();

  const handleKickPlayer = (playerId: string) => {
    if (gameState.isAdmin && playerId !== gameInfo.playerId) {
      sendMessage({
        type: 'kickPlayer',
        roomId: gameInfo.roomId,
        playerId
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Users className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-semibold">Players ({gameState.players.length})</h2>
      </div>

      <ul className="space-y-2">
        {gameState.players.map((player, index) => {
          const EmoteIcon = player.emote ? emoteIcons[player.emote as keyof typeof emoteIcons] : null;

          return (
            <li
              key={player.id}
              className={`p-3 rounded-lg ${
                index === 0
                  ? 'bg-indigo-600/40 border border-indigo-500/50'
                  : player.id === gameInfo.playerId
                  ? 'bg-green-600/40 border border-green-500/50'
                  : 'bg-indigo-900/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  {player.name} {player.id === gameInfo.playerId && '(You)'}
                  {EmoteIcon && <EmoteIcon className="w-5 h-5 ml-2 text-yellow-400" />}
                </span>
                <div className="flex items-center space-x-2">
                  {index === 0 && (
                    <span className="px-2 py-1 text-xs bg-indigo-500 rounded-full">
                      Admin
                    </span>
                  )}
                  {gameState.isAdmin && player.id !== gameInfo.playerId && (
                    <button
                      onClick={() => handleKickPlayer(player.id)}
                      className="text-red-400 transition-colors hover:text-red-300"
                      title="Kick player"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PlayerList;

