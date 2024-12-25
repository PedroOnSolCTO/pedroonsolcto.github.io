import { FC } from 'react';

export const DrawingTools: FC = () => {
  return (
    <div>
      <h2 className="control-heading">Drawing Tools</h2>
      <div className="drawing-controls">
        <label className="switch">
          <input type="checkbox" id="draw-mode-toggle" aria-label="Toggle Drawing Mode" />
          <span className="slider"></span>
        </label>
        <span>Drawing Mode</span>
      </div>
      <div className="control-group">
        <label>Draw Color</label>
        <input type="color" id="draw-color" value="#00cc00" aria-label="Draw Color" />
      </div>
      <div className="control-group">
        <label>Draw Size</label>
        <input type="range" id="draw-size" min="1" max="50" value="10" step="1" />
      </div>
      <div className="actions">
        <button id="clear-draw" className="action-button action-button--compact">
          <span className="material-symbols-outlined">delete</span>
          Clear Doodles
        </button>
      </div>
    </div>
  );
};
