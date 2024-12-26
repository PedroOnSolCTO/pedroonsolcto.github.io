import { FC, useEffect, useState } from 'react';
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

export const TextControls: FC = () => {
  const { textSettings, updateTextSettings, addNewTextObject } = useTextOverlay();
  const [activeTab, setActiveTab] = useState<ToolTab>('colors');

  useEffect(() => {
    addNewTextObject();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'colors':
        return (
          <div className="color-palette">
            <button
              className="color-button"
              style={{ background: '#ffffff' }}
              onClick={() => updateTextSettings({ fillColor: '#ffffff' })}
            />
            <button
              className="color-button"
              style={{ background: '#000000' }}
              onClick={() => updateTextSettings({ fillColor: '#000000' })}
            />
            <button
              className="color-button"
              style={{ background: '#ffff00' }}
              onClick={() => updateTextSettings({ fillColor: '#ffff00' })}
            />
            <button
              className="color-button"
              style={{ background: '#2196f3' }}
              onClick={() => updateTextSettings({ fillColor: '#2196f3' })}
            />
            <button
              className="color-button"
              style={{ background: '#4caf50' }}
              onClick={() => updateTextSettings({ fillColor: '#4caf50' })}
            />
            <button
              className="color-button"
              style={{ background: '#ffa726' }}
              onClick={() => updateTextSettings({ fillColor: '#ffa726' })}
            />
            <button
              className="color-button"
              style={{ background: '#ff5722' }}
              onClick={() => updateTextSettings({ fillColor: '#ff5722' })}
            />
            <button
              className="color-button"
              style={{ background: '#e91e63' }}
              onClick={() => updateTextSettings({ fillColor: '#e91e63' })}
            />
            <button
              className="color-button"
              style={{ background: '#9c27b0' }}
              onClick={() => updateTextSettings({ fillColor: '#9c27b0' })}
            />
          </div>
        );
      case 'fonts':
        return (
          <div className="fonts-tab">
            <div className="font-list">
              {FONT_FAMILIES.map(font => (
                <button
                  key={font}
                  className={`font-button ${textSettings.fontFamily === font ? 'active' : ''}`}
                  onClick={() => updateTextSettings({ fontFamily: font })}
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
            <div className="size-control">
              <label>Size</label>
              <input
                type="range"
                min="12"
                max="72"
                value={textSettings.fontSize}
                onChange={e => updateTextSettings({ fontSize: Number(e.target.value) })}
                className="size-slider"
              />
            </div>
          </div>
        );
      case 'styles':
        return (
          <div className="styles-tab">
            <button
              className={`style-button ${textSettings.textStyle === 'normal' ? 'active' : ''}`}
              onClick={() => updateTextSettings({ textStyle: 'normal' })}
            >
              Normal Text
            </button>
            <button
              className={`style-button ${textSettings.textStyle === 'white-bg' ? 'active' : ''}`}
              onClick={() => updateTextSettings({ textStyle: 'white-bg' })}
            >
              White Background
            </button>
            <button
              className={`style-button ${textSettings.textStyle === 'black-bg' ? 'active' : ''}`}
              onClick={() => updateTextSettings({ textStyle: 'black-bg' })}
            >
              Black Background
            </button>
            <button
              className={`style-button ${textSettings.textStyle === 'shadow' ? 'active' : ''}`}
              onClick={() => updateTextSettings({ textStyle: 'shadow' })}
            >
              Text Shadow
            </button>
          </div>
        );
    }
  };

  return (
    <div className="text-controls">
      <div className="text-input-area">
        <input
          type="text"
          value={textSettings.currentText}
          onChange={e => updateTextSettings({ currentText: e.target.value })}
          placeholder="Sample Text"
          className="text-input"
        />
      </div>

      <div className="text-tools">
        <div className="tool-row">
          <button
            className={`tool-button ${activeTab === 'colors' ? 'active' : ''}`}
            onClick={() => setActiveTab('colors')}
          >
            <span role="img" aria-label="color">
              🎨
            </span>
          </button>
          <button
            className={`tool-button ${activeTab === 'fonts' ? 'active' : ''}`}
            onClick={() => setActiveTab('fonts')}
          >
            <span>Tt</span>
          </button>
          <button
            className={`tool-button ${activeTab === 'styles' ? 'active' : ''}`}
            onClick={() => setActiveTab('styles')}
          >
            <span>A</span>
          </button>
        </div>

        {renderTabContent()}
      </div>

      <div className="text-actions">
        <button className="action-button delete">Delete</button>
        <button className="action-button done">Done</button>
      </div>
    </div>
  );
};
