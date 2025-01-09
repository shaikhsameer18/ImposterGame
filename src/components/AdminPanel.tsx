import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Settings } from 'lucide-react';

const AdminPanel = () => {
  const [imposterCount, setImposterCount] = useState(1);
  const [randomImposter, setRandomImposter] = useState(false);
  const { gameInfo } = useGame();
  const { sendMessage } = useWebSocket();

  const handleStartGame = () => {
    sendMessage({
      type: 'start',
      roomId: gameInfo.roomId,
      imposterCount,
      randomImposter,
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="h-6 w-6 text-indigo-400" />
        <h2 className="text-xl font-semibold">Game Settings</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Imposters
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={imposterCount}
            onChange={(e) => setImposterCount(Number(e.target.value))}
            className="w-full px-3 py-2 bg-indigo-900/30 border border-indigo-300/30 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Randomize Count</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={randomImposter}
              onChange={(e) => setRandomImposter(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-indigo-900/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <button
          onClick={handleStartGame}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;