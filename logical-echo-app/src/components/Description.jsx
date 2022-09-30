import logger from '../utils/logger'
import './Description.css'

function Description() {
    logger.debug('Description -> render')
    
    return <div className="description centered-axis-xy">
        <div className='description__motto'> 
            <span>Be</span> <span className='color--hover'><em>conscious</em>!</span> <span>Be</span> <span className='color--hover'><em>committed</em>!</span> <span>Join</span> <span>sustainable</span> <span>life!</span>
        </div>
        <div className='description__text'>Discover the sustainable collections of your beloved brands.</div>
    </div>
}

export default Description