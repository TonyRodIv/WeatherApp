import { useEffect, useRef, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";

interface WeatherModalProps {
  onClose: () => void;
  onCitySelect: (city: string) => void;
}

function WeatherModal({ onClose, onCitySelect }: WeatherModalProps) {
  const [city, setCity] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = city.trim();
    if (!trimmed) return;
    onCitySelect(trimmed);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal-content glass-surface--strong"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          type="button"
          className="modal-content__close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <MdClose size={22} />
        </button>

        <header className="modal-content__header">
          <h2 id="modal-title" className="md-headline-large">
            Adicionar cidade
          </h2>
          <p className="md-body-medium modal-content__hint">
            Digite o nome da cidade (ex.: "São Paulo", "Lisbon").
          </p>
        </header>

        <form onSubmit={submit} className="modal-content__form">
          <label className="text-field">
            <MdSearch size={20} className="text-field__icon" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Nome da cidade"
              className="text-field__input"
              aria-label="Nome da cidade"
            />
          </label>

          <div className="modal-content__actions">
            <button
              type="button"
              className="text-button"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="filled-button"
              disabled={!city.trim()}
            >
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WeatherModal;
