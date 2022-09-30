import context from './context'
import { validateToken } from './helpers/validators'
/**
 * Retrieves the info about the user from the server.
 * 
 * @param {string} token The token sent by the server when the user is authorized.
 * 
 * @throws {TypeError} When any of the arguments does not match the correct type.
 * @throws {Error} When any of the arguments does not contain the correct format.
 */
 function retrieveUser(token) {
    validateToken(token)

    return (async () => {
        const res = await fetch(`${context.API_URL}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        const { status } = res 

        if (status === 200)
            return await res.json()
        else if (status === 401 || status === 404) {
            const { error } = await res.json()

            throw new Error(error)
        } else throw new Error('Unknown error')
    })()
}

export default retrieveUser