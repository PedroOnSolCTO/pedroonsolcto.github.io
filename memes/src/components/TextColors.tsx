import { FC, useState } from 'react';
import './TextColors.css';

const DEFAULT_COLORS = [
  '#FF6B6B', // Red
  '#4DABF7', // Blue
  '#51CF66', // Green
  '#FAB005', // Yellow
  '#BE4BDB', // Purple
  '#FF922B', // Orange
  '#20C997', // Teal
  '#868E96', // Gray
];

export const TextColors: FC = () => {
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Add to recent colors, keeping only the last 6
    setRecentColors(prev => {
      const newColors = [color, ...prev.filter(c => c !== color)];
      return newColors.slice(0, 6);
    });
    // TODO: Implement color change logic
    console.log('Selected color:', color);
  };

  return (
    <div className="text-colors-container">
      {recentColors.length > 0 && (
        <div className="color-section">
          <h3 className="section-title">Recent Colors</h3>
          <div className="color-grid recent-colors">
            {recentColors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                className={`color-button ${selectedColor === color ? 'active' : ''}`}
                onClick={() => handleColorChange(color)}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      <div className="color-section">
        <h3 className="section-title">Colors</h3>
        <div className="color-grid">
          <label className="color-button color-picker-button">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="color-picker-input"
            />
            <div className="color-picker-preview" />
          </label>
          {DEFAULT_COLORS.map((color, index) => (
            <button
              key={`${color}-${index}`}
              className={`color-button ${selectedColor === color ? 'active' : ''}`}
              onClick={() => handleColorChange(color)}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
