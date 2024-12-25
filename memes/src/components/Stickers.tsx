import { FC } from 'react';
import './Stickers.css';

export const Stickers: FC = () => {
  return (
    <div className="stickers">
      <h2 className="control-heading">Stickers</h2>
      <div className="sticker-list" id="quick-stickers">
        <button>🐵</button>
        <button>🙈</button>
        <button>🙉</button>
        <button>🐒</button>
        <button>🍌</button>
        <button>💰</button>
        <button>💵</button>
        <button>🤑</button>
        <button>🦧</button>
        <button>💎</button>
        <button>🌕</button>
        <button>🚀</button>
        <button>📈</button>
      </div>
      <div className="control-group">
        <label htmlFor="sticker-input">Add Emoji Sticker</label>
        <input type="text" id="sticker-input" placeholder="e.g. 🐵" />
      </div>
      <div className="actions">
        <button id="add-sticker-btn" className="action-button action-button--compact">
          <span className="material-symbols-outlined">add_reaction</span>
          Add Sticker
        </button>
      </div>
    </div>
  );
};
