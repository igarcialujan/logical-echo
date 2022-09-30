import logger from '../utils/logger'
import './Unregister.css'

function Unregister({ onUnregister, onBack }) {
    logger.debug('Unregister -> render')

    return <>
        <form className="unregister-form form container--vertical" onSubmit={event => {
            event.preventDefault()

            const password = event.target.password.value

            onUnregister(password)
        }}>
            <input className="field" type="password" name="password" id="unregister-password" placeholder="Password" />

            <div className="container">
                {/* <button type="button" className="button button--medium clickable" onClick={(event) => {
                    event.preventDefault()
                    
                    onBack()
                }}>Go Back</button> */}
                <button type="submit" className="button button--medium button--emphasized clickable">Unregister</button>
            </div>
        </form>
    </>
}

export default Unregister