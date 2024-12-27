import { FC } from 'react';
import { useStickers } from '../hooks/useStickers';
import './Stickers.css';

const STICKERS = [
  '🐒', '🦍', '🦧', '🐵', '🙈', '🙉',  // Row 1: Monkeys
  '🙊', '🍌', '🌴', '🌳', '🌿', '🍃',  // Row 2: Monkey, Banana, Trees
  '🌱', '🎋', '🦜', '🦁', '🐯', '🐘',  // Row 3: Plants and Animals
  '🦒', '🌺'                            // Row 4: Giraffe, Flower
];

export const Stickers: FC = () => {
  const { addSticker } = useStickers();

  return (
    <div className="stickers-content-container">
      <div className="stickers-grid">
        {STICKERS.map((sticker, index) => (
          <button
            key={`${sticker}-${index}`}
            onClick={() => addSticker(sticker)}
            className="sticker-button"
          >
            {sticker}
          </button>
        ))}
      </div>
    </div>
  );
};
