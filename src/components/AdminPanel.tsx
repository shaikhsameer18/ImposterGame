import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import { Settings } from 'lucide-react';

const AdminPanel = () => {
  const { gameState, gameInfo } = useGame();
  const { sendMessage } = useWebSocket();
  const [imposterCount, setImposterCount] = useState(gameState.imposterCount);
  const [randomImposter, setRandomImposter] = useState(gameState.randomImposter);
  const [showCategories, setShowCategories] = useState(gameState.showCategories);

  const handleStartGame = () => {
    sendMessage({
      type: 'start',
      roomId: gameInfo.roomId,
      imposterCount,
      randomImposter,
      showCategories,
    });
  };

  const handleToggleCategory = () => {
    setShowCategories(!showCategories);
  };

  return (
    <div className="p-6 space-y-6 bg-white/10 backdrop-blur-lg rounded-xl">
      <div className="flex items-center space-x-3">
        <Settings className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-semibold">Game Settings</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Number of Imposters
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={imposterCount}
            onChange={(e) => setImposterCount(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg bg-indigo-900/30 border-indigo-300/30 focus:ring-2 focus:ring-indigo-500"
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

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Show Categories</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showCategories}
              onChange={handleToggleCategory}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-indigo-900/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <button
          onClick={handleStartGame}
          className="w-full px-4 py-2 font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;

