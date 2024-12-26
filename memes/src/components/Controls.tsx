import { FC, useState } from 'react';
import './Controls.css';
import { TextControls } from './TextControls';
import { Stickers } from './Stickers';
import { Layouts } from './Layouts';
import { Download } from './Download';

type Tab = 'text' | 'stickers' | 'layouts' | 'templates' | 'share' | 'more';

export const Controls: FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('text');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'text':
        return <TextControls />;
      case 'stickers':
        return <Stickers />;
      case 'layouts':
        return <Layouts />;
      case 'templates':
        return <div>Templates coming soon</div>;
      case 'share':
        return <Download />;
      case 'more':
        return <div>More options coming soon</div>;
      default:
        return null;
    }
  };

  return (
    <div className="controls-area">
      <div className="controls-tabs">
        <button 
          className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <span className="tab-icon">T</span>
          <span className="tab-label">Text</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'stickers' ? 'active' : ''}`}
          onClick={() => setActiveTab('stickers')}
        >
          <span className="tab-icon">🎯</span>
          <span className="tab-label">Stickers</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'layouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('layouts')}
        >
          <span className="tab-icon">⬒</span>
          <span className="tab-label">Layouts</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <span className="tab-icon">📄</span>
          <span className="tab-label">Templates</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'share' ? 'active' : ''}`}
          onClick={() => setActiveTab('share')}
        >
          <span className="tab-icon">↗️</span>
          <span className="tab-label">Share</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'more' ? 'active' : ''}`}
          onClick={() => setActiveTab('more')}
        >
          <span className="tab-icon">⋯</span>
          <span className="tab-label">More</span>
        </button>
      </div>
      <div className="controls-area-content">
        {renderTabContent()}
      </div>
    </div>
  );
};
