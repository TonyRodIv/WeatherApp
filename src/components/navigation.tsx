import { useEffect, useState } from "react";
import { MdAdd, MdLocationPin, MdStar, MdDelete } from "react-icons/md";

interface NavigationRailProps {
  currentLocation: string;
  cities: string[];
  activeCity: string | null;
  onSelectCity: (city: string) => void;
  onAddCity: () => void;
  onDeleteCity: (city: string) => void;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  city: string | null;
}

const INITIAL_CONTEXT: ContextMenuState = {
  visible: false,
  x: 0,
  y: 0,
  city: null,
};

function NavigationRail({
  currentLocation,
  cities,
  activeCity,
  onSelectCity,
  onAddCity,
  onDeleteCity,
}: NavigationRailProps) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(INITIAL_CONTEXT);

  useEffect(() => {
    if (!contextMenu.visible) return;
    const close = () => setContextMenu(INITIAL_CONTEXT);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [contextMenu.visible]);

  const handleContextMenu = (event: React.MouseEvent, city: string) => {
    event.preventDefault();
    const safeX = Math.min(event.pageX, window.innerWidth - 180);
    const safeY = Math.min(event.pageY, window.innerHeight - 80);
    setContextMenu({ visible: true, x: safeX, y: safeY, city });
  };

  const handleDelete = () => {
    if (contextMenu.city) onDeleteCity(contextMenu.city);
    setContextMenu(INITIAL_CONTEXT);
  };

  return (
    <nav className="navigationRail" aria-label="Cidades salvas">
      <button
        type="button"
        className="buttonAdd"
        onClick={onAddCity}
        aria-label="Adicionar cidade"
      >
        <MdAdd size={30} color="white" />
      </button>

      <div className="navigationRail__list">
        <button
          type="button"
          className="navAnchor"
          onClick={() => onSelectCity(currentLocation)}
          aria-current={activeCity === currentLocation ? "page" : undefined}
          title={currentLocation}
        >
          <div
            className={`navAnchorIcon ${
              activeCity === currentLocation ? "navAnchorActive" : ""
            }`}
          >
            <MdStar size={18} />
          </div>
          <span className="navAnchorLabel">{currentLocation}</span>
        </button>

        {cities.map((city) => (
          <button
            key={city}
            type="button"
            className="navAnchor"
            onClick={() => onSelectCity(city)}
            onContextMenu={(e) => handleContextMenu(e, city)}
            aria-current={activeCity === city ? "page" : undefined}
            title={city}
          >
            <div
              className={`navAnchorIcon ${
                activeCity === city ? "navAnchorActive" : ""
              }`}
            >
              <MdLocationPin size={18} />
            </div>
            <span className="navAnchorLabel">{city}</span>
          </button>
        ))}
      </div>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          role="menu"
        >
          <button
            type="button"
            className="context-menu-item"
            onClick={handleDelete}
            role="menuitem"
          >
            <MdDelete size={18} aria-hidden="true" />
            Remover cidade
          </button>
        </div>
      )}
    </nav>
  );
}

export default NavigationRail;
