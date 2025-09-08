import { useColor } from 'color-thief-react';
import { useEffect } from 'react';

const darkenColor = (color: string, percent: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
};

interface BackgroundChangerProps {
  imageUrl: string | null;
}

function BackgroundChanger({ imageUrl }: BackgroundChangerProps) {
  const { data: dominantColor } = useColor(imageUrl || '', 'hex', {
    crossOrigin: 'anonymous',
    quality: 10,
  });

  useEffect(() => {
    if (dominantColor) {
      const darkerColor = darkenColor(dominantColor, 20); // Escurece em 20%
      document.documentElement.style.setProperty('--dominant-color', dominantColor);
      document.documentElement.style.setProperty('--dominant-color-darker', darkerColor);
    }
  }, [dominantColor]);

  return null;
}

export default BackgroundChanger;