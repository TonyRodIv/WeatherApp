import { MdAdd, MdLocationPin, MdStar } from "react-icons/md";

interface NavigationRailProps {
  currentCity: string; // cidade detectada via geolocalização
  cities: string[];    // cidades adicionadas manualmente
  activeCity: string;  // cidade atualmente selecionada
  onSelectCity: (city: string) => void;
  onAddCity: () => void;
}

function NavigationRail({ currentCity, cities, activeCity, onSelectCity, onAddCity }: NavigationRailProps) {
  return (
    <nav className="navigationRail">
      <button className="buttonAdd" onClick={onAddCity}>
        <MdAdd size={30} color="white" />
      </button>

      <div>
        {/* Localização atual */}
        <button
          className={`navAnchor ${activeCity === currentCity ? "navAnchorActive" : ""}`}
          onClick={() => onSelectCity(currentCity)}
        >
          <div className="navAnchorIcon">
            <MdLocationPin size={18} />
          </div>
          {currentCity}
        </button>

        {/* Outras cidades adicionadas */}
        {cities.map((city, index) => (
          <button
            key={index}
            className={`navAnchor ${activeCity === city ? "navAnchorActive" : ""}`}
            onClick={() => onSelectCity(city)}
          >
            <div className="navAnchorIcon">
              <MdStar size={18} />
            </div>
            {city}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default NavigationRail;
