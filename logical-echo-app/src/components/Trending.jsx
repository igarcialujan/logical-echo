import { useState, useEffect, useContext } from 'react'
import { retrieveTrendingItems } from '../logic'
import AppContext from './AppContext'
import logger from '../utils/logger'

function Trending({ onItem, onToggle }) {
    logger.debug('Trending -> render')

    const { onFlowStart, onFlowEnd, onModal } = useContext(AppContext)

    const [items, setItems] = useState([])

    const { token } = sessionStorage

    useEffect(() => {
        (async () => {
            logger.debug('Trending -> useEffect')

            try {
                onFlowStart()

                const items = await retrieveTrendingItems(token)

                onFlowEnd()
                    
                setItems(items)

            } catch ({ message }) {
                onFlowEnd()

                onModal(message, 'error')
            }
        })()
    }, [token]);

    return items && items.length ?
        <div>
            <ul className="results container container--vertical">
                {
                    items.map(({ item_id, name, images, price, isFav }) =>
                    <li key={item_id}className="home__results-item clickable" onClick={() => onItem(item_id)}>
                        <h2>{name}</h2>
                        <span>{price}</span>
                        <img src={images[0]} alt='' />
                        <button className="button fav-button clickable" onClick={event => {
                                event.stopPropagation()
    
                                onToggle(item_id)
                            }}>{isFav ? '🧡' : '🤍'}</button>
                    </li>
                    )
                }
            </ul>  
        </div>
        :
        null
}

export default Trending