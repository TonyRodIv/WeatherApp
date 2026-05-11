import { useEffect, useState } from "react";
import { MdLocationOn, MdLocationOff, MdRefresh, MdSearch } from "react-icons/md";
import WeatherDisplay, { type WeatherUpdate } from "./WeatherDisplay";
import GlassCard from "./ui/GlassCard";
import type { DailyForecast, WeatherData } from "../types/weather";

interface LocalWeatherProps {
  city: string | null;
  onCityNameLoad: (name: string) => void;
  onWeatherChange: (update: WeatherUpdate) => void;
  onRequestAddCity?: () => void;
  mockWeather?: WeatherData | null;
  mockForecast?: DailyForecast[] | null;
}

type LocationStage =
  | "idle"
  | "requesting-permission"
  | "locating"
  | "success"
  | "error"
  | "unsupported";

const STAGE_MESSAGES: Record<LocationStage, string> = {
  idle: "",
  "requesting-permission": "Pedindo permissão de localização…",
  locating: "Calculando sua posição com o GPS…",
  success: "",
  error: "",
  unsupported: "",
};

function LocalWeather({
  city,
  onCityNameLoad,
  onWeatherChange,
  onRequestAddCity,
  mockWeather,
  mockForecast,
}: LocalWeatherProps) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [stage, setStage] = useState<LocationStage>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (mockWeather) return;
    if (city) {
      return;
    }

    if (!("geolocation" in navigator)) {
      setStage("unsupported");
      setErrorMessage(
        "Seu navegador não suporta geolocalização. Adicione uma cidade manualmente."
      );
      return;
    }

    setStage("requesting-permission");
    setErrorMessage(null);
    setCoords(null);

    const watchTimeout = window.setTimeout(() => {
      setStage((current) =>
        current === "requesting-permission" ? "locating" : current
      );
    }, 700);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        window.clearTimeout(watchTimeout);
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setStage("success");
      },
      (err) => {
        window.clearTimeout(watchTimeout);
        const messages: Record<number, string> = {
          1: "Você bloqueou o acesso à localização. Permita nas configurações do navegador ou adicione uma cidade manualmente.",
          2: "Não conseguimos obter sua localização. Tente novamente ou adicione uma cidade.",
          3: "O tempo limite para obter a localização expirou.",
        };
        setErrorMessage(
          messages[err.code] ?? "Erro desconhecido ao obter localização."
        );
        setStage("error");
      },
      {
        enableHighAccuracy: false,
        timeout: 12_000,
        maximumAge: 5 * 60 * 1000,
      }
    );

    return () => window.clearTimeout(watchTimeout);
  }, [city, retryToken, mockWeather]);

  if (mockWeather) {
    return (
      <WeatherDisplay
        mockWeather={mockWeather}
        mockForecast={mockForecast}
        onWeatherChange={onWeatherChange}
      />
    );
  }

  if (city) {
    return <WeatherDisplay city={city} onWeatherChange={onWeatherChange} />;
  }

  if (stage === "requesting-permission" || stage === "locating") {
    return (
      <GlassCard className="location-status" role="status" aria-live="polite">
        <div className="location-status__icon location-status__icon--pulse">
          <MdLocationOn size={32} />
        </div>
        <h2 className="md-headline-large">Obtendo sua localização</h2>
        <p className="md-body-medium">{STAGE_MESSAGES[stage]}</p>
      </GlassCard>
    );
  }

  if (stage === "error" || stage === "unsupported") {
    return (
      <GlassCard className="location-status" role="alert">
        <div className="location-status__icon location-status__icon--error">
          <MdLocationOff size={32} />
        </div>
        <h2 className="md-headline-large">Localização indisponível</h2>
        <p className="md-body-medium">{errorMessage}</p>
        <div className="location-status__actions">
          {stage === "error" && (
            <button
              type="button"
              className="filled-button"
              onClick={() => setRetryToken((n) => n + 1)}
            >
              <MdRefresh size={20} aria-hidden="true" />
              Tentar novamente
            </button>
          )}
          {onRequestAddCity && (
            <button
              type="button"
              className="tonal-button"
              onClick={onRequestAddCity}
            >
              <MdSearch size={20} aria-hidden="true" />
              Buscar cidade
            </button>
          )}
        </div>
      </GlassCard>
    );
  }

  if (coords) {
    return (
      <WeatherDisplay
        coords={coords}
        onCityNameLoad={onCityNameLoad}
        onWeatherChange={onWeatherChange}
      />
    );
  }

  return null;
}

export default LocalWeather;
