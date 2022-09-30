import { useEffect } from 'react'
import logger from '../utils/logger'
import './Cursor.css'
import gsap from 'gsap'

function Cursor() {
    logger.debug('Cursor -> render')

    useEffect(() => {
        logger.debug('Cursor -> useEffect')

        const clickables = document.querySelectorAll('.clickable')
        const bigBall = document.querySelector('.ball--big')
        const smallBall = document.querySelector('.ball--small')

        const addEventListeners = () => {
            document.addEventListener('mousemove', onMouseMove)

            for (let i = 0; i < clickables.length; i++) {
                clickables[i].addEventListener('mouseenter', onMouseHover)
                clickables[i].addEventListener('mouseleave', onMouseHoverOut)
                clickables[i].addEventListener('mousedown', onMouseDown)
                clickables[i].addEventListener('mouseup', onMouseUp)
            }
        }

        const removeEventListeners = () => {
            document.removeEventListener('mousemove', onMouseMove)

            for (let i = 0; i < clickables.length; i++) {
                clickables[i].removeEventListener('mouseenter', onMouseHover)
                clickables[i].removeEventListener('mouseleave', onMouseHoverOut)
                clickables[i].removeEventListener('mousedown', onMouseDown)
                clickables[i].removeEventListener('mouseup', onMouseUp)
            }
        }

        const onMouseMove = (e) => {
            gsap.to(bigBall, {
                duration: .25,
                x: e.pageX - 15,
                y: e.pageY - window.scrollY - 15,
                ease: "power2.out"
            })

            gsap.to(smallBall, {
                duration: .05,
                x: e.pageX -5,
                y: e.pageY - window.scrollY - 7,
                ease: "power2.out"
            })
        }

        const onMouseHover = () => {
            gsap.to(bigBall, {
                duration: .05,
                scale: 3,
                ease: "power2.out"
            })
        }
          
        const onMouseHoverOut = () => {
            gsap.to(bigBall, {
                duration: .05,
                scale: 1,
                ease: "power2.out"
            })
        }

        const onMouseDown = () => {
            gsap.to(bigBall, {
                duration: .2,
                scale: 1.5,
                ease: "power2.out"
            })
        }

        const onMouseUp = () => {
            gsap.to(bigBall, {
                duration: .2,
                scale: 3,
                ease: "power2.out"
            })
        }

        addEventListeners()
        return () => removeEventListeners()
    })
    
    return <>
        <div className="cursor">
            <div className="cursor__ball ball--big ">
                <svg height="30" width="30">
                    <circle cx="15" cy="15" r="12" strokeWidth='0'></circle>
                </svg>
            </div>
            
            <div className="cursor__ball ball--small">
                <svg height="10" width="10">
                    <circle cx="5" cy="5" r="4" strokeWidth='0'></circle>
                </svg>
            </div>
        </div>
    </>
}

export default Cursor