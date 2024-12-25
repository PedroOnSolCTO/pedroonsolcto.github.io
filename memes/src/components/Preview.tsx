import { FC } from 'react';
import './Preview.css';
import { TrashCan } from './TrashCan';
import { DrawingIndicator } from './DrawingIndicator';

export const Preview: FC = () => {
  return (
    <div className="preview-area">
      <div className="meme-container" id="meme-container">
        <canvas id="preview-canvas"></canvas>
        <canvas id="meme-canvas"></canvas>
        <canvas id="drawCanvas"></canvas>
        <div className="stickers-container" id="stickersContainer"></div>
        <div className="text-overlay" id="top-text-overlay"></div>
        <div className="text-overlay" id="bottom-text-overlay"></div>
      </div>
      <DrawingIndicator />
      <TrashCan />
    </div>
  );
};
