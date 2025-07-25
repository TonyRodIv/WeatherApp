import { MdAdd, MdLocationPin, MdStar} from 'react-icons/md';
// import styles from './navigation.module.css';


function NavigationRail() {
    return (
        <nav className='navigationRail'>
            <button className='buttonAdd'><MdAdd size={30} color='white'/></button>
            <div>
                <button className='navAnchor'>
                    <div className='navAnchorActive'>
                        <MdLocationPin size={18}/>
                    </div>
                    Maceió
                </button>
                <button className='navAnchor'>
                    <div>
                        <MdStar size={18}/>
                    </div>
                    Cidade
                </button>
                <button className='navAnchor'>
                    <div>
                        <MdStar size={18}/>
                    </div>
                    Cidade
                </button>
            </div>
        </nav>
    );
}

export default NavigationRail
