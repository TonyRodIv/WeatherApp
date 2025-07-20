import { useState, useEffect } from 'react';
import WeatherDisplay from './WeatherDisplay';

function LocalWeather() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
      setError(null);
    };

    const handleError = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError("Você negou o pedido de Geolocalização. Por favor, habilite nas configurações do seu navegador se desejar ver o tempo local.");
          break;
        case error.POSITION_UNAVAILABLE:
          setError("Informação de localização não está disponível.");
          break;
        case error.TIMEOUT:
          setError("O pedido para obter a localização expirou.");
          break;
        default:
          setError("Ocorreu um erro desconhecido ao obter a localização.");
          break;
      }
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);

  }, []);

  if (error) {
    return <p style={{ color: 'orange' }}>{error}</p>;
  }

  return coords ? (
    <WeatherDisplay coords={coords} />
  ) : (
    <p>Obtendo sua localização... Por favor, aceite a solicitação do navegador.</p>
  );
}

export default LocalWeather;