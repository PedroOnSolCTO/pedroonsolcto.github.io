import { FC } from 'react';
import { useTemplate, TEMPLATES } from '../contexts/TemplateContext';
import './Templates.css';

export const Templates: FC = () => {
  const { selectedTemplateId, setSelectedTemplateId } = useTemplate();

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  return (
    <div className="templates-content-container">
      <div className="templates-grid">
        {TEMPLATES.map(template => (
          <button
            key={template.id}
            className={`template-button ${selectedTemplateId === template.id ? 'active' : ''}`}
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
