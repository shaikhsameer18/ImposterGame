import React, { createContext, useContext, useCallback, useRef } from 'react';
import { useGame } from './GameContext';
import toast from 'react-hot-toast';

interface WebSocketContextType {
  connect: (roomId: string, playerName: string) => Promise<void>;
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setGameState, setGameInfo } = useGame();
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(async (roomId: string, playerName: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        wsRef.current = new WebSocket(WS_URL);

        const connectionTimeout = setTimeout(() => {
          if (wsRef.current?.readyState !== WebSocket.OPEN) {
            toast.error('Connection timeout. Server might be down.');
            reject(new Error('Connection timeout'));
          }
        }, 5000);

        wsRef.current.onopen = () => {
          clearTimeout(connectionTimeout);
          wsRef.current?.send(JSON.stringify({ type: 'join', roomId, playerName }));
          resolve();
        };

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'joined':
              setGameState((prev) => ({ ...prev, isAdmin: data.isAdmin }));
              setGameInfo((prev) => ({ ...prev, playerId: data.playerId }));
              toast.success('Connected to game room!');
              break;

            case 'playerCount':
              setGameState((prev) => ({ ...prev, players: data.players }));
              break;

            case 'gameStart':
              setGameState((prev) => ({
                ...prev,
                gameStarted: true,
                word: data.word,
                category: data.category,
                otherImposters: data.imposters,
              }));
              break;

            case 'imposterCountUpdated':
              setGameState((prev) => ({
                ...prev,
                imposterCount: data.count,
              }));
              toast.success('Imposter count updated');
              break;

            case 'kicked':
              toast.error('You have been kicked from the game');
              window.location.href = '/';
              break;

            case 'error':
              toast.error(data.message);
              break;
          }
        };

        wsRef.current.onerror = () => {
          toast.error('Connection error. Please try again.');
          reject(new Error('WebSocket connection failed'));
        };

        wsRef.current.onclose = () => {
          toast.error('Connection closed. Please refresh the page.');
        };
      } catch (error) {
        reject(error);
      }
    });
  }, [setGameState, setGameInfo]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      toast.error('Not connected to server');
    }
  }, []);

  return (
    <WebSocketContext.Provider value={{ connect, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
