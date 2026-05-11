import { MdScience } from "react-icons/md";
import { ADMIN_PRESETS, type PresetId } from "../utils/adminPresets";
import { getOpenWeatherIconUrl } from "../utils/weather";

interface AdminPanelProps {
  activePreset: PresetId;
  onSelectPreset: (id: PresetId) => void;
}

function AdminPanel({ activePreset, onSelectPreset }: AdminPanelProps) {
  return (
    <section
      className="admin-panel glass-surface stagger-item"
      style={{ animationDelay: "560ms" }}
      aria-label="Modo administrador: predefinições de clima"
    >
      <header className="admin-panel__header">
        <span className="admin-panel__badge">
          <MdScience size={16} aria-hidden="true" />
          Modo teste
        </span>
        <h2 className="md-title-medium">Trocar condição</h2>
        <p className="admin-panel__hint">
          Escolha um preset para visualizar diferentes climas sem chamar a API.
        </p>
      </header>

      <div className="admin-panel__grid">
        {ADMIN_PRESETS.map((preset) => {
          const isActive = preset.id === activePreset;
          return (
            <button
              key={preset.id}
              type="button"
              className={`admin-preset ${isActive ? "admin-preset--active" : ""}`}
              onClick={() => onSelectPreset(preset.id)}
              aria-pressed={isActive}
            >
              <img
                src={getOpenWeatherIconUrl(preset.icon, 2)}
                alt=""
                width={48}
                height={48}
                className="admin-preset__icon"
              />
              <span className="admin-preset__label">{preset.label}</span>
              <span className="admin-preset__temp">
                {Math.round(preset.weather.main.temp)}°
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default AdminPanel;
