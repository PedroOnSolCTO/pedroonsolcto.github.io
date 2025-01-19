import { useState, useCallback } from 'react';

interface TextObject {
  id: string;
  text: string;
  fontSize: number;
  fontFamily: string;
  fillColor: string;
  x: number;
  y: number;
  textStyle: 'normal' | 'white-bg' | 'black-bg' | 'shadow';
}

interface TextSettings {
  currentText: string;
  fontSize: number;
  fontFamily: string;
  fillColor: string;
  textStyle: 'normal' | 'white-bg' | 'black-bg' | 'shadow';
}

export const useTextOverlay = () => {
  const [textObjects, setTextObjects] = useState<TextObject[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [textSettings, setTextSettings] = useState<TextSettings>({
    currentText: 'Sample Text',
    fontSize: 48,
    fontFamily: 'Arial',
    fillColor: '#000000',
    textStyle: 'normal',
  });

  const addNewTextObject = useCallback(() => {
    const newId = Date.now().toString();
    const newTextObject: TextObject = {
      id: newId,
      text: textSettings.currentText,
      fontSize: textSettings.fontSize,
      fontFamily: textSettings.fontFamily,
      fillColor: textSettings.fillColor,
      x: 0.5, // Center of canvas
      y: 0.5, // Center of canvas
      textStyle: textSettings.textStyle,
    };

    setTextObjects(prev => [...prev, newTextObject]);
    setSelectedTextId(newId);
  }, [textSettings]);

  const updateTextSettings = useCallback((newSettings: Partial<TextSettings>) => {
    setTextSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // If we have a selected text object, update it as well
      if (selectedTextId) {
        setTextObjects(prev => prev.map(obj => 
          obj.id === selectedTextId
            ? { 
                ...obj, 
                text: updated.currentText ?? obj.text,
                fontSize: updated.fontSize ?? obj.fontSize,
                fontFamily: updated.fontFamily ?? obj.fontFamily,
                fillColor: updated.fillColor ?? obj.fillColor,
                textStyle: updated.textStyle ?? obj.textStyle,
              }
            : obj
        ));
      }
      
      return updated;
    });
  }, [selectedTextId]);

  const deleteSelectedText = useCallback(() => {
    if (selectedTextId) {
      setTextObjects(prev => prev.filter(obj => obj.id !== selectedTextId));
      setSelectedTextId(null);
    }
  }, [selectedTextId]);

  const selectTextObject = useCallback((id: string) => {
    setSelectedTextId(id);
    const textObject = textObjects.find(obj => obj.id === id);
    if (textObject) {
      setTextSettings(prev => ({
        ...prev,
        currentText: textObject.text,
        fontSize: textObject.fontSize,
        fontFamily: textObject.fontFamily,
        fillColor: textObject.fillColor,
        textStyle: textObject.textStyle,
      }));
    }
  }, [textObjects]);

  const moveTextObject = useCallback((id: string, x: number, y: number) => {
    setTextObjects(prev => prev.map(obj =>
      obj.id === id ? { ...obj, x, y } : obj
    ));
  }, []);

  return {
    textObjects,
    selectedTextId,
    textSettings,
    addNewTextObject,
    updateTextSettings,
    deleteSelectedText,
    selectTextObject,
    moveTextObject,
  };
};
