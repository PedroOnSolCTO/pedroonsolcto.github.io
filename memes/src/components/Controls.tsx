import { FC } from 'react';
import './Controls.css';
import { PhotoFilters } from './PhotoFilters';
import { TextControls } from './TextControls';
import { ImageInput } from './ImageInput';
import { Stickers } from './Stickers';
import { DrawingTools } from './DrawingTools';
import { Download } from './Download';

export const Controls: FC = () => {
  return (
    <div className="controls-area">
      <div className="controls-area-content">
        <ImageInput />
        <TextControls />
        <PhotoFilters />
        <Stickers />
        <DrawingTools />
        <Download />
      </div>
    </div>
  );
};
