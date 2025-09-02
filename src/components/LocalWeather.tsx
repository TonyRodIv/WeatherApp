import { useState, useEffect } from "react";
import WeatherDisplay from "./WeatherDisplay";

interface LocalWeatherProps {
  city: string | null;
  onCityNameLoad: (name: string) => void;
}

function LocalWeather({ city, onCityNameLoad }: LocalWeatherProps) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    if (city) {
      setIsLocating(false);
      return;
    }

    setIsLocating(true);
    setCoords(null);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setError(null);
        setIsLocating(false);
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "Você negou o pedido de Geolocalização. Ative nas configurações do navegador.",
          2: "Informação de localização indisponível.",
          3: "Tempo limite para obter localização expirou.",
        };
        setError(messages[err.code] || "Erro desconhecido ao obter localização.");
        setIsLocating(false);
      }
    );
  }, [city]);

  if (city) {
    return <WeatherDisplay city={city} />;
  }

  if (isLocating) {
    return (
      <p>
        Obtendo sua localização... <br />
        <div className="loader-wrapper">
          <div className="loader"></div>
        </div>
      </p>
    );
  }

  if (error) {
    return <p style={{ color: "orange" }}>{error}</p>;
  }

  if (coords) {
    return <WeatherDisplay coords={coords} onCityNameLoad={onCityNameLoad} />;
  }
  
  return null; 
}

export default LocalWeather;