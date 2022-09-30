import logger from '../utils/logger'
import './HamburgerLine.css'

function HamburgerLine() {
    logger.debug('HamburgerLine -> render')
    
    return <div className="hamburger-line">
        <label htmlFor="">
            <span>Scroll</span>
        </label>
    </div>
}

export default HamburgerLine