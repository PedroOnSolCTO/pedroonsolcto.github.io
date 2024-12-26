import { FC } from 'react';
import { useDrawing } from '../hooks/useDrawing';
import './DrawingTools.css';

export const DrawingTools: FC = () => {
  const { drawingState, setDrawingState, clearDrawing } = useDrawing();

  return (
    <div>
      <h2 className="control-heading">Drawing Tools</h2>
      <div className="control-group">
        <label className="switch">
          <input
            type="checkbox"
            checked={drawingState.isDrawMode}
            onChange={(e) => setDrawingState({ isDrawMode: e.target.checked })}
          />
          <span className="slider"></span>
        </label>
        <span>Drawing Mode</span>
      </div>
      <div className="control-group">
        <input
          type="color"
          value={drawingState.color}
          onChange={(e) => setDrawingState({ color: e.target.value })}
          title="Drawing Color"
        />
        <input
          type="range"
          value={drawingState.size}
          onChange={(e) => setDrawingState({ size: Number(e.target.value) })}
          min="1"
          max="50"
          title="Drawing Size"
        />
        <button onClick={clearDrawing} className="clear-draw-btn">
          Clear Drawing
        </button>
      </div>
    </div>
  );
};
