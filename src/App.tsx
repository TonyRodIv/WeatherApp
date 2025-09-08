import { useState, useEffect } from "react";
import LocalWeather from "./components/LocalWeather";
import NavigationRail from "./components/navigation";
import WeatherModal from "./components/weatherModal";
import BackgroundChanger from "./components/backgroundChanger";

const weatherBackgrounds: Record<string, string> = {
  Thunderstorm: 'https://raw.githubusercontent.com/TonyRodIv/WeatherApp/34b36747333eb54aaeb92936c8532b2d743a8dd8/public/weatherBg/thunderstormWeather.svg',
  Drizzle: 'https://raw.githubusercontent.com/TonyRodIv/WeatherApp/a1a0c2a0cb5f9023e12d46ecf22173ef27a6b69a/public/weatherBg/rainWeather.svg',
  Rain: 'https://raw.githubusercontent.com/TonyRodIv/WeatherApp/a1a0c2a0cb5f9023e12d46ecf22173ef27a6b69a/public/weatherBg/rainWeather.svg',
  Snow: 'https://raw.githubusercontent.com/TonyRodIv/WeatherApp/a1a0c2a0cb5f9023e12d46ecf22173ef27a6b69a/public/weatherBg/snowWeather.svg',
  Mist: 'https://raw.githubusercontent.com/TonyRodIv/WeatherApp/79eefce567fae93e33b780d48507740a3ec08be3/public/weatherBg/mistWeather.svg',
  Clouds: 'https://raw.githubusercontent.com/TonyRodIv/WeatherApp/007745ed16bfce3d08f68037dcbd368d56846ad4/public/weatherBg/cloudsWeather.svg',
  Clear: 'https://raw.githubusercontent.com/TonyRodIv/WeatherApp/007745ed16bfce3d08f68037dcbd368d56846ad4/public/weatherBg/clearWeather.svg',
};

function App() {
  const [currentLocation, setCurrentLocation] = useState("Localização...");
  const [cities, setCities] = useState<string[]>(() => {
    const savedCities = localStorage.getItem("weatherAppCities");
    return savedCities ? JSON.parse(savedCities) : [];
  });
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(weatherBackgrounds['Clear']); // Imagem padrão

  useEffect(() => {
    localStorage.setItem("weatherAppCities", JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    if (weatherCondition) {
      const newImage = weatherBackgrounds[weatherCondition] || weatherBackgrounds['Clear'];
      setBackgroundImage(newImage);
    }
  }, [weatherCondition]);

  const handleAddCity = (city: string) => {
    if (cities.includes(city) || currentLocation === city) {
      setActiveCity(city);
      return;
    }
    setCities((prev) => [...prev, city]);
    setActiveCity(city);
  };

  const handleDeleteCity = (cityToDelete: string) => {
    setCities(cities.filter(city => city !== cityToDelete));
    if (activeCity === cityToDelete) {
      setActiveCity(currentLocation);
    }
  };

  const handleCurrentLocationLoad = (name: string) => {
    setCurrentLocation(name);
    if (activeCity === null) {
      setActiveCity(name);
    }
  };

  const handleWeatherChange = (weather: string) => {
    setWeatherCondition(weather);
  };

  return (
    <div 
      id="backgroundChanger" 
      className="weather-background" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <BackgroundChanger imageUrl={backgroundImage} />
      <main className="mainContainer progressive-blur-container">
        <section className="weatherContainer conteudo-frontal">
          <NavigationRail
            currentLocation={currentLocation}
            cities={cities}
            activeCity={activeCity}
            onSelectCity={setActiveCity}
            onAddCity={() => setShowModal(true)}
            onDeleteCity={handleDeleteCity}
          />

          <main className="weatherInfo">
            <LocalWeather 
              city={activeCity === currentLocation ? null : activeCity} 
              onCityNameLoad={handleCurrentLocationLoad} 
              onWeatherChange={handleWeatherChange}
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