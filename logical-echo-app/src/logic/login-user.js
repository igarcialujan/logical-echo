import context from './context'
import { validateUsername, validatePassword } from './helpers/validators'
/**
 * Logs a user in the application.
 * 
 * @param {string} username The username of the user to be logged in.
 * @param {string} password The password of the user to be logged in.
 * 
 * @throws {TypeError} When any of the arguments does not match the correct type.
 * @throws {Error} When any of the arguments does not contain the correct format.
 */
 function loginUser(username, password) {
    validateUsername(username)
    validatePassword(password)

    return (async () => {
        const res = await fetch(`${context.API_URL}/users/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })

        const { status } = res 

        if (status === 200) {
            const { token } = await res.json()

            return token 
        } else if (status === 401) {
            const { error } = await res.json()

            throw new Error(error)
        } else throw new Error('Unknown error')
    })()
}


export default loginUser