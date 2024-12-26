import { FC, useState } from 'react';
import { useStickers } from '../hooks/useStickers';
import './Stickers.css';

const STICKER_CATEGORIES = [
  {
    name: 'Recent',
    stickers: ['😂', '🔥', '💯', '👀', '🤔', '💪', '🎉', '❤️'],
  },
  {
    name: 'Smileys',
    stickers: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😍'],
  },
  {
    name: 'Animals',
    stickers: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  },
  {
    name: 'Food',
    stickers: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑'],
  },
];

export const Stickers: FC = () => {
  const { addSticker } = useStickers();
  const [activeCategory, setActiveCategory] = useState('Recent');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // If implementing search, you would filter stickers here
  };

  const currentStickers =
    STICKER_CATEGORIES.find(cat => cat.name === activeCategory)?.stickers || [];

  return (
    <div className="stickers-content-container">
      <div className="stickers-search">
        <input
          type="text"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search stickers..."
          className="stickers-search-input"
        />
      </div>

      <div className="stickers-categories">
        {STICKER_CATEGORIES.map(category => (
          <button
            key={category.name}
            className={`category-button ${activeCategory === category.name ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.name)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="stickers-grid">
        {currentStickers.map((sticker, index) => (
          <button
            key={`${sticker}-${index}`}
            onClick={() => addSticker(sticker)}
            className="sticker-button"
          >
            {sticker}
          </button>
        ))}
      </div>

      <div className="stickers-actions">
        <button className="action-button delete">Delete</button>
        <button className="action-button done">Done</button>
      </div>
    </div>
  );
};
