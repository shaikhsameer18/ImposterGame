import { Clock, AlertCircle, Info, Users, User, Copy } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const WaitingScreen = () => {
  const { gameState, gameInfo } = useGame();
  
  const copyRoomId = () => {
    navigator.clipboard.writeText(gameInfo.roomId)
      .then(() => toast.success('Room ID copied to clipboard!'))
      .catch(() => toast.error('Failed to copy room ID'));
  };
  
  return (
    <div className="bg-surface-800/70 backdrop-blur-lg rounded-xl p-6 border border-primary-600/20 shadow-xl">
      <div className="flex flex-col items-center">
        <div className="inline-flex p-4 rounded-full bg-primary-900/50 shadow-glow mb-4">
          <Clock className="h-12 w-12 text-primary-400 animate-pulse-slow" />
        </div>
        
        <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
          Waiting for the game to start...
        </h2>
        
        <div className="flex items-center mb-4">
          <p className="text-surface-300 text-sm">Room ID: <span className="font-mono font-medium text-primary-300">{gameInfo.roomId}</span></p>
          <button 
            onClick={copyRoomId}
            className="ml-2 p-1.5 rounded-full hover:bg-surface-700/50 transition-colors"
          >
            <Copy className="h-3.5 w-3.5 text-surface-400 hover:text-primary-300" />
          </button>
        </div>
        
        {/* Players section */}
        <div className="w-full max-w-md bg-surface-900/50 rounded-lg border border-surface-700/50 overflow-hidden mb-6">
          <div className="bg-surface-800 p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary-400 mr-2" />
              <h3 className="text-sm font-medium">Players ({gameState.players.length})</h3>
            </div>
            {gameState.isAdmin && (
              <span className="text-xs bg-primary-900/50 text-primary-300 px-2 py-0.5 rounded">
                You're the admin
              </span>
            )}
          </div>
          
          <div className="p-4">
            {gameState.players.length === 0 ? (
              <p className="text-sm text-surface-400 text-center italic">Waiting for players to join...</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {gameState.players.map((player) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center p-2 rounded-lg ${player.id === gameInfo.playerId ? 'bg-primary-900/30 border border-primary-800/50' : 'bg-surface-800/50 border border-surface-700/30'}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${player.id === gameInfo.playerId ? 'bg-primary-700/50' : 'bg-surface-700/50'}`}>
                      <User className="h-4 w-4 text-surface-300" />
                    </div>
                    <div className="ml-2 truncate">
                      <p className={`text-sm font-medium ${player.id === gameInfo.playerId ? 'text-primary-300' : 'text-surface-300'}`}>
                        {player.name}
                        {player.id === gameInfo.playerId && <span className="ml-1 text-xs">(you)</span>}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Tips section */}
        <div className="w-full max-w-md bg-surface-900/50 rounded-lg border border-surface-700/50 overflow-hidden">
          <div className="bg-surface-800 p-3 flex items-center">
            <Info className="h-5 w-5 text-primary-400 mr-2" />
            <h3 className="text-sm font-medium">Game Tips</h3>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle className="h-4 w-4 text-primary-400 mr-2" />
              </div>
              <p className="text-xs text-surface-300">
                If you're an imposter, try to blend in with the others without revealing that you don't know the word.
              </p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle className="h-4 w-4 text-primary-400 mr-2" /> 
              </div>
              <p className="text-xs text-surface-300">
                If you're a regular player, try to identify the imposters by asking questions about the word.
              </p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle className="h-4 w-4 text-primary-400 mr-2" />
              </div>
              <p className="text-xs text-surface-300">
                Use emotes to react to other players' responses during discussions.
              </p>
            </div>
          </div>
        </div>
        
        {/* Loading animation */}
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingScreen;