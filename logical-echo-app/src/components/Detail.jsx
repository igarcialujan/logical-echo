import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { retrieveItem, toggleFavItem } from '../logic'
import { gsap, CustomEase } from '../gsap'
import AppContext from './AppContext'
import logger from '../utils/logger'
import './Detail.css'

function Detail() { 
    logger.debug('Detail -> render')

    const { onFlowStart, onFlowEnd, onModal } = useContext(AppContext)

    const [item, setItem] = useState()

    const { item_id } = useParams()

    const { token } = sessionStorage

    CustomEase.create('custom_one', '.77,0,.175,1')

    // useEffect 1: calling the retrieveItem function and setting the item state 
    useEffect(() => {
        (async () => {
            logger.debug('Detail -> useEffect1')

            try {
                onFlowStart()

                const item = await retrieveItem(token, item_id) 

                onFlowEnd()

                setItem(item)     
            } catch ({ message }) {
                onFlowEnd()

                onModal(message, 'error')
            }
        })()
    }, [item_id])

    // useEffect 2: lighting up LE component
    useEffect(() => {
        logger.debug('Detail -> useEffect2')

        gsap.to('.le', {opacity: 1, x: 0, duration: .91, ease: 'custom_one'})
    }, [])

    // useEffect 3: gsap scrollTrigger animation
    useEffect(() => {
        logger.debug('Detail -> useEffect3')

        let images = gsap.utils.toArray(".detail-image")

        let scrollTween = gsap.to('.detail__gallery', {
            xPercent: -100,
            ease: "none",
            scrollTrigger: {
                trigger: ".detail__horizontal",
                pin: true,
                scrub: 0.1,
                end: "+=2500"
            }
        })

        images.forEach((image, i) => {
            if (i !== 0) {
                // image.setAttribute('transform', 'scale(0.5)')

                // image.setAttribute('transformOrigin', '0 100%')

                gsap.set(image, { scale: .5, transformOrigin: '0 100%' })
            }
        })

        console.log(images)

        images.forEach((image, i) => {
            if (i !== 0) {
                gsap.fromTo(image, { scale: .5 } ,{
                    scale: 1,
                    duration: .2,
                    ease: "none",
                    transformOrigin: '0 100%',
                    scrollTrigger: {
                        trigger: image,
                        containerAnimation: scrollTween,
                        start: "left 90%",
                        end: "left 65%",
                        scrub: true,
                        id: i
                    }
                })
            }

            gsap.fromTo(image, { scale: 1 }, {
                scale: .5,
                duration: .2,
                ease: "none",
                transformOrigin: '0 100%',
                immediateRender: false,
                scrollTrigger: {
                    trigger: image,
                    containerAnimation: scrollTween,
                    start: "10% left",
                    scrub: true,
                    id: i
                }
            })
        })
    }, [item])

    const toggleFav = async (item_id) => {
        try {
            if (!token) {
                onModal('Sign in to add favorites to your profile', 'warn')
            } else {
                onFlowStart()
                
                await toggleFavItem(token, item_id)
    
                setItem({ ...item, isFav: !item.isFav })
    
                onFlowEnd()
            }
        } catch ({ message }) {
            onFlowEnd()

            onModal(message, 'error')
        }
    }

    return item ? <>
        <div className="detail__horizontal">
            <div className="detail__gallery">
                {
                    item.images.map((src, i) => <div className="detail-image" key={i}>
                        <img src={src} alt="" />
                    </div>)
                }
            </div>

            <div className="detail__info">
                <h3 className="detail-name">{item.name}</h3>
                <p className="detail-description">{item.description}</p>
                <span className="detail-price"><span>{item.price}</span></span>
                <span className="detail-colors"><span>Colors: {item.colors}</span></span>
                <a href={item.url} className="detail-link">Visit the shop</a>
                <div className="detail-favs">
                    Save in Favs
                    <button type='button' className='button fav-button clickable' onClick={() => toggleFav(item.item_id)}>{item.isFav ? '🧡' : '🤍'}</button>
                </div>
            </div>
        </div>
    </>
    :
    null
}

export default Detail