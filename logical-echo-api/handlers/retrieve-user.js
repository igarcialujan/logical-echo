const { retrieveUser } = require('logical-echo-logic')
const { handleError, validateAuthorizationAndExtractPayload } = require('./helpers')

module.exports = async (req, res) => {
    const { headers: { authorization } } = req 

    try {
        const { sub: id } = validateAuthorizationAndExtractPayload(authorization)

        const user = await retrieveUser(id)

        await req.redis.set(id, JSON.stringify(user), "EX", 21600)

        res.json(user)
    } catch (error) {
        handleError(error, res)
    }
}