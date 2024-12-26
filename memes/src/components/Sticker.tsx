import { FC, useEffect, useRef, useCallback } from 'react';

interface StickerProps {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onScale: (id: string, scale: number) => void;
  onRotate: (id: string, rotation: number) => void;
  onDelete: (id: string) => void;
}

export const Sticker: FC<StickerProps> = ({
  id,
  emoji,
  x,
  y,
  scale,
  rotation,
  isSelected,
  onSelect,
  onMove,
  onScale,
  onRotate,
  onDelete,
}) => {
  const stickerRef = useRef<HTMLDivElement>(null);
  const initialX = useRef<number>(0);
  const initialY = useRef<number>(0);
  const initialScale = useRef<number>(1);
  const initialRotation = useRef<number>(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(id);
    },
    [id, onSelect]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      if (!stickerRef.current) return;

      const rect = stickerRef.current.getBoundingClientRect();
      initialX.current = e.clientX - rect.left;
      initialY.current = e.clientY - rect.top;

      e.dataTransfer.setData('text/plain', id);
      e.dataTransfer.effectAllowed = 'move';
    },
    [id]
  );

  const style = {
    position: 'absolute' as const,
    left: `${x}%`,
    top: `${y}%`,
    transform: `scale(${scale}) rotate(${rotation}deg)`,
    cursor: 'move',
    userSelect: 'none' as const,
    fontSize: '2em',
  };

  return (
    <div
      ref={stickerRef}
      className={`sticker ${isSelected ? 'selected' : ''}`}
      style={style}
      onClick={handleMouseDown}
      draggable
      onDragStart={handleDragStart}
    >
      {emoji}
      {isSelected && (
        <>
          <div
            className="handle rotate-handle"
            onMouseDown={e => {
              e.stopPropagation();
              initialRotation.current = rotation;
            }}
          >
            ↻
          </div>
          <div
            className="handle scale-handle"
            onMouseDown={e => {
              e.stopPropagation();
              initialScale.current = scale;
            }}
          >
            ⤡
          </div>
          <div
            className="handle delete-handle"
            onClick={e => {
              e.stopPropagation();
              onDelete(id);
            }}
          >
            ×
          </div>
        </>
      )}
    </div>
  );
};
