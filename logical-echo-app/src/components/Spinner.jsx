// import { useEffect } from 'react'
import logger from '../utils/logger'
// import { gsap } from 'gsap'
import './Spinner.css'

function Spinner() {
    logger.debug('Spinner -> render')

    // useEffect(() => {
    //     logger.debug('Spinner -> useEffect')

    //     let tl = gsap.timeline({ repeat: -1 })

    //     var path = document.querySelector('.spinner__circle')
    //     var l = path.getTotalLength()

    //     tl.fromTo(".spinner__circle", { 
    //         strokeDasharray: '0%' 
    //     }, {
    //         duration: 1,
    //         strokeDasharray: l,
    //         strokeDashoffset:l, 
    //         immediateRender: false, 
    //         ease: 'power1.easeInOut', 
    //         rotation:360, 
    //         transformOrigin:"50% 50%", 
    //         stroke:"#29B6F6" 
    //     })
    //     .fromTo(".spinner__circle", {
    //         strokeDasharray: l
    //     }, {
    //         duration: 1.5,
    //         strokeDashoffset: 0, 
    //         immediateRender: false, 
    //         ease: 'power1.easeInOut', 
    //         rotation:-720, 
    //         transformOrigin:"50% 50%", 
    //         stroke:"#FF4081"
    //     })
        
    //     return () => {}
    // }, [])

    return <>
        <div className='spinner spinner-atom'></div>
        {/* <div className="spinner">
            <svg x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24">
                <circle className="spinner__circle" fill="none" cx="12" cy="12" r="10" stroke="#29B6F6" strokeWidth="2"/>
            </svg>
        </div> */}
    </>
    
    // <div className='spinner container container--vertical container--full'>
    //     <img className="spinner__image" src="https://www.ithink.co/images/lg.ajax-spinner-preloader.gif" alt="spinner" />
    // </div>
}

export default Spinner