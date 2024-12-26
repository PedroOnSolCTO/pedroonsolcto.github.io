import { FC, useState } from 'react';
import './Layouts.css';

const LAYOUT_OPTIONS = [
  {
    name: 'default',
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48">
        <rect
          x="6"
          y="6"
          width="36"
          height="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
    description: 'Image without text',
  },
  {
    name: 'top',
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48">
        <rect
          x="6"
          y="22"
          width="36"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text x="24" y="16" fontSize="12" textAnchor="middle" fill="currentColor" fontWeight="500">
          Text
        </text>
      </svg>
    ),
    description: 'Place text above the image',
  },
  {
    name: 'bottom',
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48">
        <rect
          x="6"
          y="6"
          width="36"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text x="24" y="38" fontSize="12" textAnchor="middle" fill="currentColor" fontWeight="500">
          Text
        </text>
      </svg>
    ),
    description: 'Place text below the image',
  },
  {
    name: 'both',
    icon: (
      <svg viewBox="0 0 48 48" width="48" height="48">
        <rect
          x="6"
          y="16"
          width="36"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text x="24" y="12" fontSize="11" textAnchor="middle" fill="currentColor" fontWeight="500">
          Text
        </text>
        <text x="24" y="44" fontSize="11" textAnchor="middle" fill="currentColor" fontWeight="500">
          Text
        </text>
      </svg>
    ),
    description: 'Place text above and below the image',
  },
];

export const Layouts: FC = () => {
  const [activeLayout, setActiveLayout] = useState('default');

  const handleLayoutChange = (layoutName: string) => {
    setActiveLayout(layoutName);
    // TODO: Implement layout change logic
  };

  return (
    <div className="layouts-content-container">
      <div className="layouts-grid">
        {LAYOUT_OPTIONS.map(layout => (
          <button
            key={layout.name}
            className={`layout-button ${activeLayout === layout.name ? 'active' : ''}`}
            onClick={() => handleLayoutChange(layout.name)}
            title={layout.description}
          >
            <span className="layout-icon">{layout.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
