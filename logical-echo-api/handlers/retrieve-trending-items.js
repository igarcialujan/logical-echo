const { retrieveTrendingItems } = require('logical-echo-logic')
const { handleError, validateAuthorizationAndExtractPayload } = require('./helpers')

module.exports = async (req, res) => {
    const { headers: { authorization } } = req

    try {
        const { sub: id } = validateAuthorizationAndExtractPayload(authorization)

        const items = await retrieveTrendingItems(id)

        await req.redis.set('trend', JSON.stringify(trend_items), "EX", 21600)

        res.json(items)
    } catch (error) {
        handleError(error, res)
    }
}