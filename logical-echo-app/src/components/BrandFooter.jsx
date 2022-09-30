import logger from '../utils/logger'
import './BrandFooter.css'

function BrandFooter({ type }) {
    logger.debug('BrandFooter -> render')
    
    return <div className="brand-footer">
        <span className='brand-footer__text'>{type}</span>
    </div>
}

export default BrandFooter