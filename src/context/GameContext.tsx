import React, { createContext, useContext, useState } from 'react';

interface Player {
  name: string;
  id: string;
}

interface GameState {
  isAdmin: boolean;
  gameStarted: boolean;
  players: Player[];
  word: string | null;
  category: string | null;
  otherImposters: string[] | null;
  imposterCount: number;
  randomImposter: boolean;
}

interface GameInfo {
  playerName: string;
  roomId: string;
  playerId: string;
}

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  gameInfo: GameInfo;
  setGameInfo: React.Dispatch<React.SetStateAction<GameInfo>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    isAdmin: false,
    gameStarted: false,
    players: [],
    word: null,
    category: null,
    otherImposters: null,
    imposterCount: 1,
    randomImposter: false,
  });

  const [gameInfo, setGameInfo] = useState<GameInfo>({
    playerName: '',
    roomId: '',
    playerId: '',
  });

  return (
    <GameContext.Provider value={{ gameState, setGameState, gameInfo, setGameInfo }}>
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