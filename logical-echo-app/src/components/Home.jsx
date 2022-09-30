import { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { gsap, CustomEase } from '../gsap'
import logger from '../utils/logger'
import scrollHorizontally from './helpers/scroll-horizontally'
import changePageWheelSpeed from './helpers/change-page-wheel-speed'
import checkIsArrayLike from './helpers/check-is-array-like'
import toPX from './helpers/to-px'
import './Home.css'
import Navbar from './Navbar'
import Logo from './Logo'
import HamburgerLine from './HamburgerLine'
import BrandFooter from './BrandFooter'
import Search from './Search'
import Account from './Account'
import Profile from './Profile'
import Newsletter from './Newsletter'
import Footer from './Footer'
import Description from './Description'

function Home() {
    logger.debug('Home -> render')

    const location = useLocation()
    const navigate = useNavigate()

    const cover_ref = useRef()
    const el = useRef()
    const q = gsap.utils.selector(el)

    const brands = ['Mango', 'H&M', 'Zara']
    const [type, setType] = useState(brands[0])

    CustomEase.create('custom_one', '.77,0,.175,1')

    // useEffect for Intro Home Page
    useEffect(() => {
        logger.debug('Home -> useEffect1')

        function startHome() {
            let tl = gsap.timeline()
            
            // Taking measurements
            let logo = document.querySelector('.logo')
            let logical = document.querySelector('.logical')
            let echo = document.querySelector('.echo')
            
            let logical_x = logical.getBoundingClientRect().left
            let echo_x = echo.getBoundingClientRect().left

            logo.style.alignItems = 'center'
            logo.style.left = '50vw'
            let logical_x_from = logical.getBoundingClientRect().left - logical_x
            let echo_x_from = echo.getBoundingClientRect().left - echo_x

            logo.style.removeProperty('align-items')
            logo.style.left = '7vw'
            
            logical.setAttribute('style', `transform: translate3d(${logical_x_from}px, 0px, 0px);`)
            echo.setAttribute('style', `transform: translate3d(${echo_x_from}px, 0px, 0px);`)

            // Intro Animation
            tl.from(".echo", {y: -30, duration: 1.2, ease: 'custom_one'}, 1)
            tl.from(".echo", {opacity: 0, duration: 1.2, ease: 'custom_one'}, '<')
            tl.from(".logical", {y: -30, duration: 1.2, ease: 'custom_one'}, '<0.1')
            tl.from(".logical", {opacity: 0, duration: 1.2, ease: 'custom_one'}, '<')
            tl.from(cover_ref.current, {left: toPX('110vw'), duration: 1, ease: 'custom_one'}, '>0.5')
            tl.to(".logical", {x: 0, duration: 1.2, ease: 'custom_one'}, '<')
            tl.to(".echo", {x: 0, duration: 1.2, ease: 'custom_one'}, '<0.1')
            tl.to(".hamburger-line", {width: 50, duration: 1.2, ease: 'custom_one', delay: .02})
            tl.from(".hamburger-line label span", {x: -15, opacity: 0, duration: 1.2, ease: 'custom_one'}, '<')
        }

        startHome()
    }, [])


    // useEffect for Scroll and Wheel
    useEffect(() => {
        logger.debug('Home -> useEffect2')

        // Event Listeners
        const addEventListeners = () => {
            document.addEventListener('scroll', setHorizontalScroll)
            document.addEventListener('scroll', scaleOnScroll)
            document.addEventListener('scroll', toggleElementsToShow)
            document.addEventListener('scroll', delayXOnScroll)
        }

        const removeEventListeners = () => {
            document.removeEventListener('scroll', setHorizontalScroll)
            document.removeEventListener('scroll', scaleOnScroll)
            document.removeEventListener('scroll', toggleElementsToShow)
            document.removeEventListener('scroll', delayXOnScroll)
        }

        // Horizontal scroll
        let sticky_parent = document.querySelector('.sticky-parent')
        let sticky = document.querySelector('.sticky')
        
        const setHorizontalScroll = () => {
            scrollHorizontally(sticky, sticky_parent)
        }

        // Scaling cover image on scroll and adjusting it at beginning of page
        const scaleOnScroll = () => {
            let scale_rate = (100 - window.scrollY/5)/100 
            let scale_value = scale_rate >= 0.5 ? scale_rate : 0.5

            gsap.to(cover_ref.current, {
                duration: .1,
                scale: scale_value,
                transformOrigin: '0 100%',
                ease: 'power2.out'
            })

            if (window.scrollY < 1) {
                gsap.to('.cover-image--outer div', {
                    duration: .1,
                    x: 0,
                    ease: 'power2.out'
                })
            }
        }

        // Toggling elements to show on scroll
        let scrolled_tl = gsap.timeline({paused: true})
        scrolled_tl.to('.le, .brand-footer', {opacity: 1, x: 0, duration: .91, ease: 'custom_one'})
        scrolled_tl.to('.image--outer.type-a', {opacity: 1, duration: .91, ease: 'custom_one'}, '<')
        scrolled_tl.to('.logo, .hamburger-line label span', {opacity: 0, duration: .91, ease: 'custom_one'}, '<')
        scrolled_tl.to('.hamburger-line', {width: 0, duration: .91, ease: 'custom_one'}, '<0.02')

        const toggleElementsToShow = () => {
            let scrolled = window.scrollY > 0

            if (scrolled) {
                scrolled_tl.play()
            } else {
                scrolled_tl.reverse()
            }
        }

        // Images Delay Effect on scroll
        const delayXOnScroll = () => {
            let translate_x = -sticky.scrollLeft

            gsap.to(cover_ref.current, {
                duration: .3,
                x: translate_x,
                ease: "power3.out"
            })

            gsap.to(q('.big'), {
                duration: .05,
                x: translate_x,
                ease: "none"
            })

            gsap.to(q('.delayed-image.medium'), {
                duration: .3,
                x: translate_x,
                ease: "power3.out"
            })

            gsap.to(q('.delayed-image.small'), {
                duration: .5,
                x: translate_x,
                ease: "power3.out"
            })
        }
        
        // Changing page wheel speed
        changePageWheelSpeed(1.5)

        // Adding and removing Event Listeners
        addEventListeners()
        return () => removeEventListeners()
    }, [])


    // useEffect for Intersection Observer
    useEffect(() => {
        logger.debug('Home -> useEffect3')

        // Creating Intersection Observer to change BrandFooter
        let io_target = document.querySelectorAll('.io-target')

        const handleIntersection = (entries) => {
            let entry = entries[0]

            if (entry.boundingClientRect.left < 0 && entry.boundingClientRect.right < 0) {
                if (entry.target.classList.contains('type-a')) {
                    setType(brands[1])
                } else if (entry.target.classList.contains('type-b')) {
                    setType(brands[2])
                } else {
                    setType('')
                }
            } 
            
            if (entry.boundingClientRect.left < 0 && entry.boundingClientRect.right >= 0) {
                if (entry.target.classList.contains('type-a')) {
                    setType(brands[0])
                } else if (entry.target.classList.contains('type-b')) {
                    setType(brands[1])
                } else {
                    setType(brands[2])
                }
            }
        }

        function createObserver(target) {          
            let options = {
                root: null,
                rootMargin: "0px",
                threshold: 0
            }
          
            let io = new IntersectionObserver(handleIntersection, options)

            let is_array_like = checkIsArrayLike(target)

            if (is_array_like) {
                target.forEach(elem => io.observe(elem))
            } else {
                io.observe(target)
            }
        }

        createObserver(io_target)
    }, [])


    // useEffect for Mouse Move Translate Parallax
    useEffect(() => {
        logger.debug('Home -> useEffect4')

        let translate_target = document.querySelectorAll('.image') 
        let mid_viewport = window.innerWidth / 2
        let vw_unit_pixels = window.innerWidth / 100
        
        const translateOnMouseMove = (e) => {
            let offset = e.clientX - mid_viewport
            let ratio = offset / vw_unit_pixels 
            
            translate_target.forEach((elem, i) => {
                let translate_x = ratio * elem.dataset.ratex
                
                if (i === 0) {
                    if (window.scrollY > 0) {
                        elem.setAttribute("style", `transform: translate3d(${-translate_x}px, 0px, 0px);`)
                    }
                } else {
                    elem.setAttribute("style", `transform: translate3d(${-translate_x}px, 0px, 0px);`)
                }
            })
        }

        document.addEventListener('mousemove', translateOnMouseMove)

        return () => document.removeEventListener('mousemove', translateOnMouseMove)
    }, [])

    const goToStore = store => navigate(`/items?q=${store}`)

    return <>
        <div className="sticky-parent">
            <div className="sticky">
                <div className="home-horizontal" ref={el}>
                    <div className="home__intro">
                        <Logo />
                        <HamburgerLine />
                        <BrandFooter type={type} />

                        <div className="cover-image--outer delayed-image" ref={cover_ref}>
                            <div className="home-image" data-ratex="0.5">
                                <img className="clickable" src="https://st.mngbcn.com/rcs/pics/static/T2/fotos/S20/27054010_88.jpg?ts=1642070994249&imwidth=476&imdensity=2" alt="" onClick={() => goToStore(brands[0])} />
                            </div>
                        </div>
                        <div className="image--outer big type-a">
                            <div className="home-image" data-ratex="1">
                                <img className="clickable" src="https://st.mngbcn.com/rcs/pics/static/T1/fotos/S20/17004072_05.jpg?ts=1629104683133&imwidth=476&imdensity=2" alt="" onClick={() => goToStore(brands[0])} /> 
                            </div>
                        </div>
                        <div className="image--outer small type-a io-target delayed-image">
                            <div className="home-image" data-ratex="0.3">
                                <img className="clickable" src="https://st.mngbcn.com/rcs/pics/static/T2/fotos/S20/27040091_56.jpg?ts=1636379500926&imwidth=360&imdensity=2" alt="" onClick={() => goToStore(brands[0])} />       
                            </div>
                        </div>

                        <div className="image--outer big type-b">
                            <div className="home-image" data-ratex="1">
                                <img className="clickable" src="https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2Fde%2Ff3%2Fdef33b7fc423c73869aab4bfaa03545eb06cbe97.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]" alt="" onClick={() => goToStore(brands[1])} />
                            </div>
                        </div>
                        <div className="image--outer medium type-b io-target delayed-image">
                            <div className="home-image" data-ratex="0.5">
                                <img className="clickable" src="https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F0e%2F66%2F0e6697cc83741f06914b330f87070ebd98bf0e7f.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]" alt="" onClick={() => goToStore(brands[1])} />   
                            </div>
                        </div>
                        <div className="image--outer small type-b delayed-image">
                            <div className="home-image" data-ratex="0.3">
                                <img className="clickable" src="https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F5d%2F15%2F5d15e6f0e77ff342a1e765a0ab3886db5d8f2284.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BLOOKBOOK%5D%2Cres%5Bm%5D%2Chmver%5B1%5D&call=url[file:/product/main]" alt="" onClick={() => goToStore(brands[1])} />
                            </div>
                        </div>

                        <div className="image--outer big type-c">
                            <div className="home-image" data-ratex="1">
                                <img className="clickable" src="https://static.zara.net/photos///2022/V/0/1/p/2183/049/500/2/w/1126/2183049500_2_1_1.jpg?ts=1645708543111" alt="" onClick={() => goToStore(brands[2])} />
                            </div>
                        </div>
                        <div className="image--outer medium type-c io-target delayed-image">
                            <div className="home-image" data-ratex="0.5">
                                <img className="clickable" src="https://static.zara.net/photos///2022/V/0/1/p/0034/042/621/2/w/1126/0034042621_2_1_1.jpg?ts=1649062243737" alt="" onClick={() => goToStore(brands[2])} />
                            </div>
                        </div>
                        <div className="image--outer small type-c delayed-image">
                            <div className="home-image" data-ratex="0.3">
                                <img className="clickable" src="https://static.zara.net/photos///2022/V/0/2/p/5692/340/710/2/w/1126/5692340710_2_1_1.jpg?ts=1644943727722" alt="" onClick={() => goToStore(brands[2])} />     
                            </div>
                        </div>
                    
                    </div>
                        
                    <div className="home__last">
                        <Navbar />
                        {location.pathname === '/search' && <Search />}
                        {location.pathname === '/account' && <Account />}
                        {location.pathname === '/profile' && <Profile />}
                        {location.pathname === '/newsletter' && <Newsletter />}
                        {location.pathname === '/' && <Description />}
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Home