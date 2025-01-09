import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../context/WebSocketContext';
import { useGame } from '../context/GameContext';
import { Ghost } from 'lucide-react';

const Home = () => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const { connect } = useWebSocket();
  const { setGameInfo } = useGame();
  const navigate = useNavigate();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !roomId.trim()) return;

    setGameInfo({ playerName, roomId });
    await connect(roomId, playerName);
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <Ghost className="mx-auto h-12 w-12 text-indigo-400" />
          <h2 className="mt-6 text-3xl font-bold">Imposter Game</h2>
          <p className="mt-2 text-sm text-indigo-200">Join a room to start playing</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleJoin}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-indigo-300/30 placeholder-indigo-300/50 text-white bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="text"
                required
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-indigo-300/30 placeholder-indigo-300/50 text-white bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;