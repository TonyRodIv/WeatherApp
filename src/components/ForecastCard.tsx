import { MdUmbrella } from "react-icons/md";
import Skeleton from "./ui/Skeleton";
import type { DailyForecast } from "../types/weather";
import { getOpenWeatherIconUrl } from "../utils/weather";

interface ForecastCardProps {
  days: DailyForecast[] | null;
  loading?: boolean;
}

function ForecastCard({ days, loading }: ForecastCardProps) {
  return (
    <section className="forecast-section" aria-label="Previsão para os próximos dias">
      <header className="forecast-section__header">
        <h2 className="md-title-medium">Próximos dias</h2>
        <span className="forecast-section__caption">5 dias</span>
      </header>

      {loading || !days ? (
        <div className="forecast-section__rail" role="status" aria-live="polite">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="forecast-day-card forecast-day-card--skeleton">
              <Skeleton width={40} height={12} />
              <Skeleton width={56} height={56} radius={28} />
              <Skeleton width={60} height={14} />
            </div>
          ))}
        </div>
      ) : days.length === 0 ? (
        <p className="forecast-section__empty">Sem dados de previsão.</p>
      ) : (
        <div className="forecast-section__rail">
          {days.map((d, idx) => (
            <article
              key={d.date.toISOString()}
              className="forecast-day-card stagger-item"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <header className="forecast-day-card__day">{d.weekdayLabel}</header>

              <div className="forecast-day-card__icon-wrap">
                <img
                  src={getOpenWeatherIconUrl(d.condition.icon, 2)}
                  alt={d.condition.description}
                  loading="lazy"
                  width={64}
                  height={64}
                  className="forecast-day-card__icon"
                />
                {d.pop > 0.1 && (
                  <span
                    className="forecast-day-card__pop"
                    title={`Chance de chuva: ${Math.round(d.pop * 100)}%`}
                  >
                    <MdUmbrella size={11} aria-hidden="true" />
                    {Math.round(d.pop * 100)}%
                  </span>
                )}
              </div>

              <footer className="forecast-day-card__temps">
                <span className="forecast-day-card__temp-max">
                  {Math.round(d.tempMax)}°
                </span>
                <span className="forecast-day-card__temp-sep" aria-hidden="true">
                  /
                </span>
                <span className="forecast-day-card__temp-min">
                  {Math.round(d.tempMin)}°
                </span>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ForecastCard;
