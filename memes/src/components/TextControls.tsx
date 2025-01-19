import { FC, useState, useEffect } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
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
  { color: '#FFFFFF', name: 'White' },      // Classic white, high contrast on dark images
  { color: '#000000', name: 'Black' },      // Classic black, high contrast on light images
  { color: '#FFFF00', name: 'Yellow' },     // Bright yellow, good visibility
  { color: '#FF0000', name: 'Red' },        // Pure red for emphasis
  { color: '#00FF00', name: 'Green' },      // Bright green for visibility
  { color: '#39FF14', name: 'Neon Green' }, // Ultra-bright green, very visible
  { color: '#FF00FF', name: 'Magenta' },    // Bright magenta for high contrast
  { color: '#00FFFF', name: 'Cyan' },       // Bright cyan for visibility
  { color: '#FFA500', name: 'Orange' },     // Standard orange for warmth
  { color: '#FF1493', name: 'Pink' },       // Deep pink for emphasis
  { color: '#40E0D0', name: 'Turquoise' },  // Bright turquoise
  { color: '#FFD700', name: 'Gold' },       // Metallic gold
  { color: '#FF69B4', name: 'Hot Pink' },   // Hot pink for emphasis
  { color: '#7FFF00', name: 'Chartreuse' }, // Bright yellow-green
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
  const { textSettings, updateTextSettings } = useTextOverlay();
  const [activeTab, setActiveTab] = useState<ToolTab>('colors');
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
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="color-section">
              <h3 className="section-title">Colors</h3>
              <div className="text-controls-grid">
                <div className="color-picker">
                  <div className="color-picker-container">
                    <HexColorPicker
                      color={textSettings.fillColor}
                      onChange={(color) => handleColorSelect(color, 'Custom', false)}
                      onMouseUp={(e) => {
                        // Save to recent colors when user finishes dragging
                        handleColorSelect(textSettings.fillColor, 'Custom', true);
                      }}
                    />
                    <div className="color-input-row">
                      <div className="color-preview" style={{ background: textSettings.fillColor }} />
                      <div className="color-input-container">
                        <span>#</span>
                        <HexColorInput
                          color={textSettings.fillColor}
                          onChange={(color) => handleColorSelect('#' + color, 'Custom', true)}
                          className="color-text-input"
                          prefixed={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {COLOR_PALETTE.map(({ color, name }) => (
                  <button
                    key={color}
                    className={`text-control-button color-button ${textSettings.fillColor === color ? 'active' : ''}`}
                    onClick={() => handleColorSelect(color, name, false)}
                    title={name}
                  >
                    <div className="color-preview" style={{ background: color }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'fonts':
        return (
          <div className="text-controls-content">
            <div className="text-controls-grid">
              {FONT_FAMILIES.map(font => (
                <button
                  key={font}
                  className={`text-control-button ${textSettings.fontFamily === font ? 'active' : ''}`}
                  onClick={() => updateTextSettings({ fontFamily: font })}
                >
                  <div className="font-preview" style={{ fontFamily: font }}>Aa</div>
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
              {TEXT_STYLES.map(({ id, name }) => (
                <button
                  key={id}
                  className={`text-control-button ${textSettings.textStyle === id ? 'active' : ''}`}
                  onClick={() => updateTextSettings({ textStyle: id })}
                >
                  <div className={`style-preview ${id}`}>Aa</div>
                  <span className="button-label">{name}</span>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="text-controls">
      <div className="text-controls-tabs">
        <button
          className={`tab-button ${activeTab === 'colors' ? 'active' : ''}`}
          onClick={() => setActiveTab('colors')}
        >
          Colors
        </button>
        <button
          className={`tab-button ${activeTab === 'fonts' ? 'active' : ''}`}
          onClick={() => setActiveTab('fonts')}
        >
          Fonts
        </button>
        <button
          className={`tab-button ${activeTab === 'styles' ? 'active' : ''}`}
          onClick={() => setActiveTab('styles')}
        >
          Styles
        </button>
      </div>
      {renderTabContent()}
    </div>
  );
};
