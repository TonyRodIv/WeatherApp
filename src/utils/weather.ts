import type { DailyForecast, ForecastEntry, ForecastResponse, WeatherCondition } from "../types/weather";

const WEEKDAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/**
 * Converte uma resposta /forecast (entradas a cada 3h) em um array de até 5 dias
 * com mínimas, máximas, condição predominante e probabilidade de chuva.
 */
export function groupForecastByDay(response: ForecastResponse): DailyForecast[] {
  const buckets = new Map<string, ForecastEntry[]>();

  for (const entry of response.list) {
    const local = new Date((entry.dt + response.city.timezone) * 1000);
    const key = `${local.getUTCFullYear()}-${local.getUTCMonth()}-${local.getUTCDate()}`;
    const list = buckets.get(key) ?? [];
    list.push(entry);
    buckets.set(key, list);
  }

  const today = new Date();
  const todayKey = `${today.getUTCFullYear()}-${today.getUTCMonth()}-${today.getUTCDate()}`;

  const days: DailyForecast[] = [];
  for (const [key, entries] of buckets.entries()) {
    if (key === todayKey) continue;

    const temps = entries.map((e) => e.main.temp);
    const minsByEntry = entries.map((e) => e.main.temp_min);
    const maxsByEntry = entries.map((e) => e.main.temp_max);

    const tempMin = Math.min(...minsByEntry, ...temps);
    const tempMax = Math.max(...maxsByEntry, ...temps);
    const pop = Math.max(...entries.map((e) => e.pop ?? 0));
    const condition = pickRepresentativeCondition(entries, response.city.timezone);

    const sampleDate = new Date((entries[0].dt + response.city.timezone) * 1000);
    days.push({
      date: sampleDate,
      weekdayLabel: WEEKDAYS_PT[sampleDate.getUTCDay()],
      tempMin,
      tempMax,
      condition,
      pop,
    });
  }

  return days.slice(0, 5);
}

/**
 * Escolhe a condição mais relevante do dia priorizando entradas próximas ao meio-dia local
 * para evitar pegar uma condição de madrugada como "representativa".
 */
function pickRepresentativeCondition(
  entries: ForecastEntry[],
  timezoneOffset: number
): WeatherCondition {
  let best = entries[0];
  let bestDistance = Infinity;
  for (const entry of entries) {
    const local = new Date((entry.dt + timezoneOffset) * 1000);
    const hours = local.getUTCHours();
    const distance = Math.abs(hours - 12);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = entry;
    }
  }
  return best.weather[0];
}

export function getOpenWeatherIconUrl(icon: string, size: 2 | 4 = 2): string {
  return `https://openweathermap.org/img/wn/${icon}@${size}x.png`;
}

export function formatTimeFromUnix(unix: number, timezoneOffset: number): string {
  const local = new Date((unix + timezoneOffset) * 1000);
  const h = local.getUTCHours().toString().padStart(2, "0");
  const m = local.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Mapeia condições principais do OpenWeather para mensagens em PT-BR.
 */
export function weatherMainToMessage(main: string): string {
  switch (main) {
    case "Thunderstorm":
      return "Tem uma <span class='weatherMessageSpan'>Tempestade</span> rolando!";
    case "Drizzle":
      return "Tá caindo uma <span class='weatherMessageSpan'>Garoa</span> leve.";
    case "Rain":
      return "Está <span class='weatherMessageSpan'>Chovendo</span> por aqui.";
    case "Snow":
      return "Está <span class='weatherMessageSpan'>Nevando</span> agora.";
    case "Clouds":
      return "Está bem <span class='weatherMessageSpan'>Nublado</span> agora.";
    case "Clear":
      return "O céu está <span class='weatherMessageSpan'>Limpo</span> agora.";
    case "Mist":
    case "Fog":
      return "Tem <span class='weatherMessageSpan'>Neblina</span> no ar.";
    case "Smoke":
      return "Há <span class='weatherMessageSpan'>Fumaça</span> no ar.";
    case "Haze":
      return "O ar está <span class='weatherMessageSpan'>Embaçado</span>.";
    case "Dust":
    case "Sand":
      return "Tem <span class='weatherMessageSpan'>Poeira</span> no ar.";
    case "Ash":
      return "Há <span class='weatherMessageSpan'>Cinzas</span> no ar.";
    case "Squall":
      return "Atenção: <span class='weatherMessageSpan'>Rajadas</span> fortes.";
    case "Tornado":
      return "Cuidado: <span class='weatherMessageSpan'>Tornado</span> na região!";
    default:
      return `Condição: <span class='weatherMessageSpan'>${main}</span>.`;
  }
}
