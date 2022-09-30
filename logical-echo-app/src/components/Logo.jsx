import logger from '../utils/logger'
import './Logo.css'

function Logo() {
    logger.debug('Logo -> render')
    
    return <div className="logo" >
        <span className='logo__text logical'>Logical</span> 
        <span className='logo__text echo'><span>Ec</span><span className='color--hover'>h</span><span>o</span></span>
    </div>
}

export default Logo