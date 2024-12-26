import { useState, useCallback } from 'react';

interface TextSettings {
  topText: string;
  bottomText: string;
  fontSize: number;
  fontFamily: string;
  fillColor: string;
  strokeColor: string;
  textShadow: boolean;
}

export const useTextOverlay = () => {
  const [textSettings, setTextSettings] = useState<TextSettings>({
    topText: '',
    bottomText: '',
    fontSize: 48,
    fontFamily: 'Impact',
    fillColor: '#ffffff',
    strokeColor: '#000000',
    textShadow: true,
  });

  const drawText = useCallback((text: string, y: number, fontSize: number, ctx: CanvasRenderingContext2D) => {
    ctx.save();

    // Set text properties
    ctx.font = `${fontSize}px ${textSettings.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add text shadow if enabled
    if (textSettings.textShadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }

    // Calculate text width and position
    const maxWidth = ctx.canvas.width * 0.9;
    const x = ctx.canvas.width / 2;
    const lineHeight = fontSize * 1.2;

    // Function to wrap text
    const wrapText = (text: string, maxWidth: number) => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine += ' ' + word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    // Get wrapped lines
    const lines = wrapText(text, maxWidth);

    // Calculate vertical position for text block
    const totalHeight = lines.length * lineHeight;
    let yPos = y * ctx.canvas.height;
    if (y < 0.5) {
      yPos += totalHeight / 2; // For top text
    } else {
      yPos -= totalHeight / 2; // For bottom text
    }

    // Draw each line
    lines.forEach((line, i) => {
      // Draw stroke
      ctx.strokeStyle = textSettings.strokeColor;
      ctx.lineWidth = fontSize / 15;
      ctx.strokeText(line.trim(), x, yPos + i * lineHeight);

      // Draw fill
      ctx.fillStyle = textSettings.fillColor;
      ctx.fillText(line.trim(), x, yPos + i * lineHeight);
    });

    ctx.restore();
  }, [textSettings]);

  const updateTextSettings = useCallback((newSettings: Partial<TextSettings>) => {
    setTextSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    textSettings,
    updateTextSettings,
    drawText,
  };
};
