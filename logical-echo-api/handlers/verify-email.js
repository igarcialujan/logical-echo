const { verifyEmail } = require('logical-echo-logic')
const { handleError } = require('./helpers')

module.exports = async (req, res) => {
    const { params: { username, registration_token } } = req 

    try {
        const verification_token = await req.redis.get(username)

        if (verification_token === registration_token) {
            await verifyEmail(username)
    
            await req.redis.del(username)
            
            res.status(204).send()   
        } else {
            res.status(400).send({ message: 'Invalid link' })
        }
    } catch (error) {
        handleError(error, res)
    }
}