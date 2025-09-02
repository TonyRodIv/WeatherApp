import { MdAdd, MdLocationPin, MdStar } from "react-icons/md";

interface NavigationRailProps {
  currentLocation: string;
  cities: string[];
  activeCity: string | null;
  onSelectCity: (city: string) => void;
  onAddCity: () => void;
}

function NavigationRail({ currentLocation, cities, activeCity, onSelectCity, onAddCity }: NavigationRailProps) {
  return (
    <nav className="navigationRail">
      <button className="buttonAdd" onClick={onAddCity}>
        <MdAdd size={30} color="white" />
      </button>

      <div>
        <button
          className="navAnchor"
          onClick={() => onSelectCity(currentLocation)}
        >
          <div className={`navAnchorIcon ${activeCity === currentLocation ? "navAnchorActive" : ""}`}>
            <MdStar size={18} />
          </div>
          {currentLocation}
        </button>
        
        {cities.map((city, index) => (
          <button
            key={index}
            className="navAnchor"
            onClick={() => onSelectCity(city)}
          >
            <div className={`navAnchorIcon ${activeCity === city ? "navAnchorActive" : ""}`}>
              <MdLocationPin size={18} />
            </div>
            {city}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default NavigationRail;