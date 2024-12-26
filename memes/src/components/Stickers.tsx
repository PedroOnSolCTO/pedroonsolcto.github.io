import { FC, useState } from 'react';
import { useStickers } from '../hooks/useStickers';
import './Stickers.css';

export const Stickers: FC = () => {
  const { addSticker } = useStickers();
  const [stickerInput, setStickerInput] = useState('');

  const quickStickers = ['😂', '🔥', '💯', '👀', '🤔', '💪', '🎉', '❤️'];

  const handleAddSticker = () => {
    if (stickerInput.trim()) {
      addSticker(stickerInput.trim());
      setStickerInput('');
    }
  };

  return (
    <div>
      <h2 className="control-heading">Stickers</h2>
      <div className="control-group">
        <input
          type="text"
          value={stickerInput}
          onChange={(e) => setStickerInput(e.target.value)}
          placeholder="Enter emoji or sticker"
        />
        <button onClick={handleAddSticker}>Add Sticker</button>
      </div>
      <div className="quick-stickers">
        {quickStickers.map((sticker) => (
          <button
            key={sticker}
            onClick={() => addSticker(sticker)}
            className="quick-sticker-btn"
          >
            {sticker}
          </button>
        ))}
      </div>
    </div>
  );
};
