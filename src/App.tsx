import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Game from './pages/Game';
import { WebSocketProvider } from './context/WebSocketContext';
import { GameProvider } from './context/GameContext';
import InstallPWA from './components/InstallPWA';

const AppRoutes = () => {
  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col text-white bg-gradient-to-br from-surface-900 to-surface-950 relative">
      {/* Animated background patterns */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="container relative h-full mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
      <InstallPWA />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #14b8a6',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          },
          duration: 4000,
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <GameProvider>
        <WebSocketProvider>
          <AppRoutes />
        </WebSocketProvider>
      </GameProvider>
    </Router>
  );
};

export default App;
