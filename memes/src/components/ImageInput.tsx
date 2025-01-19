import { FC } from 'react';

export const ImageInput: FC = () => {
  return (
    <div>
      <h2 className="control-heading">Background GIF</h2>
      <div className="control-group">
        <label htmlFor="gif-upload">Upload GIF or Image</label>
        <input type="file" id="gif-upload" accept="image/png, image/gif, image/jpeg" />
      </div>
    </div>
  );
};
