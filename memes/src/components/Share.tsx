import { FC } from 'react';
import './Share.css';

export const Share: FC = () => {
  const handleShare = (platform: string) => {
    // TODO: Implement sharing logic for each platform
    console.log(`Sharing via ${platform}`);
  };

  const handleDownload = () => {
    // TODO: Implement download logic
    console.log('Downloading meme');
  };

  return (
    <div className="share-content-container">
      <h2 className="share-title">Share Your Meme</h2>
      
      <div className="share-options">
        <button 
          className="share-button twitter"
          onClick={() => handleShare('twitter')}
        >
          <svg className="share-icon" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Share via Twitter
        </button>

        <button 
          className="share-button download"
          onClick={handleDownload}
        >
          <svg className="share-icon" viewBox="0 0 24 24">
            <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"/>
          </svg>
          Download
        </button>
      </div>
    </div>
  );
};
