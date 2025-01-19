import { useState, useEffect, useCallback, useRef, MutableRefObject } from 'react';
import GIF from 'gif.js';
import { GifReader } from 'omggif';

interface Frame {
  imageData: ImageData;
  delay: number;
}

interface GifInfo {
  frames: Frame[];
  width: number;
  height: number;
}

export const useGifHandling = (
  previewCanvasRef: MutableRefObject<HTMLCanvasElement | null>,
  memeCanvasRef: MutableRefObject<HTMLCanvasElement | null>,
  drawCanvasRef: MutableRefObject<HTMLCanvasElement | null>
) => {
  const [gifInfo, setGifInfo] = useState<GifInfo | null>(null);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [disabledFrames, setDisabledFrames] = useState<Record<number, boolean>>({});
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFilter, setCurrentFilter] = useState<string>('none');
  const animationRef = useRef<number>();
  const workerBlobRef = useRef<Blob | null>(null);

  // Initialize worker blob
  useEffect(() => {
    const initWorkerBlob = async () => {
      try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/gif.js/dist/gif.worker.js');
        if (!response.ok) throw new Error('Network response was not OK');
        workerBlobRef.current = await response.blob();
      } catch (error) {
        console.error('Error loading GIF worker:', error);
      }
    };
    initWorkerBlob();
  }, []);

  const applyFilter = useCallback((imageData: ImageData, filterType: string) => {
    const { data } = imageData;
    const newImageData = new ImageData(
      new Uint8ClampedArray(data),
      imageData.width,
      imageData.height
    );

    switch (filterType) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          newImageData.data[i] = avg;
          newImageData.data[i + 1] = avg;
          newImageData.data[i + 2] = avg;
        }
        break;
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          newImageData.data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          newImageData.data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          newImageData.data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
        break;
      case 'invert':
        for (let i = 0; i < data.length; i += 4) {
          newImageData.data[i] = 255 - data[i];
          newImageData.data[i + 1] = 255 - data[i + 1];
          newImageData.data[i + 2] = 255 - data[i + 2];
        }
        break;
      case 'dreamy':
        for (let i = 0; i < data.length; i += 4) {
          newImageData.data[i] = Math.min(255, data[i] * 1.1);
          newImageData.data[i + 1] = Math.min(255, data[i + 1] * 1.1);
          newImageData.data[i + 2] = Math.min(255, data[i + 2] * 1.1);
        }
        break;
      case 'cartoon':
        for (let i = 0; i < data.length; i += 4) {
          newImageData.data[i] = Math.min(255, data[i] * 2);
          newImageData.data[i + 1] = Math.min(255, data[i + 1] * 1.5);
          newImageData.data[i + 2] = Math.min(255, data[i + 2] * 1.5);
        }
        break;
      case 'crunchy':
        for (let i = 0; i < data.length; i += 4) {
          newImageData.data[i] = Math.min(255, data[i] * 3);
          newImageData.data[i + 1] = Math.min(255, data[i + 1] * 3);
          newImageData.data[i + 2] = Math.min(255, data[i + 2] * 3);
        }
        break;
      case 'hue-rotate':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] / 255;
          const g = data[i + 1] / 255;
          const b = data[i + 2] / 255;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          let h = 0;
          let s = 0;
          const l = (max + min) / 2;

          if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
              case g:
                h = (b - r) / d + 2;
                break;
              case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
          }

          // Rotate hue by 180 degrees
          h = (h + 0.5) % 1;

          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;

          newImageData.data[i] = hue2rgb(p, q, h + 1 / 3) * 255;
          newImageData.data[i + 1] = hue2rgb(p, q, h) * 255;
          newImageData.data[i + 2] = hue2rgb(p, q, h - 1 / 3) * 255;
        }
        break;
    }
    return newImageData;
  }, []);

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const adjustContainerSize = useCallback(() => {
    if (!previewCanvasRef.current || !gifInfo) return;

    const container = previewCanvasRef.current.parentElement;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const imageRatio = gifInfo.width / gifInfo.height;
    const containerRatio = containerWidth / containerHeight;

    let width, height;
    if (containerRatio > imageRatio) {
      height = containerHeight;
      width = height * imageRatio;
    } else {
      width = containerWidth;
      height = width / imageRatio;
    }

    previewCanvasRef.current.style.width = `${width}px`;
    previewCanvasRef.current.style.height = `${height}px`;
    memeCanvasRef.current!.style.width = `${width}px`;
    memeCanvasRef.current!.style.height = `${height}px`;
    drawCanvasRef.current!.style.width = `${width}px`;
    drawCanvasRef.current!.style.height = `${height}px`;
  }, [gifInfo]);

  useEffect(() => {
    window.addEventListener('resize', adjustContainerSize);
    return () => window.removeEventListener('resize', adjustContainerSize);
  }, [adjustContainerSize]);

  const handleGifLoad = useCallback(async (buffer: ArrayBuffer) => {
    if (!previewCanvasRef.current) return;

    try {
      // Create a GIF reader
      const reader = new GifReader(new Uint8Array(buffer));
      const frames: Frame[] = [];
      const width = reader.width;
      const height = reader.height;

      // Create a temporary canvas for frame extraction
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d')!;
      const imageData = tempCtx.createImageData(width, height);

      // Extract each frame
      for (let i = 0; i < reader.numFrames(); i++) {
        reader.decodeAndBlitFrameRGBA(i, imageData.data);
        frames.push({
          imageData: new ImageData(new Uint8ClampedArray(imageData.data), width, height),
          delay: reader.frameInfo(i).delay * 10, // Convert to milliseconds
        });
      }

      // Update canvas dimensions
      previewCanvasRef.current.width = width;
      previewCanvasRef.current.height = height;
      memeCanvasRef.current!.width = width;
      memeCanvasRef.current!.height = height;
      drawCanvasRef.current!.width = width;
      drawCanvasRef.current!.height = height;

      // Set GIF info
      setGifInfo({ frames, width, height });
      setCurrentFrame(0);
      setIsPlaying(true);
      adjustContainerSize();
    } catch (error) {
      console.error('Error loading GIF:', error);
    }
  }, [adjustContainerSize]);

  // Animation loop
  useEffect(() => {
    if (!gifInfo || !isPlaying) return;

    let lastFrameTime = performance.now();
    let frameIndex = currentFrame;

    const animate = (currentTime: number) => {
      if (!gifInfo) return;

      const deltaTime = currentTime - lastFrameTime;
      const frame = gifInfo.frames[frameIndex];

      if (deltaTime >= frame.delay) {
        // Find next enabled frame
        do {
          frameIndex = (frameIndex + 1) % gifInfo.frames.length;
        } while (disabledFrames[frameIndex] && frameIndex !== currentFrame);

        if (!disabledFrames[frameIndex]) {
          setCurrentFrame(frameIndex);
          lastFrameTime = currentTime;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gifInfo, isPlaying, currentFrame, disabledFrames]);

  // Update canvas when frame changes
  useEffect(() => {
    if (!gifInfo || !previewCanvasRef.current) return;

    const ctx = previewCanvasRef.current.getContext('2d')!;
    const frame = gifInfo.frames[currentFrame];
    
    // Apply the current frame
    const filteredImageData = currentFilter === 'none' 
      ? frame.imageData 
      : applyFilter(frame.imageData, currentFilter);
    
    ctx.putImageData(filteredImageData, 0, 0);
  }, [gifInfo, currentFrame, currentFilter, applyFilter]);

  const toggleFrame = useCallback((frameIndex: number) => {
    setDisabledFrames(prev => ({
      ...prev,
      [frameIndex]: !prev[frameIndex],
    }));
  }, []);

  const toggleAllFrames = useCallback((enabled: boolean) => {
    if (!gifInfo) return;

    const newDisabledFrames: Record<number, boolean> = {};
    for (let i = 0; i < gifInfo.frames.length; i++) {
      newDisabledFrames[i] = !enabled;
    }
    setDisabledFrames(newDisabledFrames);
  }, [gifInfo]);

  const downloadAnimatedGif = useCallback(async () => {
    if (!gifInfo || !workerBlobRef.current) return;

    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: gifInfo.width,
      height: gifInfo.height,
      workerScript: URL.createObjectURL(workerBlobRef.current),
    });

    // Create a temporary canvas for combining layers
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = gifInfo.width;
    tempCanvas.height = gifInfo.height;
    const tempCtx = tempCanvas.getContext('2d')!;

    // Add each frame
    for (let i = 0; i < gifInfo.frames.length; i++) {
      if (disabledFrames[i]) continue;

      // Clear the temporary canvas
      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

      // Draw the frame with filter
      const frameImageData = currentFilter === 'none'
        ? gifInfo.frames[i].imageData
        : applyFilter(gifInfo.frames[i].imageData, currentFilter);
      tempCtx.putImageData(frameImageData, 0, 0);

      // Draw the meme canvas (text overlay)
      if (memeCanvasRef.current) {
        tempCtx.drawImage(memeCanvasRef.current, 0, 0);
      }

      // Draw the drawing canvas
      if (drawCanvasRef.current) {
        tempCtx.drawImage(drawCanvasRef.current, 0, 0);
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

      // Add the frame to the GIF
      gif.addFrame(tempCanvas, { delay: gifInfo.frames[i].delay });
    }

    // Render the GIF
    gif.on('finished', (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'meme.gif';
      link.click();
      URL.revokeObjectURL(url);
    });

    gif.render();
  }, [gifInfo, currentFilter, disabledFrames, applyFilter]);

  return {
    gifInfo,
    currentFrame,
    disabledFrames,
    currentFilter,
    handleGifLoad,
    toggleFrame,
    toggleAllFrames,
    setCurrentFilter,
    setIsPlaying,
    downloadAnimatedGif,
    adjustContainerSize,
  };
};
