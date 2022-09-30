// import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import logger from '../utils/logger'
import './SignIn.css'

function SignIn({ onSignIn, onSignUp }) {
    logger.debug('SignIn -> render')

    // const location = useLocation()
    // const navigate = useNavigate()

    // const goToAccount = () => navigate('/account')

    // useEffect(() => {
    //     let navbar = document.querySelector('.navbar')
    //     let signin_form = document.querySelector('.signin-form')
    //     // let reference = document.querySelector('.nav-button-login')

    //     // signin_form.setAttribute("style", `top: ${reference.getBoundingClientRect().top + 40}px; left: ${reference.getBoundingClientRect().left}px;`)

    //     navbar.classList.add('show')
    //     signin_form.classList.add('show')
    // }, [])

    return <>
            <form className="signin-form form container--vertical" onSubmit={event => {
                event.preventDefault()

                const { target: { username: { value: username }, password: { value: password } } } = event

                onSignIn(username, password)
            }}>
                <input className="field" type="text" name="username" id="signin-username" placeholder="Username" required />
                <input className="field" type="password" name="password" id="signin-password" placeholder="Password" required />

                <div className="container">
                    <button type="button" className="button button--medium clickable" onClick={event => {
                        event.preventDefault()

                        onSignUp()
                    }}>Sign up</button>
                    <button type="submit" className="button button--medium button--emphasized clickable">Sign In</button>
                </div>
            </form>
    </>
}

export default SignIn