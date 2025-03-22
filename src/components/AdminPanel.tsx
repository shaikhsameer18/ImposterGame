import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useWebSocket } from '../context/WebSocketContext';
import { 
  Settings, PlayCircle, Sliders, RefreshCw, Tag, 
  Share2, Copy, Crown, AlertCircle, Users, Hash,
  ChevronUp, ChevronDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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
    
    toast.success('Starting game!', {
      icon: '🎮',
      duration: 3000,
    });
  };

  const handleToggleCategory = () => {
    setShowCategories(!showCategories);
  };

  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(gameInfo.roomId)
      .then(() => {
        toast.success('Room ID copied to clipboard!', {
          icon: '📋',
          duration: 2000,
        });
      })
      .catch(() => {
        toast.error('Failed to copy Room ID');
      });
  };
  
  const handleImposterCountChange = (value: number) => {
    // Ensure value is between 1 and the max (one less than total players or 5, whichever is smaller)
    const maxImposters = Math.min(5, Math.max(1, gameState.players.length - 1));
    const newValue = Math.max(1, Math.min(value, maxImposters));
    setImposterCount(newValue);
  };
  
  const incrementImposterCount = () => {
    const maxImposters = Math.min(5, Math.max(1, gameState.players.length - 1));
    if (imposterCount < maxImposters) {
      handleImposterCountChange(imposterCount + 1);
    }
  };
  
  const decrementImposterCount = () => {
    if (imposterCount > 1) {
      handleImposterCountChange(imposterCount - 1);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-surface-800/70 backdrop-blur-lg rounded-xl border border-primary-600/20 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-surface-700/50">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-primary-900/50 mr-3">
            <Settings className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Game Settings</h2>
            <p className="text-xs text-surface-400">Configure before starting the game</p>
          </div>
        </div>
        <button
          onClick={copyRoomIdToClipboard}
          className="flex items-center text-xs px-3 py-1.5 bg-surface-900/60 rounded-md text-surface-300 hover:text-white transition-colors border border-surface-700/50 hover:border-primary-600/30 group"
          title="Copy Room ID"
        >
          <Share2 className="w-3.5 h-3.5 mr-1.5 group-hover:text-primary-400 transition-colors" />
          <span>{gameInfo.roomId}</span>
          <Copy className="w-3.5 h-3.5 ml-1.5 opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-surface-900/50 rounded-lg border border-surface-700/50 overflow-hidden">
          <div className="p-3 bg-surface-800/70 flex items-center border-b border-surface-700/30">
            <Crown className="w-4 h-4 text-amber-400 mr-2" />
            <span className="text-sm font-medium">Admin Controls</span>
          </div>
          
          <div className="p-4">
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center text-sm font-medium text-surface-300">
                  <Hash className="w-4 h-4 text-primary-400 mr-1.5" />
                  Number of Imposters
                </label>
                <span className="text-xs text-surface-400">
                  Max: {Math.min(5, Math.max(1, gameState.players.length - 1))}
                </span>
              </div>
              
              <div className="flex border rounded-lg overflow-hidden">
                <button 
                  onClick={decrementImposterCount}
                  disabled={imposterCount <= 1}
                  className="w-12 bg-surface-900/70 text-white flex items-center justify-center border-r border-surface-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={Math.min(5, Math.max(1, gameState.players.length - 1))}
                  value={imposterCount}
                  onChange={(e) => handleImposterCountChange(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-center bg-surface-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button 
                  onClick={incrementImposterCount}
                  disabled={imposterCount >= Math.min(5, Math.max(1, gameState.players.length - 1))}
                  className="w-12 bg-surface-900/70 text-white flex items-center justify-center border-l border-surface-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center mt-2">
                <AlertCircle className="w-3.5 h-3.5 text-surface-400 mr-1.5" />
                <p className="text-xs text-surface-400">
                  Players: {gameState.players.length} (Need at least 3 to play)
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-900/70 border border-surface-700/50">
                <div className="flex items-center">
                  <RefreshCw className="w-4 h-4 text-primary-400 mr-2" />
                  <span className="text-sm font-medium text-surface-300">Randomize Count</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomImposter}
                    onChange={(e) => setRandomImposter(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-surface-900/70 border border-surface-700/50">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 text-primary-400 mr-2" />
                  <span className="text-sm font-medium text-surface-300">Show Categories</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showCategories}
                    onChange={handleToggleCategory}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-900/50 rounded-lg border border-surface-700/50 p-4">
          <div className="flex items-center mb-3">
            <Users className="w-4 h-4 text-primary-400 mr-2" />
            <p className="text-sm text-surface-300">
              {gameState.players.length} {gameState.players.length === 1 ? 'player' : 'players'} in the game
            </p>
          </div>
          
          <button
            onClick={handleStartGame}
            disabled={gameState.players.length < 3}
            className="w-full mt-1 px-4 py-3.5 font-medium text-white transition-all bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary-600 disabled:hover:to-secondary-600"
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Start Game
          </button>
          
          {gameState.players.length < 3 && (
            <p className="text-xs text-amber-400 mt-2 text-center">
              Need at least 3 players to start the game
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

