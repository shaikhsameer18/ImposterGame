import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Game from './pages/Game';
import { WebSocketProvider } from './context/WebSocketContext';
import { GameProvider } from './context/GameContext';
import InstallPWA from './components/InstallPWA';

const GameRoutes = () => {
  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col text-white bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="flex-1 overflow-y-auto">
        <div className="container relative h-full p-4 mx-auto sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      <InstallPWA />
      <Toaster position="top-center" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <GameProvider>
        <WebSocketProvider>
          <GameRoutes />
        </WebSocketProvider>
      </GameProvider>
    </Router>
  );
}

export default App;

