import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import AdminPanel from '../components/AdminPanel';
import PlayerList from '../components/PlayerList';
import GameScreen from '../components/GameScreen';
import WaitingScreen from '../components/WaitingScreen';
import EmoteReactions from '../components/EmoteReactions';
import { Ghost } from 'lucide-react';

const Game: React.FC = () => {
  const { gameState, gameInfo } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameInfo.playerName || !gameInfo.roomId) {
      navigate('/');
    }
  }, [gameInfo, navigate]);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <Ghost className="w-12 h-12 mx-auto text-indigo-400" />
          <h1 className="mt-2 text-3xl font-bold">Room: {gameInfo.roomId}</h1>
        </div>

        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          {/* Left side */}
          <div className="space-y-8">
            {gameState.isAdmin && !gameState.gameStarted && <AdminPanel />}
            {!gameState.isAdmin && !gameState.gameStarted && <WaitingScreen />}
            {gameState.gameStarted && <GameScreen />}
          </div>

          {/* Right side */}
          <div className="p-6 bg-white/10 backdrop-blur-lg rounded-xl">
            <PlayerList />
            <div className="mt-4">
              <EmoteReactions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
