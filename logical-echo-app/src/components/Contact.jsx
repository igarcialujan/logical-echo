import { useEffect } from 'react'
import BackButton from './BackButton'
import gsap from 'gsap'
import toPX from './helpers/to-px'
import { CustomEase } from 'gsap/CustomEase'
import logger from '../utils/logger'
import './Contact.css'

gsap.registerPlugin(CustomEase)

function Contact() {
    logger.debug('Contact -> render')

    CustomEase.create('custom_one', '.77,0,.175,1')

    // useEffect: gsap lighting up animation
    useEffect(() => {
        let tl = gsap.timeline()

        tl.to('.le', {opacity: 1, x: 0, duration: .91, ease: 'custom_one'})
        tl.from('.contact-info', {x: 100, opacity: 0, duration: 1.2, ease: 'custom_one'}, '<')
        tl.from('.contact-image', {left: toPX('110vw'), duration: 1, ease: 'power1'})        
    }, [])
    
    return <div className="contact">
        <article className="contact-info">
            <p>
                <strong>Logical Echo S.A.</strong>
                <br />
                Address Street 1, 1A
                <br />
                18007 - City
                <br />
                <a href="#" className="phone clickable">+34 600000000</a>
            </p>

            <div className="socials">
                <p>
                    <strong>Contact</strong>
                    <br />
                    <a href="#" className="email clickable">mail@name.com</a>
                </p>
                <p>
                    <strong>Socials</strong>
                    <br />
                    <a href="#" className='clickable'>Instagram</a>
                    <br />
                    <a href="#" className='clickable'>Twitter</a>
                </p>
            </div>
        </article>
        
        <div className="contact-image">
            <img src="https://st.mngbcn.com/rcs/pics/static/T1/fotos/S20/17004072_05.jpg?ts=1629104683133&imwidth=476&imdensity=2" alt="" /> 
        </div>

        <BackButton page={'contact'} />
    </div>
}

export default Contact