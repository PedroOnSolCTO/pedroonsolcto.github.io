import { FC } from 'react';
import './Download.css';

export const Download: FC = () => {
  return (
    <div>
      <h2 className="control-heading">Capture</h2>
      <div className="actions">
        <button id="capture-btn" className="action-button">
          <span className="material-symbols-outlined">photo_camera</span>
          Capture Meme
        </button>
        <button id="download-gif-btn" className="action-button">
          <span className="material-symbols-outlined">gif_box</span>
          Download GIF
        </button>
      </div>
    </div>
  );
};
