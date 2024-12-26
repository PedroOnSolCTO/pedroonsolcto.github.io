import { FC } from 'react';
import { useTextOverlay } from '../hooks/useTextOverlay';
import './TextControls.css';

export const TextControls: FC = () => {
  const { textSettings, updateTextSettings } = useTextOverlay();

  return (
    <div>
      <h2 className="control-heading">Text</h2>
      <div className="control-group">
        <input
          type="text"
          value={textSettings.topText}
          onChange={(e) => updateTextSettings({ topText: e.target.value })}
          placeholder="Top Text"
        />
        <input
          type="text"
          value={textSettings.bottomText}
          onChange={(e) => updateTextSettings({ bottomText: e.target.value })}
          placeholder="Bottom Text"
        />
        <select
          value={textSettings.fontFamily}
          onChange={(e) => updateTextSettings({ fontFamily: e.target.value })}
        >
          <option value="Arial">Arial</option>
          <option value="Impact">Impact</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>
        <input
          type="number"
          value={textSettings.fontSize}
          onChange={(e) => updateTextSettings({ fontSize: Number(e.target.value) })}
          min="12"
          max="72"
        />
        <input
          type="color"
          value={textSettings.fillColor}
          onChange={(e) => updateTextSettings({ fillColor: e.target.value })}
          title="Text Color"
        />
        <input
          type="color"
          value={textSettings.strokeColor}
          onChange={(e) => updateTextSettings({ strokeColor: e.target.value })}
          title="Stroke Color"
        />
        <label>
          <input
            type="checkbox"
            checked={textSettings.textShadow}
            onChange={(e) => updateTextSettings({ textShadow: e.target.checked })}
          />
          Text Shadow
        </label>
      </div>
    </div>
  );
};
