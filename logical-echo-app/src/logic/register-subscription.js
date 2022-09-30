import context from './context'
const { validateEmail } = require('./helpers/validators')
/**
 * Register an email for a subscription to the application's newsletter.
 * 
 * @param {string} email The email of the user to be signed up.
 * 
 * @throws {TypeError} When any of the arguments does not match the correct type.
 * @throws {Error} When any of the arguments does not contain the correct format.
 */
 function registerSubscription(email) {
    validateEmail(email)

    return (async () => {
        const res = await fetch(`${context.API_URL}/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
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


export default registerSubscription