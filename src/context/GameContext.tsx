import { createContext, useContext, useState } from 'react';

interface Player {
  id: string;
  name: string;
  emote?: string;
}

interface GameState {
  players: Player[];
  gameStarted: boolean;
  isAdmin: boolean;
  isImposter: boolean;
  word: string;
  category: string;
  imposterCount: number;
  randomImposter: boolean;
  showCategories: boolean;
  otherImposters: string[];
}

interface GameInfo {
  playerName: string;
  roomId: string;
  playerId: string;
}

type GameContextType = {
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
  gameInfo: GameInfo;
  setGameInfo: (info: GameInfo | ((prev: GameInfo) => GameInfo)) => void;
  resetGame: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    gameStarted: false,
    isAdmin: false,
    isImposter: false,
    word: '',
    category: '',
    imposterCount: 1,
    randomImposter: true,
    showCategories: true,
    otherImposters: [],
  });

  const [gameInfo, setGameInfo] = useState<GameInfo>({
    playerName: '',
    roomId: '',
    playerId: '',
  });

  // Reset game state to defaults
  const resetGame = () => {
    setGameState({
      players: [],
      gameStarted: false,
      isAdmin: false,
      isImposter: false,
      word: '',
      category: '',
      imposterCount: 1,
      randomImposter: true,
      showCategories: true,
      otherImposters: [],
    });
    
    setGameInfo({
      playerName: '',
      roomId: '',
      playerId: '',
    });
  };

  return (
    <GameContext.Provider value={{ gameState, setGameState, gameInfo, setGameInfo, resetGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

