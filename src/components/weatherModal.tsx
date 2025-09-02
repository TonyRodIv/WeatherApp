import { useState } from "react";
import { MdClose } from "react-icons/md";

interface WeatherModalProps {
  onClose: () => void;
  onCitySelect: (city: string) => void;
}

function WeatherModal({ onClose, onCitySelect }: WeatherModalProps) {
  const [city, setCity] = useState("");

  const submitCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city) return;
    onCitySelect(city);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <MdClose size={24} color="white" />
        </button>

        <h2>Adicionar Nova Cidade</h2>
        <form onSubmit={submitCity}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Digite uma cidade"
            className="inputCity"
          />
          <button type="submit" className="search-button">
            Buscar
          </button>
        </form>
      </div>
    </div>
  );
}

export default WeatherModal;
