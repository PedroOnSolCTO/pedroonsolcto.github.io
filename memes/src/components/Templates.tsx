import { FC, useState } from 'react';
import pedroForward from '../assets/templates/pedro-forward.jpg';
import pedroSideBySide from '../assets/templates/pedro-side-by-side.jpg';
import pedroSideEye from '../assets/templates/pedro-side-eye.jpg';
import './Templates.css';

const TEMPLATE_OPTIONS = [
  {
    id: 'pedro-side-by-side',
    name: 'Pedro',
    thumbnail: pedroSideBySide,
    description: 'Pedro the monkey giving a side-eye look',
  },
  {
    id: 'pedro-forward',
    name: 'Pedro Forward Look',
    thumbnail: pedroForward,
    description: 'Pedro the monkey looking forward',
  },
  {
    id: 'pedro-side-eye',
    name: 'Pedro Side-Eye Look',
    thumbnail: pedroSideEye,
    description: 'Pedro the monkey giving a side-eye look',
  },
];

export const Templates: FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATE_OPTIONS[0].id);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    // TODO: Implement template selection logic
    console.log('Selected template:', templateId);
  };

  return (
    <div className="templates-content-container">
      <div className="templates-grid">
        {TEMPLATE_OPTIONS.map(template => (
          <button
            key={template.id}
            className={`template-button ${selectedTemplate === template.id ? 'active' : ''}`}
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
