import React, { createContext, useContext, FC, ReactNode } from 'react';
import { useStickers, Sticker } from '../hooks/useStickers';

interface StickersContextType {
  stickers: Sticker[];
  selectedSticker: string | null;
  addSticker: (emoji: string) => void;
  removeSticker: (id: string) => void;
  updateStickerPosition: (id: string, x: number, y: number) => void;
  updateStickerScale: (id: string, scale: number) => void;
  updateStickerRotation: (id: string, rotation: number) => void;
  selectSticker: (id: string | null) => void;
}

const StickersContext = createContext<StickersContextType | null>(null);

export const useStickersContext = () => {
  const context = useContext(StickersContext);
  if (!context) {
    throw new Error('useStickersContext must be used within a StickersProvider');
  }
  return context;
};

interface StickersProviderProps {
  children: ReactNode;
}

export const StickersProvider: FC<StickersProviderProps> = ({ children }) => {
  const stickersState = useStickers();

  return (
    <StickersContext.Provider value={stickersState}>
      {children}
    </StickersContext.Provider>
  );
};
