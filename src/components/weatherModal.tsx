// Arquivo: WeatherModal.js
import { MdClose } from 'react-icons/md';

// O componente recebe a função 'onClose' como uma propriedade (prop)
interface WeatherModalProps {
    onClose: () => void;
}

function WeatherModal({ onClose }: WeatherModalProps) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    <MdClose size={24} color='white'/>
                </button>

                <h2>Adicionar Nova Cidade</h2>
                <input type="text" placeholder="Digite o nome da cidade..." className='inputCity' />
                <button className="search-button">Buscar</button>
            </div>
        </div>
    );
}

export default WeatherModal;