import { FC } from 'react';
import './TrashCan.css';

export const TrashCan: FC = () => {
  return (
    <div className="trash-can" id="trash-can" title="Drop stickers here to remove them">
      🗑️
    </div>
  );
};
