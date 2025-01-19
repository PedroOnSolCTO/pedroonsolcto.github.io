import { useRef, useState, useCallback } from 'react';

interface DrawingState {
  isDrawMode: boolean;
  isDrawing: boolean;
  lastX: number;
  lastY: number;
  color: string;
  size: number;
}

export const useDrawing = () => {
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawMode: false,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    color: '#000000',
    size: 5,
  });

  const startDrawing = useCallback((e: MouseEvent) => {
    if (!drawingState.isDrawMode || !drawCanvasRef.current) return;

    const rect = drawCanvasRef.current.getBoundingClientRect();
    const scaleX = drawCanvasRef.current.width / rect.width;
    const scaleY = drawCanvasRef.current.height / rect.height;

    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      lastX: ((e.clientX - rect.left) * scaleX) / scaleX,
      lastY: ((e.clientY - rect.top) * scaleY) / scaleY,
    }));
  }, [drawingState.isDrawMode]);

  const stopDrawing = useCallback(() => {
    setDrawingState(prev => ({ ...prev, isDrawing: false }));
  }, []);

  const draw = useCallback((e: MouseEvent) => {
    if (!drawingState.isDrawing || !drawingState.isDrawMode || !drawCanvasRef.current) return;

    const ctx = drawCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const rect = drawCanvasRef.current.getBoundingClientRect();
    const scaleX = drawCanvasRef.current.width / rect.width;
    const scaleY = drawCanvasRef.current.height / rect.height;

    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = drawingState.color;
    ctx.lineWidth = drawingState.size;

    ctx.moveTo(drawingState.lastX * scaleX, drawingState.lastY * scaleY);
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    ctx.lineTo(x, y);
    ctx.stroke();

    setDrawingState(prev => ({
      ...prev,
      lastX: x / scaleX,
      lastY: y / scaleY,
    }));
  }, [drawingState]);

  const clearDrawing = useCallback(() => {
    const ctx = drawCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }, []);

  return {
    drawCanvasRef,
    drawingState,
    setDrawingState,
    startDrawing,
    stopDrawing,
    draw,
    clearDrawing,
  };
};
