import { useState, useEffect } from "react";
import LocalWeather from "./components/LocalWeather";
import NavigationRail from "./components/navigation";
import WeatherModal from "./components/weatherModal";

function App() {
  const [currentLocation, setCurrentLocation] = useState("Localização...");
  
  const [cities, setCities] = useState<string[]>(() => {
    const savedCities = localStorage.getItem("weatherAppCities");
    return savedCities ? JSON.parse(savedCities) : [];
  });

  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("weatherAppCities", JSON.stringify(cities));
  }, [cities]);

  const handleAddCity = (city: string) => {
    if (cities.includes(city) || currentLocation === city) {
      setActiveCity(city);
      return;
    }
    setCities((prev) => [...prev, city]);
    setActiveCity(city);
  };

  const handleCurrentLocationLoad = (name: string) => {
    setCurrentLocation(name);
    if (activeCity === null) {
      setActiveCity(name);
    }
  };

  return (
    <div id="backgroundChanger">
      <main className="mainContainer progressive-blur-container">
        <section className="weatherContainer conteudo-frontal">
          <NavigationRail
            currentLocation={currentLocation}
            cities={cities}
            activeCity={activeCity}
            onSelectCity={setActiveCity}
            onAddCity={() => setShowModal(true)}
          />

          <main className="weatherInfo">
            <LocalWeather 
              city={activeCity === currentLocation ? null : activeCity} 
              onCityNameLoad={handleCurrentLocationLoad} 
            />
          </main>
        </section>
      </main>

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