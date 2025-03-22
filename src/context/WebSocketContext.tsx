import { createContext, useContext, useCallback, useRef, useState, useEffect } from 'react';
import { useGame } from './GameContext';
import toast from 'react-hot-toast';

interface WebSocketContextType {
  connect: (roomId: string, playerName: string) => Promise<void>;
  sendMessage: (message: any) => void;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  // Get game context
  const { setGameState, setGameInfo } = useGame();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async (roomId: string, playerName: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        // Close existing connection if any
        if (wsRef.current) {
          wsRef.current.close();
        }
        
        // Create new connection
        wsRef.current = new WebSocket(WS_URL);

        const connectionTimeout = setTimeout(() => {
          if (wsRef.current?.readyState !== WebSocket.OPEN) {
            toast.error('Connection timeout. Server might be down.');
            setIsConnected(false);
            reject(new Error('Connection timeout'));
          }
        }, 5000);

        wsRef.current.onopen = () => {
          clearTimeout(connectionTimeout);
          setIsConnected(true);
          wsRef.current?.send(JSON.stringify({ type: 'join', roomId, playerName }));
          resolve();
        };

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case 'joined':
              setGameState((prev) => ({
                ...prev,
                isAdmin: data.isAdmin,
                showCategories: true,
                isImposter: false
              }));
              setGameInfo((prev) => ({ ...prev, playerId: data.playerId }));
              toast.success('Connected to game room!');
              break;

            case 'playerCount':
              setGameState((prev) => ({
                ...prev,
                players: data.players,
                showCategories: true
              }));
              break;

            case 'gameStart':
              setGameState((prev) => ({
                ...prev,
                gameStarted: true,
                word: data.word,
                category: data.category,
                otherImposters: data.imposters,
                isImposter: !data.word,
                showCategories: true
              }));
              break;

            case 'imposterCountUpdated':
              setGameState((prev) => ({
                ...prev,
                imposterCount: data.count,
              }));
              toast.success('Imposter count updated');
              break;

            case 'adminUpdate':
              setGameState((prev) => ({
                ...prev,
                isAdmin: data.isAdmin,
                showCategories: true
              }));
              if (data.isAdmin) {
                toast.success('You are now the admin');
              }
              break;

            case 'kicked':
              toast.error('You have been kicked from the game');
              window.location.href = '/';
              break;

            case 'emote':
              setGameState((prev) => ({
                ...prev,
                players: prev.players.map(player =>
                  player.id === data.playerId
                    ? { ...player, emote: data.emoteName }
                    : player
                )
              }));
              toast(`${data.playerName} used ${data.emoteName} emote`);
              break;

            case 'error':
              toast.error(data.message);
              break;
          }
        };

        wsRef.current.onerror = () => {
          toast.error('Connection error. Please try again.');
          setIsConnected(false);
          reject(new Error('WebSocket connection failed'));
        };

        wsRef.current.onclose = () => {
          toast.error('Connection closed. Please refresh the page.');
          setIsConnected(false);
        };
      } catch (error) {
        setIsConnected(false);
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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ connect, sendMessage, isConnected }}>
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
