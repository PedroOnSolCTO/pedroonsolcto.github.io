import { FC, useEffect, useRef } from 'react';
import { useStickersContext } from '../contexts/StickersContext';
import { useTemplate } from '../contexts/TemplateContext';
import { useTextContext } from '../contexts/TextContext';
import { useDrawing } from '../hooks/useDrawing';
import { useGifHandling } from '../hooks/useGifHandling';
import { DrawingIndicator } from './DrawingIndicator';
import './Preview.css';
import { Sticker } from './Sticker';
import { Text } from './Text';

export const Preview: FC = () => {
  const { selectedTemplateImage } = useTemplate();
  const {
    stickers,
    selectedSticker,
    updateStickerPosition,
    updateStickerScale,
    updateStickerRotation,
    removeSticker,
    selectSticker,
  } = useStickersContext();

  const { texts, selectedText, updateText, removeText, selectText } = useTextContext();

  const memeCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { startDrawing, draw, stopDrawing, drawingState } = useDrawing(drawCanvasRef);
  const { gifInfo, currentFrame, disabledFrames, toggleFrame, toggleAllFrames } = useGifHandling();

  // Load template image when it changes
  useEffect(() => {
    if (!selectedTemplateImage) return;

    const previewCanvas = previewCanvasRef.current;
    if (!previewCanvas) return;

    const ctx = previewCanvas.getContext('2d');
    if (!ctx) return;

    // Create new image and set up handlers before setting src
    const img = new Image();
    let isCurrentImage = true; // Track if this is still the current image

    img.onload = () => {
      // Check if this is still the current image
      if (!isCurrentImage) return;

      // Calculate dimensions while preserving aspect ratio
      const maxWidth = 800; // Maximum canvas width
      const maxHeight = 600; // Maximum canvas height
      let targetWidth = img.width;
      let targetHeight = img.height;

      // Scale down if image is too large
      if (img.width > maxWidth || img.height > maxHeight) {
        const widthRatio = maxWidth / img.width;
        const heightRatio = maxHeight / img.height;
        const scale = Math.min(widthRatio, heightRatio);
        targetWidth = Math.round(img.width * scale);
        targetHeight = Math.round(img.height * scale);
      }

      // Set minimum size
      targetWidth = Math.max(targetWidth, 400);
      targetHeight = Math.max(targetHeight, 300);

      // Clear and resize all canvases
      const canvases = [previewCanvas, memeCanvasRef.current, drawCanvasRef.current].filter(
        Boolean
      );

      canvases.forEach(canvas => {
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        // Set size
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Set rendering quality
        canvasCtx.imageSmoothingEnabled = true;
        canvasCtx.imageSmoothingQuality = 'high';

        // Clear canvas
        canvasCtx.clearRect(0, 0, targetWidth, targetHeight);
      });

      // Draw image on preview canvas
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Update container size to match canvas
      if (containerRef.current) {
        containerRef.current.style.width = `${targetWidth}px`;
        containerRef.current.style.height = `${targetHeight}px`;
      }
    };

    img.onerror = error => {
      if (!isCurrentImage) return;
      console.error('Failed to load template image:', error);
    };

    img.src = selectedTemplateImage;

    // Clean up function
    return () => {
      isCurrentImage = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [selectedTemplateImage]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const stickerId = e.dataTransfer.getData('text/plain');
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    updateStickerPosition(stickerId, x, y);
  };

  return (
    <div
      className="preview-area"
      onClick={() => {
        selectSticker(null);
        selectText(null);
      }}
    >
      <div ref={containerRef} className="meme-container">
        <canvas ref={previewCanvasRef} id="preview-canvas" />
        <canvas ref={memeCanvasRef} id="meme-canvas" />
        <canvas
          ref={drawCanvasRef}
          id="drawCanvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />

        <div className="stickers-container" onClick={e => e.stopPropagation()}>
          {stickers.map(sticker => (
            <Sticker
              key={sticker.id}
              id={sticker.id}
              emoji={sticker.emoji}
              x={sticker.x}
              y={sticker.y}
              scale={sticker.scale}
              rotation={sticker.rotation}
              isSelected={selectedSticker === sticker.id}
              onSelect={selectSticker}
              onMove={updateStickerPosition}
              onScale={updateStickerScale}
              onRotate={updateStickerRotation}
              onDelete={removeSticker}
            />
          ))}
        </div>

        <div className="text-container" onClick={e => e.stopPropagation()}>
          {texts.map(text => (
            <Text
              key={text.id}
              {...text}
              isSelected={selectedText === text.id}
              onSelect={selectText}
              onMove={(id, x, y) => updateText(id, { x, y })}
              onDelete={removeText}
              onChange={(id, newText) => updateText(id, { text: newText })}
            />
          ))}
        </div>

        {drawingState.isDrawing && <DrawingIndicator />}
      </div>
    </div>
  );
};
