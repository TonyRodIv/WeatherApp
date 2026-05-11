import type { DailyForecast, WeatherData } from "../types/weather";

export const ADMIN_CITY = "AdminTest";

export type PresetId =
  | "clear-day"
  | "clear-night"
  | "clouds-day"
  | "clouds-night"
  | "rain-light"
  | "rain-heavy"
  | "thunderstorm"
  | "snow"
  | "mist"
  | "haze"
  | "tornado";

export interface WeatherPreset {
  id: PresetId;
  label: string;
  icon: string;
  emoji: string;
  weather: WeatherData;
  forecast: DailyForecast[];
}

interface WeatherFactoryInput {
  condition: string;
  description: string;
  icon: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  visibility?: number;
  pressure?: number;
}

/** Helper interno para evitar repetir campos comuns. */
function buildWeather(input: WeatherFactoryInput): WeatherData {
  const now = Math.floor(Date.now() / 1000);
  return {
    name: ADMIN_CITY,
    dt: now,
    timezone: -3 * 3600,
    main: {
      temp: input.temp,
      feels_like: input.feels_like,
      temp_min: input.temp_min,
      temp_max: input.temp_max,
      humidity: input.humidity,
      pressure: input.pressure ?? 1013,
    },
    weather: [
      {
        id: 0,
        main: input.condition,
        description: input.description,
        icon: input.icon,
      },
    ],
    wind: { speed: input.windSpeed, deg: input.windDeg },
    clouds: { all: 0 },
    visibility: input.visibility ?? 10000,
    sys: {
      country: "BR",
      sunrise: now - 5 * 3600,
      sunset: now + 5 * 3600,
    },
    coord: { lat: 0, lon: 0 },
  };
}

const WEEKDAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function buildForecast(
  baseTemp: number,
  conditions: Array<{ icon: string; main: string; description: string; pop?: number }>
): DailyForecast[] {
  const today = new Date();
  return conditions.map((c, idx) => {
    const date = new Date(today);
    date.setDate(today.getDate() + idx + 1);
    const drift = (idx - 2) * 1.5;
    return {
      date,
      weekdayLabel: WEEKDAYS_PT[date.getDay()],
      tempMin: baseTemp - 4 + drift,
      tempMax: baseTemp + 3 + drift,
      pop: c.pop ?? 0,
      condition: {
        id: 0,
        main: c.main,
        description: c.description,
        icon: c.icon,
      },
    };
  });
}

export const ADMIN_PRESETS: WeatherPreset[] = [
  {
    id: "clear-day",
    label: "Ensolarado",
    icon: "01d",
    emoji: "☀️",
    weather: buildWeather({
      condition: "Clear",
      description: "céu limpo",
      icon: "01d",
      temp: 29,
      feels_like: 31,
      temp_min: 24,
      temp_max: 33,
      humidity: 38,
      windSpeed: 3.5,
      windDeg: 120,
    }),
    forecast: buildForecast(29, [
      { icon: "01d", main: "Clear", description: "céu limpo" },
      { icon: "02d", main: "Clouds", description: "poucas nuvens", pop: 0.05 },
      { icon: "01d", main: "Clear", description: "céu limpo" },
      { icon: "01d", main: "Clear", description: "céu limpo" },
      { icon: "02d", main: "Clouds", description: "poucas nuvens", pop: 0.1 },
    ]),
  },
  {
    id: "clear-night",
    label: "Noite estrelada",
    icon: "01n",
    emoji: "🌙",
    weather: buildWeather({
      condition: "Clear",
      description: "céu limpo",
      icon: "01n",
      temp: 18,
      feels_like: 17,
      temp_min: 15,
      temp_max: 22,
      humidity: 55,
      windSpeed: 2.1,
      windDeg: 80,
    }),
    forecast: buildForecast(18, [
      { icon: "01d", main: "Clear", description: "céu limpo" },
      { icon: "02d", main: "Clouds", description: "poucas nuvens", pop: 0.05 },
      { icon: "01d", main: "Clear", description: "céu limpo" },
      { icon: "01d", main: "Clear", description: "céu limpo" },
      { icon: "02d", main: "Clouds", description: "poucas nuvens", pop: 0.1 },
    ]),
  },
  {
    id: "clouds-day",
    label: "Nublado",
    icon: "04d",
    emoji: "☁️",
    weather: buildWeather({
      condition: "Clouds",
      description: "nublado",
      icon: "04d",
      temp: 22,
      feels_like: 21,
      temp_min: 18,
      temp_max: 24,
      humidity: 68,
      windSpeed: 4.2,
      windDeg: 200,
    }),
    forecast: buildForecast(22, [
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.1 },
      { icon: "03d", main: "Clouds", description: "nuvens dispersas", pop: 0.05 },
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.2 },
      { icon: "10d", main: "Rain", description: "chuva leve", pop: 0.45 },
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.15 },
    ]),
  },
  {
    id: "clouds-night",
    label: "Nublado (noite)",
    icon: "04n",
    emoji: "☁️",
    weather: buildWeather({
      condition: "Clouds",
      description: "nublado",
      icon: "04n",
      temp: 17,
      feels_like: 16,
      temp_min: 14,
      temp_max: 19,
      humidity: 72,
      windSpeed: 3.2,
      windDeg: 180,
    }),
    forecast: buildForecast(17, [
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.1 },
      { icon: "03d", main: "Clouds", description: "nuvens dispersas", pop: 0.05 },
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.2 },
      { icon: "10d", main: "Rain", description: "chuva leve", pop: 0.45 },
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.15 },
    ]),
  },
  {
    id: "rain-light",
    label: "Chuva leve",
    icon: "10d",
    emoji: "🌦️",
    weather: buildWeather({
      condition: "Rain",
      description: "chuva moderada",
      icon: "10d",
      temp: 16,
      feels_like: 14,
      temp_min: 13,
      temp_max: 18,
      humidity: 88,
      windSpeed: 6.5,
      windDeg: 250,
    }),
    forecast: buildForecast(16, [
      { icon: "10d", main: "Rain", description: "chuva moderada", pop: 0.85 },
      { icon: "09d", main: "Rain", description: "chuva forte", pop: 0.95 },
      { icon: "10d", main: "Rain", description: "chuva leve", pop: 0.6 },
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.25 },
      { icon: "02d", main: "Clouds", description: "poucas nuvens", pop: 0.1 },
    ]),
  },
  {
    id: "rain-heavy",
    label: "Chuva forte",
    icon: "09n",
    emoji: "🌧️",
    weather: buildWeather({
      condition: "Rain",
      description: "chuva forte",
      icon: "09n",
      temp: 13,
      feels_like: 11,
      temp_min: 11,
      temp_max: 15,
      humidity: 94,
      windSpeed: 8.8,
      windDeg: 260,
    }),
    forecast: buildForecast(13, [
      { icon: "09d", main: "Rain", description: "chuva forte", pop: 0.95 },
      { icon: "10d", main: "Rain", description: "chuva moderada", pop: 0.85 },
      { icon: "10d", main: "Rain", description: "chuva leve", pop: 0.6 },
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.3 },
      { icon: "03d", main: "Clouds", description: "nuvens dispersas", pop: 0.15 },
    ]),
  },
  {
    id: "thunderstorm",
    label: "Tempestade",
    icon: "11n",
    emoji: "⛈️",
    weather: buildWeather({
      condition: "Thunderstorm",
      description: "tempestade com chuva",
      icon: "11n",
      temp: 19,
      feels_like: 18,
      temp_min: 16,
      temp_max: 22,
      humidity: 92,
      windSpeed: 9.8,
      windDeg: 280,
    }),
    forecast: buildForecast(19, [
      { icon: "11d", main: "Thunderstorm", description: "tempestade", pop: 0.95 },
      { icon: "10d", main: "Rain", description: "chuva", pop: 0.8 },
      { icon: "10d", main: "Rain", description: "chuva leve", pop: 0.55 },
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.3 },
      { icon: "03d", main: "Clouds", description: "nuvens dispersas", pop: 0.15 },
    ]),
  },
  {
    id: "snow",
    label: "Neve",
    icon: "13d",
    emoji: "❄️",
    weather: buildWeather({
      condition: "Snow",
      description: "queda de neve",
      icon: "13d",
      temp: -3,
      feels_like: -8,
      temp_min: -6,
      temp_max: 1,
      humidity: 78,
      windSpeed: 5.5,
      windDeg: 30,
    }),
    forecast: buildForecast(-3, [
      { icon: "13d", main: "Snow", description: "neve leve", pop: 0.7 },
      { icon: "13d", main: "Snow", description: "neve forte", pop: 0.9 },
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.4 },
      { icon: "13d", main: "Snow", description: "neve leve", pop: 0.55 },
      { icon: "02d", main: "Clouds", description: "poucas nuvens", pop: 0.1 },
    ]),
  },
  {
    id: "mist",
    label: "Neblina",
    icon: "50d",
    emoji: "🌫️",
    weather: buildWeather({
      condition: "Mist",
      description: "neblina densa",
      icon: "50d",
      temp: 14,
      feels_like: 13,
      temp_min: 12,
      temp_max: 16,
      humidity: 96,
      windSpeed: 1.8,
      windDeg: 90,
      visibility: 800,
    }),
    forecast: buildForecast(14, [
      { icon: "50d", main: "Mist", description: "neblina", pop: 0 },
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.1 },
      { icon: "10d", main: "Rain", description: "garoa", pop: 0.4 },
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.2 },
      { icon: "02d", main: "Clouds", description: "poucas nuvens", pop: 0.05 },
    ]),
  },
  {
    id: "haze",
    label: "Bruma",
    icon: "50d",
    emoji: "🌁",
    weather: buildWeather({
      condition: "Haze",
      description: "bruma seca",
      icon: "50d",
      temp: 27,
      feels_like: 30,
      temp_min: 24,
      temp_max: 30,
      humidity: 52,
      windSpeed: 2.5,
      windDeg: 110,
      visibility: 3000,
    }),
    forecast: buildForecast(27, [
      { icon: "50d", main: "Haze", description: "bruma", pop: 0 },
      { icon: "50d", main: "Haze", description: "bruma", pop: 0 },
      { icon: "02d", main: "Clouds", description: "poucas nuvens", pop: 0.05 },
      { icon: "01d", main: "Clear", description: "céu limpo" },
      { icon: "02d", main: "Clouds", description: "poucas nuvens", pop: 0.1 },
    ]),
  },
  {
    id: "tornado",
    label: "Tornado",
    icon: "50d",
    emoji: "🌪️",
    weather: buildWeather({
      condition: "Tornado",
      description: "tornado na região",
      icon: "50d",
      temp: 23,
      feels_like: 24,
      temp_min: 20,
      temp_max: 26,
      humidity: 85,
      windSpeed: 22.5,
      windDeg: 300,
      visibility: 1500,
    }),
    forecast: buildForecast(23, [
      { icon: "11d", main: "Thunderstorm", description: "tempestade", pop: 0.95 },
      { icon: "10d", main: "Rain", description: "chuva", pop: 0.8 },
      { icon: "04d", main: "Clouds", description: "nublado", pop: 0.4 },
      { icon: "03d", main: "Clouds", description: "nuvens dispersas", pop: 0.2 },
      { icon: "02d", main: "Clouds", description: "poucas nuvens", pop: 0.1 },
    ]),
  },
];

export function isAdminQuery(query: string): boolean {
  return query.trim().toLowerCase() === "admtest";
}

export function getPreset(id: PresetId): WeatherPreset {
  return ADMIN_PRESETS.find((p) => p.id === id) ?? ADMIN_PRESETS[0];
}
