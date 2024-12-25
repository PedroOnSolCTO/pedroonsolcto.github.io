import { FC } from 'react';

export const PhotoFilters: FC = () => {
  return (
    <>
      <h2 className="control-heading">Filters</h2>
      <div className="control-group">
        <label>Select Filter</label>
        <select id="filter-select">
          <option value="none">None</option>
          <option value="grayscale">Grayscale</option>
          <option value="sepia">Sepia</option>
          <option value="invert">Invert</option>
          <option value="blur">Blur</option>
        </select>
      </div>
    </>
  );
};
