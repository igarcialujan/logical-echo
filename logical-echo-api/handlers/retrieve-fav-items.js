const { retrieveFavItems } = require('logical-echo-logic')
const { handleError, validateAuthorizationAndExtractPayload } = require('./helpers')

module.exports = async (req, res) => {
    const { headers: { authorization } } = req

    try {
        const { sub: id } = validateAuthorizationAndExtractPayload(authorization)

        const items = await retrieveFavItems(id)

        // await req.redis.set(id, JSON.stringify(items), "EX", 21600)

        res.json(items)
    } catch (error) {
        handleError(error, res)
    }
}