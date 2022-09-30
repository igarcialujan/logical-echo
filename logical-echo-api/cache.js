const { validateAuthorizationAndExtractPayload } = require('./handlers/helpers')

const cache = async (req, res, next) => {
    const getValue = (error, result) => {
        if (error) throw error
    
        if (result !== null) {
            return res.json(JSON.parse(result))
        } else {
            return next()
        }
    }

    const { query: { q }, params: { item_id }, headers: { authorization } } = req

    if (item_id)
        await req.redis.get(item_id, getValue)
    else if (q)
        await req.redis.get(q, getValue)
    else {
        const { sub: id } = validateAuthorizationAndExtractPayload(authorization)

        req.redis.get(id, getValue)
    }
}

module.exports = cache