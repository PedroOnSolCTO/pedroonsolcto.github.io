import { createContext, FC, PropsWithChildren, useContext, useState } from 'react';
import pedroForward from '../assets/templates/pedro-forward.jpg';
import pedroSideBySide from '../assets/templates/pedro-side-by-side.jpg';
import pedroSideEye from '../assets/templates/pedro-side-eye.jpg';

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

export const TEMPLATES = [
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
] as const;

const TEMPLATE_IMAGES: Record<string, string> = {
  'pedro-side-by-side': pedroSideBySide,
  'pedro-forward': pedroForward,
  'pedro-side-eye': pedroSideEye,
} as const;

interface TemplateContextType {
  selectedTemplateId: string;
  selectedTemplateImage: string;
  setSelectedTemplateId: (id: string) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('pedro-side-by-side');
  const selectedTemplateImage = TEMPLATE_IMAGES[selectedTemplateId];

  return (
    <TemplateContext.Provider 
      value={{ 
        selectedTemplateId, 
        selectedTemplateImage, 
        setSelectedTemplateId 
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};
