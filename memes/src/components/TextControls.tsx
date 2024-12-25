import { FC } from 'react';
import './TextControls.css';

export const TextControls: FC = () => {
  return (
    <div>
      <h2 className="control-heading">Text Settings</h2>
      <div className="control-group">
        <label htmlFor="top-text">Top Text</label>
        <input type="text" id="top-text" />
      </div>
      <div className="control-group">
        <label htmlFor="bottom-text">Bottom Text</label>
        <input type="text" id="bottom-text" />
      </div>
      <div className="control-group">
        <label>Font Family</label>
        <select id="font-family" defaultValue="Impact">
          <option value="Impact">Impact</option>
          <option value="Arial Black">Arial Black</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
        </select>
      </div>
      <div className="control-group">
        <label htmlFor="font-size">Font Size</label>
        <input
          type="range"
          id="font-size"
          defaultValue="2"
          step="0.25"
          min="1"
          max="5"
          aria-label="Font Size"
        />
      </div>
      <div className="control-group">
        <label htmlFor="text-fill-color">Text Fill Color</label>
        <input type="color" id="text-fill-color" defaultValue="#ffffff" />
      </div>
      <div className="control-group">
        <label htmlFor="text-stroke-color">Text Stroke Color</label>
        <input type="color" id="text-stroke-color" defaultValue="#000000" />
      </div>
      <div className="control-group">
        <div className="drawing-controls">
          <label className="switch">
            <input type="checkbox" id="text-shadow-checkbox" aria-label="Toggle Text Shadow" />
            <span className="slider"></span>
          </label>
          <span>Text Shadow</span>
        </div>
      </div>
    </div>
  );
};
