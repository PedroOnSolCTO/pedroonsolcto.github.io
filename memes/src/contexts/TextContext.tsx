import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TextObject {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

interface TextContextType {
  texts: TextObject[];
  selectedText: string | null;
  addText: () => void;
  removeText: (id: string) => void;
  updateText: (id: string, updates: Partial<TextObject>) => void;
  selectText: (id: string | null) => void;
  getSelectedText: () => TextObject | null;
}

const TextContext = createContext<TextContextType | null>(null);

export const useTextContext = () => {
  const context = useContext(TextContext);
  if (!context) {
    throw new Error('useTextContext must be used within a TextProvider');
  }
  return context;
};

export const TextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [texts, setTexts] = useState<TextObject[]>([]);
  const [selectedText, setSelectedText] = useState<string | null>(null);

  const addText = () => {
    const newText: TextObject = {
      id: `text-${Date.now()}`,
      text: 'Sample Text',
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#000000',
      bold: false,
      italic: false,
      underline: false,
    };
    setTexts(prev => [...prev, newText]);
    setSelectedText(newText.id);
  };

  const removeText = (id: string) => {
    setTexts(prev => prev.filter(text => text.id !== id));
    if (selectedText === id) {
      setSelectedText(null);
    }
  };

  const updateText = (id: string, updates: Partial<TextObject>) => {
    setTexts(prev => prev.map(text => 
      text.id === id ? { ...text, ...updates } : text
    ));
  };

  const selectText = (id: string | null) => {
    setSelectedText(id);
  };

  const getSelectedText = () => {
    return texts.find(text => text.id === selectedText) || null;
  };

  return (
    <TextContext.Provider 
      value={{
        texts,
        selectedText,
        addText,
        removeText,
        updateText,
        selectText,
        getSelectedText,
      }}
    >
      {children}
    </TextContext.Provider>
  );
};
