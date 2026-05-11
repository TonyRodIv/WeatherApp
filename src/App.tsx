import { useCallback, useEffect, useState } from "react";
import LocalWeather from "./components/LocalWeather";
import NavigationRail from "./components/navigation";
import WeatherModal from "./components/weatherModal";
import AdminPanel from "./components/AdminPanel";
import type { WeatherUpdate } from "./components/WeatherDisplay";
import {
  ADMIN_CITY,
  getPreset,
  isAdminQuery,
  type PresetId,
} from "./utils/adminPresets";

const DEFAULT_LOCATION_LABEL = "Localização…";

function App() {
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION_LABEL);
  const [cities, setCities] = useState<string[]>(() => {
    const saved = localStorage.getItem("weatherAppCities");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState<string | null>(null);
  const [isDay, setIsDay] = useState<boolean>(true);

  /* Modo admin (predefinições) */
  const [adminPreset, setAdminPreset] = useState<PresetId>("clear-day");

  useEffect(() => {
    localStorage.setItem("weatherAppCities", JSON.stringify(cities));
  }, [cities]);

  const handleAddCity = useCallback(
    (rawCity: string) => {
      const normalized = rawCity.trim();
      if (!normalized) return;

      /* Easter egg: 'admtest' adiciona o modo administrador. */
      if (isAdminQuery(normalized)) {
        setCities((prev) =>
          prev.includes(ADMIN_CITY) ? prev : [...prev, ADMIN_CITY]
        );
        setActiveCity(ADMIN_CITY);
        return;
      }

      setCities((prev) =>
        prev.includes(normalized) || normalized === currentLocation
          ? prev
          : [...prev, normalized]
      );
      setActiveCity(normalized);
    },
    [currentLocation]
  );

  const handleDeleteCity = useCallback(
    (cityToDelete: string) => {
      setCities((prev) => prev.filter((c) => c !== cityToDelete));
      setActiveCity((current) =>
        current === cityToDelete ? currentLocation : current
      );
    },
    [currentLocation]
  );

  const handleCurrentLocationLoad = useCallback((name: string) => {
    setCurrentLocation(name);
    setActiveCity((current) => current ?? name);
  }, []);

  const handleWeatherChange = useCallback((update: WeatherUpdate) => {
    setWeatherCondition(update.main);
    setIsDay(update.isDay);
  }, []);

  const isAdminMode = activeCity === ADMIN_CITY;
  const adminData = isAdminMode ? getPreset(adminPreset) : null;

  /* Quando entra/sai do admin mode, sincroniza weatherCondition pro tema. */
  useEffect(() => {
    if (adminData) {
      const icon = adminData.weather.weather[0].icon;
      setWeatherCondition(adminData.weather.weather[0].main);
      setIsDay(icon.endsWith("d"));
    }
  }, [adminData]);

  /* Garante que o tema retorna a 'Clear' se nenhum clima foi definido. */
  const effectiveWeather = weatherCondition ?? "Clear";

  return (
    <div
      id="backgroundChanger"
      className="app-shell"
      data-weather={effectiveWeather}
      data-period={isDay ? "day" : "night"}
    >
      <div className="app-shell__layout">
        <NavigationRail
          currentLocation={currentLocation}
          cities={cities}
          activeCity={activeCity}
          onSelectCity={setActiveCity}
          onAddCity={() => setShowModal(true)}
          onDeleteCity={handleDeleteCity}
        />

        <main className="app-shell__content">
          <LocalWeather
            city={
              isAdminMode
                ? null
                : activeCity === currentLocation
                ? null
                : activeCity
            }
            onCityNameLoad={handleCurrentLocationLoad}
            onWeatherChange={handleWeatherChange}
            onRequestAddCity={() => setShowModal(true)}
            mockWeather={adminData?.weather ?? null}
            mockForecast={adminData?.forecast ?? null}
          />

          {isAdminMode && (
            <AdminPanel
              activePreset={adminPreset}
              onSelectPreset={(id) => setAdminPreset(id)}
            />
          )}
        </main>
      </div>

      {showModal && (
        <WeatherModal
          onClose={() => setShowModal(false)}
          onCitySelect={handleAddCity}
        />
      )}
    </div>
  );
}

export default App;
