import { useEffect, useMemo, useState } from "react";
import {
  MdAir,
  MdOpacity,
  MdThermostat,
  MdVisibility,
  MdWbSunny,
  MdNightlight,
  MdRefresh,
  MdNavigation,
} from "react-icons/md";
import type {
  DailyForecast,
  ForecastResponse,
  WeatherData,
} from "../types/weather";
import {
  formatTimeFromUnix,
  getOpenWeatherIconUrl,
  groupForecastByDay,
  weatherMainToMessage,
} from "../utils/weather";
import GlassCard from "./ui/GlassCard";
import HighlightCard from "./ui/HighlightCard";
import ProgressBar from "./ui/ProgressBar";
import WindCompass, { degreesToCardinal } from "./ui/WindCompass";
import AnimatedNumber from "./ui/AnimatedNumber";
import Skeleton from "./ui/Skeleton";
import ForecastCard from "./ForecastCard";

export interface WeatherUpdate {
  main: string;
  isDay: boolean;
}

interface WeatherDisplayProps {
  city?: string | null;
  coords?: { lat: number; lon: number } | null;
  onCityNameLoad?: (name: string) => void;
  onWeatherChange?: (update: WeatherUpdate) => void;
  /**
   * Modo mock: quando fornecido, o componente pula o fetch e renderiza
   * diretamente os dados (usado pelo modo Admin).
   */
  mockWeather?: WeatherData | null;
  mockForecast?: DailyForecast[] | null;
}

/**
 * O ícone do OpenWeather tem o sufixo 'd' (dia) ou 'n' (noite).
 * Ex.: '01d' = sol de dia, '01n' = lua de noite.
 */
function iconIsDay(icon: string): boolean {
  return icon.endsWith("d");
}

type FetchStatus = "idle" | "loading" | "success" | "error";

const API_BASE = "https://api.openweathermap.org/data/2.5";
const MIN_LOADING_MS = 500;

function WeatherDisplay({
  city,
  coords,
  onCityNameLoad,
  onWeatherChange,
  mockWeather,
  mockForecast,
}: WeatherDisplayProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(
    mockWeather ?? null
  );
  const [forecast, setForecast] = useState<DailyForecast[] | null>(
    mockForecast ?? null
  );
  const [status, setStatus] = useState<FetchStatus>(
    mockWeather ? "success" : "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [retryCounter, setRetryCounter] = useState(0);

  /* Modo mock: sincroniza com props sempre que mudarem (sem fetch). */
  useEffect(() => {
    if (mockWeather) {
      setWeatherData(mockWeather);
      setForecast(mockForecast ?? []);
      setStatus("success");
      setError(null);
      if (onWeatherChange) {
        onWeatherChange({
          main: mockWeather.weather[0].main,
          isDay: iconIsDay(mockWeather.weather[0].icon),
        });
      }
    }
  }, [mockWeather, mockForecast, onWeatherChange]);

  useEffect(() => {
    if (mockWeather) return;
    if (!city && !coords) {
      setError("Nenhuma localização fornecida.");
      setStatus("error");
      return;
    }

    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY as
      | string
      | undefined;
    if (!apiKey) {
      setError(
        "Chave da API não encontrada. Adicione VITE_OPENWEATHER_API_KEY no arquivo .env."
      );
      setStatus("error");
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({
      appid: apiKey,
      units: "metric",
      lang: "pt_br",
    });
    if (coords) {
      params.set("lat", String(coords.lat));
      params.set("lon", String(coords.lon));
    } else if (city) {
      params.set("q", city);
    }

    const currentUrl = `${API_BASE}/weather?${params.toString()}`;
    const forecastUrl = `${API_BASE}/forecast?${params.toString()}`;

    const fetchAll = async () => {
      setStatus("loading");
      setError(null);
      const minimumDelay = new Promise((r) => setTimeout(r, MIN_LOADING_MS));

      try {
        const [currentRes, forecastRes] = await Promise.all([
          fetch(currentUrl, { signal: controller.signal }),
          fetch(forecastUrl, { signal: controller.signal }),
        ]);

        if (currentRes.status === 401 || forecastRes.status === 401) {
          throw new Error(
            "Chave da API inválida ou ainda não ativada. Aguarde alguns minutos após criar a chave no OpenWeatherMap."
          );
        }
        if (currentRes.status === 404) {
          throw new Error("Localização não encontrada. Verifique o nome.");
        }
        if (!currentRes.ok) {
          throw new Error(`Erro do servidor (${currentRes.status}).`);
        }

        const currentJson = (await currentRes.json()) as WeatherData;
        await minimumDelay;

        setWeatherData(currentJson);
        if (coords && onCityNameLoad) onCityNameLoad(currentJson.name);
        if (onWeatherChange) {
          onWeatherChange({
            main: currentJson.weather[0].main,
            isDay: iconIsDay(currentJson.weather[0].icon),
          });
        }

        if (forecastRes.ok) {
          const forecastJson = (await forecastRes.json()) as ForecastResponse;
          setForecast(groupForecastByDay(forecastJson));
        } else {
          setForecast([]);
        }

        setStatus("success");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "Erro desconhecido."
        );
        setStatus("error");
      }
    };

    fetchAll();
    return () => controller.abort();
  }, [city, coords, onCityNameLoad, onWeatherChange, retryCounter, mockWeather]);

  const handleRetry = () => setRetryCounter((n) => n + 1);

  const message = useMemo(() => {
    if (!weatherData) return "";
    return weatherMainToMessage(weatherData.weather[0].main);
  }, [weatherData]);

  if (status === "loading" || status === "idle") {
    return <WeatherSkeleton />;
  }

  if (status === "error" || !weatherData) {
    return (
      <GlassCard className="error-card" role="alert">
        <h2 className="md-headline-large">Não foi possível carregar</h2>
        <p className="md-body-medium error-card__message">{error}</p>
        <button type="button" className="filled-button" onClick={handleRetry}>
          <MdRefresh size={20} aria-hidden="true" />
          Tentar de novo
        </button>
      </GlassCard>
    );
  }

  const { main, weather, wind, visibility, sys, timezone } = weatherData;
  const condition = weather[0];
  const cardinal = degreesToCardinal(wind.deg ?? 0);
  const windKmh = Math.round((wind.speed ?? 0) * 3.6);

  /* Visibilidade em km - máx 10km na API */
  const visibilityKm =
    typeof visibility === "number" ? visibility / 1000 : null;
  const visibilityPct =
    visibilityKm !== null ? Math.min(100, (visibilityKm / 10) * 100) : 0;

  return (
    <div className="weather-display">
      <section
        className="weather-display__hero stagger-item"
        style={{ animationDelay: "0ms" }}
        aria-live="polite"
      >
        <header className="weather-display__city md-body-medium">
          <span>{weatherData.name}</span>
          {sys.country && <span aria-hidden="true">• {sys.country}</span>}
        </header>

        <div className="weather-display__temp-row">
          <div className="weather-display__temp-block">
            <h1 className="md-display-large">
              <AnimatedNumber value={main.temp} duration={900} />°
            </h1>
            <p className="weather-display__feels">
              Sensação <strong>{Math.round(main.feels_like)}°</strong> · Máx{" "}
              {Math.round(main.temp_max)}° · Mín {Math.round(main.temp_min)}°
            </p>
          </div>

          <div className="weather-display__icon-wrap">
            <img
              className="weather-display__main-icon"
              src={getOpenWeatherIconUrl(condition.icon, 4)}
              alt={condition.description}
              width={150}
              height={150}
            />
            <div className="weather-display__icon-glow" aria-hidden="true" />
          </div>
        </div>

        <h2
          className="weatherMessage md-headline-large"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </section>

      <ForecastCard days={forecast} loading={forecast === null} />

      <section
        className="highlights-section"
        aria-label="Detalhes do clima"
      >
        <header className="highlights-section__header">
          <h2 className="md-title-medium">Destaques de hoje</h2>
        </header>

        <div className="highlights-grid">
          <HighlightCard
            title="Vento"
            className="stagger-item"
            style={{ animationDelay: "120ms" }}
          >
            <div className="highlight-card__row">
              <div>
                <span className="highlight-card__big-value">
                  <AnimatedNumber value={windKmh} />
                  <span className="highlight-card__unit">km/h</span>
                </span>
                <div className="highlight-card__sub">
                  <MdNavigation
                    size={14}
                    style={{
                      transform: `rotate(${wind.deg ?? 0}deg)`,
                      transition: "transform 600ms ease",
                    }}
                    aria-hidden="true"
                  />
                  {cardinal}
                </div>
              </div>
              <WindCompass degrees={wind.deg ?? 0} size={64} />
            </div>
          </HighlightCard>

          <HighlightCard
            title="Umidade"
            className="stagger-item"
            style={{ animationDelay: "180ms" }}
          >
            <span className="highlight-card__big-value">
              <AnimatedNumber value={main.humidity} />
              <span className="highlight-card__unit">%</span>
            </span>
            <ProgressBar
              value={main.humidity}
              helper={humidityHelper(main.humidity)}
              variant="cool"
            />
          </HighlightCard>

          <HighlightCard
            title="Visibilidade"
            className="stagger-item"
            style={{ animationDelay: "240ms" }}
          >
            <span className="highlight-card__big-value">
              {visibilityKm !== null ? (
                <>
                  <AnimatedNumber
                    value={visibilityKm}
                    format={(v) => v.toFixed(1)}
                  />
                  <span className="highlight-card__unit">km</span>
                </>
              ) : (
                <span className="highlight-card__unit">—</span>
              )}
            </span>
            {visibilityKm !== null && (
              <ProgressBar
                value={visibilityPct}
                helper={visibilityHelper(visibilityKm)}
                variant="default"
              />
            )}
          </HighlightCard>

          <HighlightCard
            title="Sensação térmica"
            className="stagger-item"
            style={{ animationDelay: "300ms" }}
          >
            <div className="highlight-card__icon-stat">
              <MdThermostat size={28} aria-hidden="true" />
              <span className="highlight-card__big-value">
                <AnimatedNumber value={main.feels_like} />°
              </span>
            </div>
            <span className="highlight-card__sub">
              Parece {Math.round(main.feels_like - main.temp)}° em relação à temperatura real
            </span>
          </HighlightCard>

          <HighlightCard
            title="Pressão"
            className="stagger-item"
            style={{ animationDelay: "360ms" }}
          >
            <span className="highlight-card__big-value">
              <AnimatedNumber value={main.pressure} />
              <span className="highlight-card__unit">hPa</span>
            </span>
            <span className="highlight-card__sub">
              {pressureHelper(main.pressure)}
            </span>
          </HighlightCard>

          <HighlightCard
            title="Sol"
            className="stagger-item"
            style={{ animationDelay: "420ms" }}
          >
            <div className="sun-times">
              <div className="sun-times__row">
                <MdWbSunny size={20} aria-hidden="true" />
                <div>
                  <span className="sun-times__label">Nascer</span>
                  <strong>{formatTimeFromUnix(sys.sunrise, timezone)}</strong>
                </div>
              </div>
              <div className="sun-times__row">
                <MdNightlight size={20} aria-hidden="true" />
                <div>
                  <span className="sun-times__label">Pôr</span>
                  <strong>{formatTimeFromUnix(sys.sunset, timezone)}</strong>
                </div>
              </div>
            </div>
          </HighlightCard>
        </div>
      </section>

      {/* Chips compactos com dados auxiliares */}
      <section className="quick-chips stagger-item" style={{ animationDelay: "480ms" }}>
        <span className="quick-chip">
          <MdAir size={16} aria-hidden="true" />
          Vento {windKmh} km/h
        </span>
        <span className="quick-chip">
          <MdOpacity size={16} aria-hidden="true" />
          {main.humidity}% umidade
        </span>
        {visibilityKm !== null && (
          <span className="quick-chip">
            <MdVisibility size={16} aria-hidden="true" />
            {visibilityKm.toFixed(1)} km
          </span>
        )}
      </section>
    </div>
  );
}

function humidityHelper(h: number): string {
  if (h < 30) return "Ar seco";
  if (h < 60) return "Confortável";
  if (h < 80) return "Úmido";
  return "Muito úmido";
}

function visibilityHelper(km: number): string {
  if (km < 1) return "Muito baixa";
  if (km < 4) return "Baixa";
  if (km < 8) return "Boa";
  return "Excelente";
}

function pressureHelper(p: number): string {
  if (p < 1000) return "Pressão baixa";
  if (p > 1020) return "Pressão alta";
  return "Pressão normal";
}

function WeatherSkeleton() {
  return (
    <div className="weather-display weather-display--loading">
      <section className="weather-display__hero">
        <Skeleton width={120} height={14} />
        <div className="weather-display__temp-row" style={{ marginTop: 16 }}>
          <Skeleton width={180} height={96} radius={20} />
          <Skeleton width={150} height={150} radius={75} />
        </div>
        <Skeleton width="70%" height={36} radius={12} style={{ marginTop: 28 }} />
      </section>

      <Skeleton height={170} radius={20} />

      <section className="highlights-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={140} radius={20} />
        ))}
      </section>
    </div>
  );
}

export default WeatherDisplay;
