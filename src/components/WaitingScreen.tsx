import React from 'react';
import { Clock } from 'lucide-react';

const WaitingScreen = () => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center">
      <Clock className="h-12 w-12 mx-auto text-indigo-400 animate-pulse" />
      <h2 className="text-xl font-semibold mt-4">Waiting for the game to start...</h2>
      <p className="text-indigo-200 mt-2">The admin will start the game soon</p>
    </div>
  );
};

export default WaitingScreen;