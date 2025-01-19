import { FC, useRef, useEffect, MouseEvent } from 'react';
import './Sticker.css';

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
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const initialRotation = useRef(rotation);
  const initialScale = useRef(scale);

  const handleMouseDown = (e: MouseEvent) => {
    if (!stickerRef.current) return;
    
    isDragging.current = true;
    startPos.current = {
      x: e.clientX - x,
      y: e.clientY - y,
    };
    
    onSelect(id);
    e.stopPropagation();
  };

  useEffect(() => {
    if (!isSelected) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging.current) return;

      const newX = e.clientX - startPos.current.x;
      const newY = e.clientY - startPos.current.y;
      onMove(id, newX, newY);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, isSelected, onMove]);

  const handleRotate = (e: MouseEvent) => {
    e.stopPropagation();
    if (!stickerRef.current) return;

    const rect = stickerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const getAngle = (x: number, y: number) => {
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    };

    const startAngle = getAngle(e.clientX, e.clientY);
    initialRotation.current = rotation;

    const handleRotateMove = (moveEvent: globalThis.MouseEvent) => {
      const currentAngle = getAngle(moveEvent.clientX, moveEvent.clientY);
      const deltaAngle = currentAngle - startAngle;
      const newRotation = initialRotation.current + deltaAngle;
      onRotate(id, newRotation);
    };

    const cleanup = () => {
      document.removeEventListener('mousemove', handleRotateMove);
      document.removeEventListener('mouseup', cleanup);
    };

    document.addEventListener('mousemove', handleRotateMove);
    document.addEventListener('mouseup', cleanup);
  };

  const handleScale = (e: MouseEvent, corner: 'tl' | 'tr' | 'bl' | 'br') => {
    e.stopPropagation();
    if (!stickerRef.current) return;

    const rect = stickerRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = rect.width;
    const startHeight = rect.height;
    initialScale.current = scale;

    const handleScaleMove = (moveEvent: globalThis.MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let scaleFactor;
      switch(corner) {
        case 'tr':
        case 'bl':
          scaleFactor = (startWidth + deltaX - deltaY) / (2 * startWidth);
          break;
        case 'tl':
        case 'br':
          scaleFactor = (startWidth + (corner === 'br' ? deltaX : -deltaX)) / startWidth;
          break;
      }
      
      const newScale = Math.max(0.2, Math.min(3, initialScale.current * (1 + scaleFactor)));
      onScale(id, newScale);
    };

    const cleanup = () => {
      document.removeEventListener('mousemove', handleScaleMove);
      document.removeEventListener('mouseup', cleanup);
    };

    document.addEventListener('mousemove', handleScaleMove);
    document.addEventListener('mouseup', cleanup);
  };

  return (
    <div
      ref={stickerRef}
      className={`sticker ${isSelected ? 'selected' : ''}`}
      style={{
        transform: `translate(${x}%, ${y}%) scale(${scale}) rotate(${rotation}deg)`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="sticker-content">{emoji}</div>
      {isSelected && (
        <div className="sticker-controls">
          <div 
            className="handle rotate"
            onMouseDown={handleRotate}
          />
          <div 
            className="handle tl"
            onMouseDown={(e) => handleScale(e, 'tl')}
          />
          <div 
            className="handle tr"
            onMouseDown={(e) => handleScale(e, 'tr')}
          />
          <div 
            className="handle bl"
            onMouseDown={(e) => handleScale(e, 'bl')}
          />
          <div 
            className="handle br"
            onMouseDown={(e) => handleScale(e, 'br')}
          />
          <div 
            className="handle delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          />
        </div>
      )}
    </div>
  );
};
