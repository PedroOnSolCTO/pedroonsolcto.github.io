import { FC } from 'react';
import { useImageCapture } from '../hooks/useImageCapture';
import { useGifHandling } from '../hooks/useGifHandling';
import './Download.css';

interface DownloadProps {
  previewCanvasRef: React.RefObject<HTMLCanvasElement>;
  memeCanvasRef: React.RefObject<HTMLCanvasElement>;
  drawCanvasRef: React.RefObject<HTMLCanvasElement>;
}

export const Download: FC<DownloadProps> = ({ previewCanvasRef, memeCanvasRef, drawCanvasRef }) => {
  const { captureMeme } = useImageCapture(previewCanvasRef, memeCanvasRef, drawCanvasRef);
  const { downloadAnimatedGif } = useGifHandling(previewCanvasRef, memeCanvasRef, drawCanvasRef);

  return (
    <div>
      <h2 className="control-heading">Capture</h2>
      <div className="actions">
        <button onClick={captureMeme} className="action-button">
          <span className="material-symbols-outlined">photo_camera</span>
          Capture PNG
        </button>
        <button onClick={downloadAnimatedGif} className="action-button">
          <span className="material-symbols-outlined">gif_box</span>
          Download GIF
        </button>
      </div>
    </div>
  );
};
