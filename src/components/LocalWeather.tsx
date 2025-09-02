import { useState, useEffect } from "react";
import WeatherDisplay from "./WeatherDisplay";

interface LocalWeatherProps {
  city: string | null; // null = usar geolocalização
}

function LocalWeather({ city }: LocalWeatherProps) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // se tem cidade escolhida, não precisa pegar geolocalização
    if (city) return;

    if (!navigator.geolocation) {
      setError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "Você negou o pedido de Geolocalização. Ative nas configurações do navegador.",
          2: "Informação de localização indisponível.",
          3: "Tempo limite para obter localização expirou.",
        };
        setError(messages[err.code] || "Erro desconhecido ao obter localização.");
      }
    );
  }, [city]);

  // se houve erro
  if (error) {
    return <p style={{ color: "orange" }}>{error}</p>;
  }

  // se veio cidade escolhida no modal
  if (city) {
    return <WeatherDisplay city={city} />;
  }

  // fallback para geolocalização
  return coords ? (
    <WeatherDisplay coords={coords} />
  ) : (
    <p>
      Obtendo sua localização... <br />
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    </p>
  );
}

export default LocalWeather;
