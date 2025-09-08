import { useEffect } from 'react';

interface BackgroundChangerProps {
  weather: string | null;
}

function BackgroundChanger({ weather }: BackgroundChangerProps) {
  useEffect(() => {
    const backgroundElement = document.getElementById('backgroundChanger');
    if (backgroundElement) {
      if (weather) {
        const classes = backgroundElement.className.split(' ').filter(c => !c.startsWith('weather-'));
        backgroundElement.className = classes.join(' ');

        backgroundElement.classList.add(`weather-${weather.toLowerCase()}`);
      }
    }
  }, [weather]);

  return null;
}

export default BackgroundChanger;