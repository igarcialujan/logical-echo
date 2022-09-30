import context from './context'
import { validateEmail, validatePassword, validateName, validateUsername } from './helpers/validators'
/**
 * Signs up a user in the application.
 * 
 * @param {string} name The name of the user to be signed up.
 * @param {string} username The username of the user to be signed up.
 * @param {string} email The email of the user to be signed up.
 * @param {string} password The password of the user to be signed up.
 * 
 * @throws {TypeError} When any of the arguments does not match the correct type.
 * @throws {Error} When any of the arguments does not contain the correct format.
 */
 function registerUser(name, username, email, password) {
    validateName(name)
    validateUsername(username)
    validateEmail(email)
    validatePassword(password)

    return (async () => {
        const res = await fetch(`${context.API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, username, email, password })
        })

        const { status } = res 

        if (status === 201)
            return  
        else if (status === 409 || status === 400) {
            const { error } = await res.json()

            throw new Error(error)
        } else throw new Error('Unknown error')
    })()
}


export default registerUser