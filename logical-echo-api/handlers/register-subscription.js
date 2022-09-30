const { registerSubscription } = require('logical-echo-logic')
const { handleError } = require('./helpers')

module.exports = async (req, res) => {
    const { body: { email } } = req 

    try {
        // comprobar si el usuario ha iniciado sesión?

        await registerSubscription(email)
        
        res.status(201).send()
    } catch (error) {
        handleError(error, res)
    }
}