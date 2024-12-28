import { FC, PropsWithChildren, useState } from 'react';
import './Controls.css';
import { Layouts } from './Layouts';
import { Share } from './Share';
import { Stickers } from './Stickers';
import { TextControls } from './TextControls';
import { Templates } from './Templates';

type Tab = 'templates' | 'layouts' | 'text' | 'stickers' | 'share';

export const Controls: FC<PropsWithChildren> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<Tab>('templates');

  console.log('Active tab:', activeTab); // Debug log

  const renderTabContent = () => {
    switch (activeTab) {
      case 'templates':
        console.log('Rendering templates tab'); // Debug log
        return <Templates />;
      case 'layouts':
        return <Layouts />;
      case 'text':
        return <TextControls />;
      case 'stickers':
        return <Stickers />;
      case 'share':
        return <Share />;
      default:
        return null;
    }
  };

  return (
    <div className="controls-area">
      <div className="controls-tabs">
        <button
          className={`tab-button ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24">
            <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z M17,17H7V7H17V17Z" />
          </svg>
          <span className="tab-label">Templates</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'layouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('layouts')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24">
            <path d="M3,3H21V5H3V3M3,7H21V9H3V7M3,11H21V13H3V11M3,15H21V17H3V15M3,19H21V21H3V19Z" />
          </svg>
          <span className="tab-label">Layouts</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24">
            <path d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
          </svg>
          <span className="tab-label">Text</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'stickers' ? 'active' : ''}`}
          onClick={() => setActiveTab('stickers')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
          </svg>
          <span className="tab-label">Stickers</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'share' ? 'active' : ''}`}
          onClick={() => setActiveTab('share')}
        >
          <svg className="tab-icon" viewBox="0 0 24 24">
            <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
          </svg>
          <span className="tab-label">Share</span>
        </button>
      </div>
      <div className="controls-area-content">{renderTabContent()}</div>
    </div>
  );
};
