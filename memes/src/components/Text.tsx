import { FC, useRef, useEffect, MouseEvent } from 'react';
import './Text.css';

interface TextProps {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  onChange: (id: string, text: string) => void;
}

export const Text: FC<TextProps> = ({
  id,
  text,
  x,
  y,
  fontSize,
  fontFamily,
  color,
  bold,
  italic,
  underline,
  isSelected,
  onSelect,
  onMove,
  onDelete,
  onChange,
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    if (!textRef.current) return;
    
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

  const handleDoubleClick = () => {
    if (!textRef.current) return;
    textRef.current.contentEditable = 'true';
    textRef.current.focus();
  };

  const handleBlur = () => {
    if (!textRef.current) return;
    textRef.current.contentEditable = 'false';
    onChange(id, textRef.current.textContent || '');
  };

  return (
    <div
      ref={textRef}
      className={`text-object ${isSelected ? 'selected' : ''}`}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        fontSize: `${fontSize}px`,
        fontFamily,
        color,
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: underline ? 'underline' : 'none',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
    >
      {text}
      {isSelected && (
        <div className="text-controls">
          <div 
            className="handle delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
          />
          <div className="handle tl" />
          <div className="handle tr" />
          <div className="handle bl" />
          <div className="handle br" />
        </div>
      )}
    </div>
  );
};
