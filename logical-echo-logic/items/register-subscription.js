const { validateEmail } = require('../helpers/validators')
const { models: { Subscription } } = require('logical-echo-data')
const { ConflictError } = require('logical-echo-errors')

function registerSubscription(email) {
    validateEmail(email)

    return (async () => {
        try {
            await Subscription.create({ email })
        } catch (error) {
            if (error.code === 11000)
                throw new ConflictError(`subscription with email ${email} already exists`)

            throw error 
        }
    })()
}

module.exports = registerSubscription