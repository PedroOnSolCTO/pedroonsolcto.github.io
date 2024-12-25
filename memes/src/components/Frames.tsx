import { FC } from 'react';
import './Frames.css';

export const Frames: FC = () => {
  return (
    <div className="frames">
      <div className="frames-header">
        <h2>Frames</h2>
        <div className="toggle-all-container">
          <span>Toggle All</span>
          <label className="frame-toggle">
            <input
              type="checkbox"
              id="toggle-all-frames"
              defaultChecked
              aria-label="Toggle All Frames"
            />
            <span className="frame-toggle-slider"></span>
          </label>
        </div>
      </div>
      <div className="frames-grid" id="frames-grid"></div>
    </div>
  );
};
