import { FC } from 'react';

export const MemeGenerator: FC = () => {
  return (
    <div className="wrapper">
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
      <div className="preview-area">
        <div className="meme-container" id="meme-container">
          <canvas id="preview-canvas"></canvas>
          <canvas id="meme-canvas"></canvas>
          <canvas id="drawCanvas"></canvas>
          <div className="stickers-container" id="stickersContainer"></div>
          <div className="text-overlay" id="top-text-overlay"></div>
          <div className="text-overlay" id="bottom-text-overlay"></div>
        </div>
        <div className="drawing-indicator" title="Drawing Mode Active"></div>
        <div
          className="trash-can"
          id="trash-can"
          style={{ position: 'absolute', bottom: '1em', right: '1em' }}
          title="Drop stickers here to remove them"
        >
          🗑️
        </div>
      </div>
      <div className="controls-area">
        <div className="controls-area-content">
          <h2>Background GIF</h2>
          <div className="control-group">
            <label htmlFor="gif-upload">Upload GIF or Image</label>
            <input type="file" id="gif-upload" accept="image/png, image/gif, image/jpeg" />
          </div>

          <h2>Text Settings</h2>
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
            <select id="font-family">
              <option value="Impact" defaultValue>
                Impact
              </option>
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

          <h2>Filters</h2>
          <div className="control-group">
            <label>Select Filter</label>
            <select id="filter-select">
              <option value="none">None</option>
              <option value="grayscale">Grayscale</option>
              <option value="sepia">Sepia</option>
              <option value="invert">Invert</option>
              <option value="blur">Blur</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
