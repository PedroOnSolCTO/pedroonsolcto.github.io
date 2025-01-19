import { FC } from 'react';

interface PhotoFiltersProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export const PhotoFilters: FC<PhotoFiltersProps> = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { value: 'none', label: 'None' },
    { value: 'grayscale', label: 'Grayscale' },
    { value: 'sepia', label: 'Sepia' },
    { value: 'invert', label: 'Invert' },
    { value: 'dreamy', label: 'Dreamy' },
    { value: 'cartoon', label: 'Cartoon' },
    { value: 'crunchy', label: 'Crunchy' },
    { value: 'hue-rotate', label: 'Hue Rotate' },
    { value: 'blur', label: 'Blur' },
  ];

  return (
    <div>
      <h2 className="control-heading">Photo Filter</h2>
      <div className="control-group">
        <select
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          aria-label="Select Filter"
        >
          {filters.map(filter => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
