import { FC, useEffect, useRef } from 'react';
import { useDrawing } from '../hooks/useDrawing';
import { useTextOverlay } from '../hooks/useTextOverlay';
import { useStickers } from '../hooks/useStickers';
import { useGifHandling } from '../hooks/useGifHandling';
import { Sticker } from './Sticker';
import { Frames } from './Frames';
import { Download } from './Download';
import './Preview.css';
import { TrashCan } from './TrashCan';
import { DrawingIndicator } from './DrawingIndicator';

export const Preview: FC = () => {
  const { drawCanvasRef, drawingState, draw, startDrawing, stopDrawing } = useDrawing();
  const { textSettings, drawText } = useTextOverlay();
  const {
    stickers,
    selectedSticker,
    addSticker,
    removeSticker,
    updateStickerPosition,
    updateStickerScale,
    updateStickerRotation,
    selectSticker,
  } = useStickers();

  const memeCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    gifInfo,
    currentFrame,
    disabledFrames,
    currentFilter,
    handleGifLoad,
    toggleFrame,
    toggleAllFrames,
    setCurrentFilter,
    downloadAnimatedGif,
  } = useGifHandling(previewCanvasRef, memeCanvasRef, drawCanvasRef);

  // Effect to draw text whenever text settings change
  useEffect(() => {
    const ctx = memeCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw top and bottom text
    if (textSettings.topText) {
      drawText(textSettings.topText, 0.1, textSettings.fontSize, ctx);
    }
    if (textSettings.bottomText) {
      drawText(textSettings.bottomText, 0.9, textSettings.fontSize, ctx);
    }
  }, [textSettings, drawText]);

  // Effect to load default GIF
  useEffect(() => {
    fetch('pedro.gif')
      .then(response => response.arrayBuffer())
      .then(buffer => handleGifLoad(buffer))
      .catch(console.error);
  }, [handleGifLoad]);

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

  const handleGifUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const buffer = event.target?.result as ArrayBuffer;
      handleGifLoad(buffer);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="preview-area">
      <div
        ref={containerRef}
        className="meme-container"
        id="meme-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => selectSticker(null)}
      >
        <canvas ref={previewCanvasRef} id="preview-canvas"></canvas>
        <canvas ref={memeCanvasRef} id="meme-canvas"></canvas>
        <canvas
          ref={drawCanvasRef}
          id="drawCanvas"
          onMouseDown={e => startDrawing(e.nativeEvent)}
          onMouseMove={e => draw(e.nativeEvent)}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        ></canvas>
        <div className="stickers-container">
          {stickers.map(sticker => (
            <Sticker
              key={sticker.id}
              {...sticker}
              isSelected={selectedSticker === sticker.id}
              onSelect={selectSticker}
              onMove={updateStickerPosition}
              onScale={updateStickerScale}
              onRotate={updateStickerRotation}
              onDelete={removeSticker}
            />
          ))}
        </div>
      </div>
      {gifInfo && (
        <Frames
          frames={gifInfo.frames}
          currentFrame={currentFrame}
          disabledFrames={disabledFrames}
          onToggleFrame={toggleFrame}
          onToggleAll={toggleAllFrames}
        />
      )}
      <Download
        previewCanvasRef={previewCanvasRef}
        memeCanvasRef={memeCanvasRef}
        drawCanvasRef={drawCanvasRef}
      />
      <DrawingIndicator />
      <TrashCan />
    </div>
  );
};
