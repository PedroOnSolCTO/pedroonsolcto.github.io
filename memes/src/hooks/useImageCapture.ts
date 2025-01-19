import { useCallback } from 'react';
import html2canvas from 'html2canvas';

export const useImageCapture = (
  previewCanvasRef: React.RefObject<HTMLCanvasElement>,
  memeCanvasRef: React.RefObject<HTMLCanvasElement>,
  drawCanvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const captureMeme = useCallback(async () => {
    if (!previewCanvasRef.current || !memeCanvasRef.current || !drawCanvasRef.current) return;

    // Create a temporary canvas at the GIF dimensions
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 360;
    tempCanvas.height = 360;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Scale for GIF dimensions
    const scale = 360 / previewCanvasRef.current.width;

    // Draw the current frame with filter
    tempCtx.save();
    tempCtx.scale(scale, scale);
    tempCtx.drawImage(previewCanvasRef.current, 0, 0);
    tempCtx.restore();

    // Draw the meme canvas (text overlay)
    tempCtx.save();
    tempCtx.scale(scale, scale);
    tempCtx.drawImage(memeCanvasRef.current, 0, 0);
    tempCtx.restore();

    // Draw the drawing canvas
    tempCtx.save();
    tempCtx.scale(scale, scale);
    tempCtx.drawImage(drawCanvasRef.current, 0, 0);
    tempCtx.restore();

    // Get the stickers container
    const stickersContainer = previewCanvasRef.current.parentElement?.querySelector('.stickers-container');
    if (stickersContainer) {
      // Use html2canvas to capture the stickers
      const overlayCanvas = await html2canvas(stickersContainer as HTMLElement, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // Draw the stickers overlay
      tempCtx.save();
      tempCtx.scale(scale, scale);
      tempCtx.drawImage(overlayCanvas, 0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
      tempCtx.restore();
    }

    // Add watermark
    tempCtx.save();
    tempCtx.font = '16px Arial';
    tempCtx.textAlign = 'right';
    tempCtx.textBaseline = 'bottom';
    // Add stroke
    tempCtx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    tempCtx.lineWidth = 3;
    tempCtx.strokeText('$PEDRO', tempCanvas.width - 20, tempCanvas.height - 10);
    // Add fill
    tempCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    tempCtx.fillText('$PEDRO', tempCanvas.width - 20, tempCanvas.height - 10);
    tempCtx.restore();

    // Create download link
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  }, [previewCanvasRef, memeCanvasRef, drawCanvasRef]);

  return {
    captureMeme,
  };
};
