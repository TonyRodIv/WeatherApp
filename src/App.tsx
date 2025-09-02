import { useState } from "react";
import LocalWeather from "./components/LocalWeather";
import NavigationRail from "./components/navigation";
import WeatherModal from "./components/weatherModal";

function App() {
  const [currentLocation, setCurrentLocation] = useState("Minha localização"); 
  const [cities, setCities] = useState<string[]>([]);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddCity = (city: string) => {
    setCities((prev) => [...prev, city]); 
    setActiveCity(city); // já troca pra nova cidade
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
            <LocalWeather city={activeCity} />
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
