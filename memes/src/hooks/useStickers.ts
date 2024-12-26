import { useState, useCallback } from 'react';

interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface StickerHandles {
  rotate: HTMLDivElement | null;
  scale: HTMLDivElement | null;
  delete: HTMLDivElement | null;
}

export const useStickers = () => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [handles, setHandles] = useState<StickerHandles>({
    rotate: null,
    scale: null,
    delete: null,
  });

  const addSticker = useCallback((emoji: string) => {
    const newSticker: Sticker = {
      id: `sticker-${Date.now()}`,
      emoji,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    };
    setStickers(prev => [...prev, newSticker]);
    return newSticker.id;
  }, []);

  const removeSticker = useCallback((id: string) => {
    setStickers(prev => prev.filter(s => s.id !== id));
    if (selectedSticker === id) {
      setSelectedSticker(null);
    }
  }, [selectedSticker]);

  const updateStickerPosition = useCallback((id: string, x: number, y: number) => {
    setStickers(prev => prev.map(sticker => 
      sticker.id === id ? { ...sticker, x, y } : sticker
    ));
  }, []);

  const updateStickerScale = useCallback((id: string, scale: number) => {
    setStickers(prev => prev.map(sticker =>
      sticker.id === id ? { ...sticker, scale: Math.max(0.1, scale) } : sticker
    ));
  }, []);

  const updateStickerRotation = useCallback((id: string, rotation: number) => {
    setStickers(prev => prev.map(sticker =>
      sticker.id === id ? { ...sticker, rotation } : sticker
    ));
  }, []);

  const selectSticker = useCallback((id: string | null) => {
    setSelectedSticker(id);
  }, []);

  const getSticker = useCallback((id: string) => {
    return stickers.find(s => s.id === id) || null;
  }, [stickers]);

  return {
    stickers,
    selectedSticker,
    handles,
    setHandles,
    addSticker,
    removeSticker,
    updateStickerPosition,
    updateStickerScale,
    updateStickerRotation,
    selectSticker,
    getSticker,
  };
};
