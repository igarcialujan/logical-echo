import context from './context'
import { validateToken, validatePassword } from './helpers/validators'
/**
 * Unregisters the user in the application.
 * 
 * @param {string} token The token sent by the server when the user is authorized.
 * @param {string} password The password of the user to be unregistered.
 * 
 * @throws {TypeError} When any of the arguments does not match the correct type.
 * @throws {Error} When any of the arguments does not contain the correct format.
 */
 function unregisterUser(token, password) {
    validateToken(token)
    validatePassword(password)

    return (async () => {
        const res = await fetch(`${context.API_URL}/users`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password })
        })

        const { status } = res 

        if (status === 204)
            return  
        else if (status === 400 || status === 401) {
            const { error } = await res.json()

            throw new Error(error)
        } else throw new Error('Unknown error')
    })()
}

export default unregisterUser