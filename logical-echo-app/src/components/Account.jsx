import { useState, useContext } from 'react'
import { registerUser, loginUser } from '../logic'
import AppContext from './AppContext'
import logger from '../utils/logger'
import SignUp from './SignUp'
import SignIn from './SignIn'
import { useNavigate } from 'react-router-dom'

function Account() {
    logger.debug('Account -> render')

    const { onFlowStart, onFlowEnd, onModal } = useContext(AppContext)

    const navigate = useNavigate()

    const [view, setView] = useState('signin')

    const goToSignUp = () => setView('signup')
    const goToSignIn = () => setView('signin')

    const signIn = async (username, password) => {
        try {
            onFlowStart()

            const token = await loginUser(username, password)
            
            sessionStorage.token = token

            onFlowEnd()

            navigate('/')
        } catch ({ message }) {
            onFlowEnd()

            onModal(message, 'error')
        }
    }

    const signUp = async (name, username, email, password) => {
        try {
            onFlowStart()

            await registerUser(name, username, email, password)

            onFlowEnd()

            onModal('Your account has been created. We have sent an email to your email address. Please access your email address and verify it.', 'success')

            onFlowStart()

            await signIn(username, password)
        } catch ({ message }) {
            onFlowEnd()

            onModal(message, 'error')
        }
    }
    
    return <>
        {view === 'signin' && <SignIn onSignIn={signIn} onSignUp={goToSignUp} />}

        {view === 'signup' && <SignUp onSignUp={signUp} onSignIn={goToSignIn} />}
    </>

}

export default Account



