import { FC, useState, useEffect } from 'react';
import { useTextOverlay } from '../hooks/useTextOverlay';
import './TextControls.css';

type ToolTab = 'colors' | 'fonts' | 'styles';

const FONT_FAMILIES = [
  'Arial',
  'Impact',
  'Comic Sans MS',
  'Times New Roman',
  'Helvetica',
  'Verdana',
];

const COLOR_PALETTE = [
  { color: '#ffffff', name: 'White' },
  { color: '#000000', name: 'Black' },
  { color: '#ffff00', name: 'Yellow' },
  { color: '#2196f3', name: 'Blue' },
  { color: '#4caf50', name: 'Green' },
  { color: '#ffa726', name: 'Orange' },
  { color: '#ff5722', name: 'Red' },
  { color: '#e91e63', name: 'Pink' },
  { color: '#9c27b0', name: 'Purple' },
];

const TEXT_STYLES = [
  { id: 'normal', name: 'Normal' },
  { id: 'bold', name: 'Bold' },
  { id: 'italic', name: 'Italic' },
  { id: 'outline', name: 'Outline' },
  { id: 'shadow', name: 'Shadow' },
];

const RECENT_COLORS_KEY = 'meme-generator-recent-colors';

export const TextControls: FC = () => {
  const { textSettings, updateTextSettings, addNewTextObject } = useTextOverlay();
  const [activeTab, setActiveTab] = useState<ToolTab>('colors');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentColors, setRecentColors] = useState<Array<{ color: string; name: string }>>(() => {
    const saved = localStorage.getItem(RECENT_COLORS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(recentColors));
  }, [recentColors]);

  const handleColorSelect = (color: string, name: string, saveToRecent = true) => {
    updateTextSettings({ fillColor: color });
    
    if (saveToRecent && !recentColors.some(c => c.color === color)) {
      // Only add to recent colors if it's not already in the list
      setRecentColors(prev => {
        return [{ color, name }, ...prev].slice(0, 3);
      });
    }
  };

  const handleAddText = () => {
    addNewTextObject();
  };

  const filteredFonts = FONT_FAMILIES.filter(font =>
    font.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'colors':
        return (
          <div className="text-controls-content">
            {recentColors.length > 0 && (
              <div className="color-section">
                <h3 className="section-title">Recent Colors</h3>
                <div className="text-controls-grid">
                  {recentColors.map(({ color, name }) => (
                    <button
                      key={color}
                      className={`text-control-button color-button ${textSettings.fillColor === color ? 'active' : ''}`}
                      onClick={() => handleColorSelect(color, name, false)}
                      title={name}
                    >
                      <div className="color-preview" style={{ background: color }} />
                      <span className="button-label">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="color-section">
              <h3 className="section-title">Colors</h3>
              <div className="text-controls-grid">
                <label className="text-control-button color-picker-button">
                  <input
                    type="color"
                    value={textSettings.fillColor}
                    onChange={(e) => handleColorSelect(e.target.value, 'Custom', false)}
                    onBlur={(e) => handleColorSelect(e.target.value, 'Custom', true)}
                    className="color-picker-input"
                  />
                  <div className="color-preview" />
                  <span className="button-label">Custom</span>
                </label>
                {COLOR_PALETTE.map(({ color, name }) => (
                  <button
                    key={color}
                    className={`text-control-button color-button ${textSettings.fillColor === color ? 'active' : ''}`}
                    onClick={() => handleColorSelect(color, name, false)}
                    title={name}
                  >
                    <div className="color-preview" style={{ background: color }} />
                    <span className="button-label">{name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'fonts':
        return (
          <div className="text-controls-content">
            <div className="search-bar">
              <svg className="search-icon" viewBox="0 0 24 24">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5M6.5,10C7.3,10 8,10.7 8,11.5C8,12.3 7.3,13 6.5,13C5.7,13 5,12.3 5,11.5C5,10.7 5.7,10 6.5,10M9.5,6C10.3,6 11,6.7 11,7.5C11,8.3 10.3,9 9.5,9C8.7,9 8,8.3 8,7.5C8,6.7 8.7,6 9.5,6M14.5,6C15.3,6 16,6.7 16,7.5C16,8.3 15.3,9 14.5,9C13.7,9 13,8.3 13,7.5C13,6.7 13.7,6 14.5,6M17.5,10C18.3,10 19,10.7 19,11.5C19,12.3 18.3,13 17.5,13C16.7,13 16,12.3 16,11.5C16,10.7 16.7,10 17.5,10Z" />
              </svg>
              <input
                type="text"
                placeholder="Search fonts..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="text-controls-grid">
              {filteredFonts.map(font => (
                <button
                  key={font}
                  className={`text-control-button ${textSettings.fontFamily === font ? 'active' : ''}`}
                  onClick={() => updateTextSettings({ fontFamily: font })}
                  style={{ fontFamily: font }}
                >
                  <span className="font-preview">Aa</span>
                  <span className="button-label">{font}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 'styles':
        return (
          <div className="text-controls-content">
            <div className="text-controls-grid">
              {TEXT_STYLES.map(style => (
                <button
                  key={style.id}
                  className={`text-control-button ${textSettings.textStyle === style.id ? 'active' : ''}`}
                  onClick={() => updateTextSettings({ textStyle: style.id })}
                >
                  <span className={`style-preview ${style.id}`}>Aa</span>
                  <span className="button-label">{style.name}</span>
                </button>
              ))}
            </div>
            <div className="size-control">
              <label>Text Size</label>
              <input
                type="range"
                min="12"
                max="72"
                value={textSettings.fontSize}
                onChange={e => updateTextSettings({ fontSize: Number(e.target.value) })}
                className="size-slider"
              />
              <span className="size-value">{textSettings.fontSize}px</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-controls">
      <div className="text-controls-tabs">
        <button
          className={`tab-button ${activeTab === 'colors' ? 'active' : ''}`}
          onClick={() => setActiveTab('colors')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24">
            <path d="M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2C17.5,2 22,6 22,11A6,6 0 0,1 16,17H14.2C13.9,17 13.7,17.2 13.7,17.5C13.7,17.6 13.8,17.7 13.8,17.8C14.2,18.3 14.4,18.9 14.4,19.5C14.5,20.9 13.4,22 12,22M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C12.3,20 12.5,19.8 12.5,19.5C12.5,19.3 12.4,19.2 12.4,19.1C12,18.6 11.8,18.1 11.8,17.5C11.8,16.1 12.9,15 14.3,15H16A4,4 0 0,0 20,11C20,7.1 16.4,4 12,4M6.5,10C7.3,10 8,10.7 8,11.5C8,12.3 7.3,13 6.5,13C5.7,13 5,12.3 5,11.5C5,10.7 5.7,10 6.5,10M9.5,6C10.3,6 11,6.7 11,7.5C11,8.3 10.3,9 9.5,9C8.7,9 8,8.3 8,7.5C8,6.7 8.7,6 9.5,6M14.5,6C15.3,6 16,6.7 16,7.5C16,8.3 15.3,9 14.5,9C13.7,9 13,8.3 13,7.5C13,6.7 13.7,6 14.5,6M17.5,10C18.3,10 19,10.7 19,11.5C19,12.3 18.3,13 17.5,13C16.7,13 16,12.3 16,11.5C16,10.7 16.7,10 17.5,10Z" />
          </svg>
          <span className="tab-label">Colors</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'fonts' ? 'active' : ''}`}
          onClick={() => setActiveTab('fonts')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24">
            <path d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
          </svg>
          <span className="tab-label">Fonts</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'styles' ? 'active' : ''}`}
          onClick={() => setActiveTab('styles')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24">
            <path d="M9.6,14L12,7.7L14.4,14M11,5L5.5,19H7.7L8.8,16H15L16.1,19H18.3L13,5H11Z" />
          </svg>
          <span className="tab-label">Styles</span>
        </button>
      </div>
      <button className="add-text-button" onClick={handleAddText}>
        <svg className="add-icon" viewBox="0 0 24 24">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
        Add Text
      </button>
      <div className="text-controls-content">{renderTabContent()}</div>
    </div>
  );
};
