import { useLocation, useNavigate } from 'react-router-dom'
import logger from '../utils/logger'
import './Footer.css'

function Footer() {
    logger.debug('Footer -> render')

    const location = useLocation()
    const navigate = useNavigate()

    // const goToContact = () => navigate('/contact')
    // const goToNewsletter = () => navigate('/newsletter')
    
    return <div className="footer">
        {/* <button type='button' className={`button-contact button button--medium clickable ${location.pathname === '/contact' && 'button--emphasized'}`} onClick={goToContact}>Contact</button> 
        <button type='button' className={`button-newsletter button button--medium clickable ${location.pathname === '/newsletter' && 'button--emphasized'}`} onClick={goToNewsletter}>Newsletter</button> */}
    </div>
}

export default Footer