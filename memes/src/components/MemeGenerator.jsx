export const MemeGenerator = () => {
  return (
    <div class="wrapper">
      <div class="frames">
        <div class="frames-header">
          <h2>Frames</h2>
          <div class="toggle-all-container">
            <span>Toggle All</span>
            <label class="frame-toggle">
              <input
                type="checkbox"
                id="toggle-all-frames"
                checked
                aria-label="Toggle All Frames"
              />
              <span class="frame-toggle-slider"></span>
            </label>
          </div>
        </div>
        <div class="frames-grid" id="frames-grid"></div>
      </div>
      <div class="preview-area">
        <div class="meme-container" id="meme-container">
          <canvas id="preview-canvas"></canvas>
          <canvas id="meme-canvas"></canvas>
          <canvas id="drawCanvas"></canvas>
          <div class="stickers-container" id="stickersContainer"></div>
          <div class="text-overlay" id="top-text-overlay"></div>
          <div class="text-overlay" id="bottom-text-overlay"></div>
        </div>
        <div class="drawing-indicator" title="Drawing Mode Active"></div>
        <div
          class="trash-can"
          id="trash-can"
          style="position: absolute; bottom: 1em; right: 1em"
          title="Drop stickers here to remove them"
        >
          🗑️
        </div>
      </div>
      <div class="controls-area">
        <div class="controls-area-content">
          <h2>Background GIF</h2>
          <div class="control-group">
            <label for="gif-upload">Upload GIF or Image</label>
            <input type="file" id="gif-upload" accept="image/png, image/gif, image/jpeg" />
          </div>

          <h2>Text Settings</h2>
          <div class="control-group">
            <label for="top-text">Top Text</label>
            <input type="text" id="top-text" />
          </div>
          <div class="control-group">
            <label for="bottom-text">Bottom Text</label>
            <input type="text" id="bottom-text" />
          </div>
          <div class="control-group">
            <label>Font Family</label>
            <select id="font-family">
              <option value="Impact" selected>
                Impact
              </option>
              <option value="Arial Black">Arial Black</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
            </select>
          </div>
          <div class="control-group">
            <label for="font-size">Font Size</label>
            <input
              type="range"
              id="font-size"
              value="2"
              step="0.25"
              min="1"
              max="5"
              aria-label="Font Size"
            />
          </div>
          <div class="control-group">
            <label for="text-fill-color">Text Fill Color</label>
            <input type="color" id="text-fill-color" value="#ffffff" />
          </div>
          <div class="control-group">
            <label for="text-stroke-color">Text Stroke Color</label>
            <input type="color" id="text-stroke-color" value="#000000" />
          </div>
          <div class="control-group">
            <div class="drawing-controls">
              <label class="switch">
                <input type="checkbox" id="text-shadow-checkbox" aria-label="Toggle Text Shadow" />
                <span class="slider"></span>
              </label>
              <span>Text Shadow</span>
            </div>
          </div>

          <h2>Filters</h2>
          <div class="control-group">
            <label>Select Filter</label>
            <select id="filter-select">
              <option value="none">None</option>
              <option value="grayscale">Grayscale</option>
              <option value="sepia">Sepia</option>
              <option value="dreamy">Dreamy</option>
              <option value="cartoon">Cartoon</option>
              <option value="crunchy">Crunchy</option>
              <option value="invert">Invert</option>
              <option value="hue-rotate">Hue-Rotate</option>
            </select>
          </div>

          <h2>Stickers</h2>
          <div class="sticker-list" id="quick-stickers">
            <button>🐵</button>
            <button>🙈</button>
            <button>🙉</button>
            <button>🍌</button>
            <button>💰</button>
            <button>💵</button>
            <button>🦧</button>
            <button>🐒</button>
            <button>🤑</button>
            <button>💎</button>
            <button>🌕</button>
            <button>🚀</button>
            <button>📈</button>
          </div>
          <div class="control-group">
            <label for="sticker-input">Add Emoji Sticker</label>
            <input type="text" id="sticker-input" placeholder="e.g. 🐵" />
          </div>
          <div class="actions">
            <button id="add-sticker-btn" class="action-button action-button--compact">
              <span class="material-symbols-outlined">add_reaction</span>
              Add Sticker
            </button>
          </div>

          <h2>Drawing Tools</h2>
          <div class="drawing-controls">
            <label class="switch">
              <input type="checkbox" id="draw-mode-toggle" aria-label="Toggle Drawing Mode" />
              <span class="slider"></span>
            </label>
            <span>Drawing Mode</span>
          </div>
          <div class="control-group">
            <label>Draw Color</label>
            <input type="color" id="draw-color" value="#00cc00" aria-label="Draw Color" />
          </div>
          <div class="control-group">
            <label>Draw Size</label>
            <input type="range" id="draw-size" min="1" max="50" value="10" step="1" />
          </div>
          <div class="actions">
            <button id="clear-draw" class="action-button action-button--compact">
              <span class="material-symbols-outlined">delete</span>
              Clear Doodles
            </button>
          </div>

          <h2>Capture</h2>
          <div class="actions">
            <button id="capture-btn" class="action-button">
              <span class="material-symbols-outlined">photo_camera</span>
              Capture Meme
            </button>
            <button id="download-gif-btn" class="action-button">
              <span class="material-symbols-outlined">gif_box</span>
              Download GIF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
