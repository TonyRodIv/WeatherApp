import { useState } from 'react'; // 1. Importar o useState
import { MdAdd, MdLocationPin, MdStar } from 'react-icons/md';
import WeatherModal from './weatherModal'; // 2. Importar o componente do modal


function NavigationRail() {
    // 3. Criar o estado para controlar o modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 4. Funções para abrir e fechar o modal
    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    return (
        <>
            <nav className='navigationRail'>
                {/* 5. O botão agora chama a função para abrir o modal */}
                <button className='buttonAdd' onClick={openModal}>
                    <MdAdd size={30} color='white' />
                </button>
                <div>
                    <button className='navAnchor'>
                        <div className='navAnchorActive'>
                            <MdLocationPin size={18} />
                        </div>
                        Maceió
                    </button>
                    <button className='navAnchor'>
                        <div>
                            <MdStar size={18} />
                        </div>
                        Cidade
                    </button>
                </div>
            </nav>

            {/* 6. Renderização condicional: o modal só aparece se isModalOpen for true */}
            {isModalOpen && <WeatherModal onClose={closeModal} />}
        </>
    );
}

export default NavigationRail;