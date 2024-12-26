import { FC, useState } from 'react';
import './Layouts.css';

const LAYOUT_OPTIONS = [
  {
    name: 'Default',
    icon: '⬛',
    description: 'Center text on image'
  },
  {
    name: 'Top',
    icon: '▲',
    description: 'Place text at the top'
  },
  {
    name: 'Bottom',
    icon: '▼',
    description: 'Place text at the bottom'
  },
  {
    name: 'Left',
    icon: '◄',
    description: 'Place text on the left'
  },
  {
    name: 'Right',
    icon: '►',
    description: 'Place text on the right'
  }
];

export const Layouts: FC = () => {
  const [activeLayout, setActiveLayout] = useState('Default');

  const handleLayoutChange = (layoutName: string) => {
    setActiveLayout(layoutName);
    // TODO: Implement layout change logic
  };

  return (
    <div className="layouts-content-container">
      <div className="layouts-grid">
        {LAYOUT_OPTIONS.map((layout) => (
          <button
            key={layout.name}
            className={`layout-button ${activeLayout === layout.name ? 'active' : ''}`}
            onClick={() => handleLayoutChange(layout.name)}
            title={layout.description}
          >
            <span className="layout-icon">{layout.icon}</span>
            <span className="layout-name">{layout.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
