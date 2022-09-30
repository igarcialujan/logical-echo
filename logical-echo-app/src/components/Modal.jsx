import logger from '../utils/logger'
import './Modal.css'

function Modal({ level, message, onAccept }) {
    logger.debug('Modal -> render')

    if (level === 'success')
        logger.info(message)
    else if (level === 'warn')
        logger.warn(message)
    else if (level === 'error')
        logger.error(message)

    const className = `modal__message ${level ? `modal__message--${level}` : ''}`

    return <>
        <div className='container container--vertical modal'>
            <div className='container container--vertical modal__panel'>
                {/* <h1 className='modal__title'>{level}</h1> */}
                <p className={className}>{message}</p>
                <button className='button modal__button button--emphasized clickable' type='button' onClick={onAccept}>Accept</button>
            </div>
        </div>
    </>
}

export default Modal