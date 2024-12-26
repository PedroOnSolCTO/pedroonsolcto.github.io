import { FC } from 'react';
import './Templates.css';

const TEMPLATE_OPTIONS = [
  {
    id: 'drake',
    name: 'Drake Hotline Bling',
    thumbnail: 'https://i.imgflip.com/30b1gx.jpg',
    description: 'Drake prefers one option over another'
  },
  {
    id: 'distracted',
    name: 'Distracted Boyfriend',
    thumbnail: 'https://i.imgflip.com/1ur9b0.jpg',
    description: 'Man looking back at another woman'
  },
  {
    id: 'buttons',
    name: 'Two Buttons',
    thumbnail: 'https://i.imgflip.com/1g8my4.jpg',
    description: 'Person sweating over two buttons'
  },
  {
    id: 'expanding',
    name: 'Expanding Brain',
    thumbnail: 'https://i.imgflip.com/1jwhww.jpg',
    description: 'Increasingly complex ideas'
  },
  {
    id: 'doge',
    name: 'Doge',
    thumbnail: 'https://i.imgflip.com/4t0m5.jpg',
    description: 'Such wow, very meme'
  },
  {
    id: 'change-mind',
    name: 'Change My Mind',
    thumbnail: 'https://i.imgflip.com/24y43o.jpg',
    description: 'Change my mind debate table'
  }
];

export const Templates: FC = () => {
  const handleTemplateSelect = (templateId: string) => {
    // TODO: Implement template selection logic
    console.log('Selected template:', templateId);
  };

  return (
    <div className="templates-content-container">
      <div className="templates-search">
        <input
          type="text"
          placeholder="Search templates..."
          className="templates-search-input"
        />
      </div>

      <div className="templates-grid">
        {TEMPLATE_OPTIONS.map((template) => (
          <button
            key={template.id}
            className="template-button"
            onClick={() => handleTemplateSelect(template.id)}
            title={template.description}
          >
            <div className="template-thumbnail">
              <img src={template.thumbnail} alt={template.name} />
            </div>
            <span className="template-name">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
