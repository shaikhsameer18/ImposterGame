import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Target, Users } from 'lucide-react';

const GameScreen = () => {
  const { gameState, gameInfo } = useGame();
  const { sendMessage } = useWebSocket();

  const handleNextGame = () => {
    if (gameState.isAdmin) {
      sendMessage({
        type: 'nextGame',
        roomId: gameInfo.roomId,
        imposterCount: gameState.imposterCount,
        randomImposter: gameState.randomImposter,
      });
    }
  };

  const handleUpdateImposterCount = (newCount: number) => {
    if (gameState.isAdmin) {
      sendMessage({
        type: 'updateImposterCount',
        roomId: gameInfo.roomId,
        imposterCount: newCount
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white/10 backdrop-blur-lg rounded-xl">
      <div className="space-y-4 text-center">
        {gameState.word ? (
          <>
            <Target className="w-12 h-12 mx-auto text-indigo-400" />
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">{gameState.word}</h2>
              <p className="text-indigo-200">Category: {gameState.category}</p>
            </div>
            <p className="text-indigo-200">You are a regular player</p>
          </>
        ) : (
          <>
            <Users className="w-12 h-12 mx-auto text-red-400" />
            <h2 className="text-3xl font-bold">You are an Imposter!</h2>
            <p className="text-indigo-200">Category: {gameState.category}</p>
            {gameState.otherImposters && gameState.otherImposters.length > 0 && (
              <p className="text-indigo-200">
                Other Imposters: {gameState.otherImposters.join(', ')}
              </p>
            )}
          </>
        )}
      </div>

      {gameState.isAdmin && (
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Update Imposter Count
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={gameState.imposterCount}
              onChange={(e) => handleUpdateImposterCount(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg bg-indigo-900/30 border-indigo-300/30 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleNextGame}
            className="w-full px-4 py-2 font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Next Game
          </button>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
