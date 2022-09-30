import { useQueryParams } from '../hooks'
import { useState, useEffect, useContext } from 'react'
import { searchItems, toggleFavItem } from '../logic'
import AppContext from './AppContext'
import logger from '../utils/logger'
import { gsap, ScrollTrigger, Draggable, CustomEase } from '../gsap'
import './Results.css'

function Results({ onItem }) {
    logger.debug('Results -> render')

    const { onFlowStart, onFlowEnd, onModal } = useContext(AppContext)

    const [items, setItems] = useState([])

    const queryParams = useQueryParams()

    const query = queryParams.get('q')

    const { token } = sessionStorage

    CustomEase.create('custom_one', '.77,0,.175,1')

    // useEffect 1: calling the searchItems function and setting the items state
    useEffect(() => {
        (async () => {
            logger.debug('Results -> useEffect1')
            
            try {
                onFlowStart()

                const items = await searchItems(token, query)

                onFlowEnd()
                    
                setItems(items)
            } catch ({ message }) {
                onFlowEnd()

                onModal(message, 'error')
            }
        })()
    }, [query])

    // useEffect 2: lighting up LE component
    useEffect(() => {
        logger.debug('Results -> useEffect2')

        gsap.to('.le', {opacity: 1, x: 0, duration: .91, ease: 'custom_one'})
    }, [])

    // useEffect 3: gsap grid cells animation
    useEffect(() => {
        logger.debug('Results -> useEffect3')

        const cell_images = document.querySelectorAll('.results-grid__cell-image')

        // Hover on the image cell will scale down the outer element and scale up the inner element.
        cell_images.forEach(image => {
            image.addEventListener('mouseenter', () => {
                gsap.killTweensOf([image, image.firstChild])

                gsap.timeline({
                    defaults: { duration: 2.4, ease: 'expo' }
                })
                .to(image, { scale: 0.95 }, 0)
                .to(image.firstChild, { scale: 1.4 }, 0)
            })
        })

        // Hovering out will reverse the scale values.
        cell_images.forEach(image => {
            image.addEventListener('mouseleave', () => {
                gsap.killTweensOf([image, image.firstChild])

                gsap.timeline({
                    defaults: { duration: 2.4, ease: 'expo' }
                })
                .to([image, image.firstChild], { scale: 1 }, 0)
            })
        })

        // // Recalculate current image transform
        // window.addEventListener('resize', () => {
        //     if ( this.isGridView ) {
        //         return false
        //     }

        //     // Calculate the transform to apply to the image cell
        //     const imageTransform = this.calcTransformImage();
        //     gsap.set(this.imageCellArr[this.currentCell].DOM.el, {
        //         scale: imageTransform.scale,
        //         x: imageTransform.x,
        //         y: imageTransform.y
        //     })
        // })

        // /**
        // * Calculates the scale and translation values to apply to the image cell when we click on it. 
        // * Also used to recalculate those values on resize.
        // * @return {JSON} the translation and scale values
        // */
        // calcTransformImage() {
        //     const cellrect = adjustedBoundingRect(this.imageCellArr[this.currentCell].DOM.el);
        //     return {
        //         scale: winsize.width * 0.54 / cellrect.width,
        //         x: winsize.width * 0.65 - (cellrect.left + cellrect.width/2),
        //         y: winsize.height * 0.50 - (cellrect.top + cellrect.height/2)
        //     }
        // }
    }, [items])

    const toggleFav = async (item_id) => {
        try {
            onFlowStart()

            if (!token) {
                onModal('Sign in to add favorites to your profile', 'warn')
            } else {
                await toggleFavItem(token, item_id)
    
                setItems(items.map(item => {
                    if (item.item_id === item_id) {
                        return { ...item, isFav: !item.isFav}
                    }
    
                    return item
                }))
    
                onFlowEnd()
            }
        } catch ({ message }) {
            onFlowEnd()

            onModal(message, 'warn')
        }
    }

    return items && items.length ? <>
        <div className='results-grid'>
            {/* <ul className='results-grid'> */}
                {
                    items.map(({ item_id, name, images, price, isFav }) => <div key={item_id}className='results-grid__cell clickable' onClick={() => onItem(item_id)}>
                        <div className="results-grid__cell-image">
                            <img src={images[0]} alt='' />
                            <button className='button results-fav-button clickable' onClick={event => {
                                event.stopPropagation()

                                toggleFav(item_id)
                            }}>{isFav ? '🧡' : '🤍'}</button>
                        </div>

                        <div className="item-info">
                            <span className='item-name'>{name} - </span>
                            <span className='item-price'>{price}</span>
                        </div>  
                    </div>)
                }
            {/* </ul> */}
        </div>
        
        {/* <p>{`(${items.length})`} Filter</p> */}
    </>
    :
    null
}

export default Results