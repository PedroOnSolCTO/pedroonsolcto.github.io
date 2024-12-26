import { FC, useState } from 'react';
import { useTextOverlay } from '../hooks/useTextOverlay';
import './TextControls.css';

type ToolTab = 'colors' | 'fonts' | 'styles';

const FONT_FAMILIES = [
  'Arial',
  'Impact',
  'Comic Sans MS',
  'Times New Roman',
  'Helvetica',
  'Verdana'
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
  { color: '#9c27b0', name: 'Purple' }
];

const TEXT_STYLES = [
  { id: 'normal', name: 'Normal' },
  { id: 'bold', name: 'Bold' },
  { id: 'italic', name: 'Italic' },
  { id: 'outline', name: 'Outline' },
  { id: 'shadow', name: 'Shadow' }
];

export const TextControls: FC = () => {
  const { textSettings, updateTextSettings, addNewTextObject } = useTextOverlay();
  const [activeTab, setActiveTab] = useState<ToolTab>('colors');
  const [searchQuery, setSearchQuery] = useState('');

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
          <div className="text-controls-grid">
            {COLOR_PALETTE.map(({ color, name }) => (
              <button
                key={color}
                className={`text-control-button color-button ${textSettings.fillColor === color ? 'active' : ''}`}
                onClick={() => updateTextSettings({ fillColor: color })}
                title={name}
              >
                <div className="color-preview" style={{ background: color }} />
                <span className="button-label">{name}</span>
              </button>
            ))}
          </div>
        );
      case 'fonts':
        return (
          <div className="text-controls-content">
            <div className="search-bar">
              <svg className="search-icon" viewBox="0 0 24 24">
                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
              </svg>
              <input
                type="text"
                placeholder="Search fonts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            <path d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z" />
          </svg>
          Colors
        </button>
        <button
          className={`tab-button ${activeTab === 'fonts' ? 'active' : ''}`}
          onClick={() => setActiveTab('fonts')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24">
            <path d="M9.93,13.5H13.07L11.5,8.5L9.93,13.5M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,17L6.5,17L7.2,15H10.5L11,17M17.5,17H13L13.5,15H16.8L17.5,17Z" />
          </svg>
          Fonts
        </button>
        <button
          className={`tab-button ${activeTab === 'styles' ? 'active' : ''}`}
          onClick={() => setActiveTab('styles')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24">
            <path d="M9.6,14L12,7.7L14.4,14M11,5L5.5,19H7.7L8.8,16H15L16.1,19H18.3L13,5H11Z" />
          </svg>
          Styles
        </button>
      </div>
      <button className="add-text-button" onClick={handleAddText}>
        <svg className="add-icon" viewBox="0 0 24 24">
          <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
        Add Text
      </button>
      <div className="text-controls-content">
        {renderTabContent()}
      </div>
    </div>
  );
};
