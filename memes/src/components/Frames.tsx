import { FC } from 'react';
import './Frames.css';

interface FramesProps {
  frames: { imageData: ImageData }[];
  currentFrame: number;
  disabledFrames: Record<number, boolean>;
  onToggleFrame: (index: number) => void;
  onToggleAll: (enabled: boolean) => void;
}

export const Frames: FC<FramesProps> = ({
  frames,
  currentFrame,
  disabledFrames,
  onToggleFrame,
  onToggleAll,
}) => {
  const renderFramePreview = (frameData: ImageData, index: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = frameData.width;
    canvas.height = frameData.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.putImageData(frameData, 0, 0);
    return canvas.toDataURL();
  };

  return (
    <div className="frames-section">
      <h2 className="control-heading">Frames</h2>
      <div className="frames-controls">
        <label className="switch">
          <input
            type="checkbox"
            checked={frames.length > 0 && !Object.values(disabledFrames).some(disabled => disabled)}
            onChange={e => onToggleAll(e.target.checked)}
            aria-label="Toggle All Frames"
          />
          <span className="slider"></span>
        </label>
        <span>Enable All Frames</span>
      </div>
      <div className="frames-grid" id="frames-grid">
        {frames.map((frame, index) => (
          <div
            key={index}
            className={`frame ${currentFrame === index ? 'current' : ''} ${
              disabledFrames[index] ? 'disabled' : ''
            }`}
          >
            <img src={renderFramePreview(frame.imageData, index)} alt={`Frame ${index + 1}`} />
            <label className="switch">
              <input
                type="checkbox"
                checked={!disabledFrames[index]}
                onChange={() => onToggleFrame(index)}
                aria-label={`Toggle Frame ${index + 1}`}
              />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
