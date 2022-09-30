import { useNavigate } from 'react-router-dom'
import logger from '../utils/logger'
import './LE.css'

function LE() {
    logger.debug('LE -> render')

    const navigate = useNavigate()

    const goToHome = () => navigate('/')
    
    return <div className="le" >
        <h1 className='le-text clickable' onClick={goToHome}>L E</h1>
    </div>
}

export default LE