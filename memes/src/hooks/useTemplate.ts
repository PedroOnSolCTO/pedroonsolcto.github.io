import { useEffect, useMemo, useState } from 'react';
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

export const useTemplate = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('pedro-side-by-side');

  // Memoize the selected image to prevent unnecessary recalculations
  const selectedTemplateImage = useMemo(
    () => TEMPLATE_IMAGES[selectedTemplateId],
    [selectedTemplateId]
  );

  useEffect(() => {
    console.log('Template ID changed:', selectedTemplateId);
    console.log('Selected image:', selectedTemplateImage);
  }, [selectedTemplateId]); // Only depend on selectedTemplateId

  return {
    selectedTemplateId,
    selectedTemplateImage,
    setSelectedTemplateId,
  };
};
