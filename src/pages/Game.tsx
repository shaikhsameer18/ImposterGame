import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import AdminPanel from '../components/AdminPanel';
import PlayerList from '../components/PlayerList';
import GameScreen from '../components/GameScreen';
import WaitingScreen from '../components/WaitingScreen';
import { Ghost } from 'lucide-react';

const Game = () => {
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
        <div className="text-center mb-8">
          <Ghost className="mx-auto h-12 w-12 text-indigo-400" />
          <h1 className="text-3xl font-bold mt-2">Room: {gameInfo.roomId}</h1>
        </div>

        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-8">
            {gameState.isAdmin && !gameState.gameStarted && <AdminPanel />}
            {!gameState.isAdmin && !gameState.gameStarted && <WaitingScreen />}
            {gameState.gameStarted && <GameScreen />}
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <PlayerList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;