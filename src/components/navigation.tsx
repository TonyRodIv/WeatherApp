import { useState, useEffect } from "react";
import { MdAdd, MdLocationPin, MdStar } from "react-icons/md";

interface NavigationRailProps {
  currentLocation: string;
  cities: string[];
  activeCity: string | null;
  onSelectCity: (city: string) => void;
  onAddCity: () => void;
  onDeleteCity: (city: string) => void;
}

function NavigationRail({ currentLocation, cities, activeCity, onSelectCity, onAddCity, onDeleteCity }: NavigationRailProps) {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    city: string | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    city: null,
  });

  // Efeito para fechar o menu ao clicar em qualquer lugar da tela
  useEffect(() => {
    const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
    if (contextMenu.visible) {
      window.addEventListener('click', handleClick);
    }
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [contextMenu]);

  const handleContextMenu = (event: React.MouseEvent, city: string) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      city: city,
    });
  };

  const handleDelete = () => {
    if (contextMenu.city) {
      onDeleteCity(contextMenu.city);
    }
    setContextMenu({ ...contextMenu, visible: false });
  };

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
            onContextMenu={(e) => handleContextMenu(e, city)} // Adiciona o evento de clique direito
          >
            <div className={`navAnchorIcon ${activeCity === city ? "navAnchorActive" : ""}`}>
              <MdLocationPin size={18} />
            </div>
            {city}
          </button>
        ))}
      </div>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div className="context-menu-item" onClick={handleDelete}>
            Deletar
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavigationRail;