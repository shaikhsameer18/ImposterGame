import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Game from './pages/Game';
import { WebSocketProvider } from './context/WebSocketContext';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <WebSocketProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game" element={<Game />} />
            </Routes>
            <Toaster position="top-center" />
          </div>
        </Router>
      </WebSocketProvider>
    </GameProvider>
  );
}

export default App;