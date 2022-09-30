const { retrieveItem, registerClickedItem } = require('logical-echo-logic')
const { handleError, validateAuthorizationAndExtractPayload } = require('./helpers')

module.exports = async (req, res) => {
    const { headers: { authorization }, params: { item_id } } = req

    try {
        let id 
        if (authorization) {
            const { sub: _id } = validateAuthorizationAndExtractPayload(authorization)

            id = _id
        }

        const clickedItem = {
            item_id,
            date: new Date().toLocaleString()
        }

        await registerClickedItem(clickedItem)

        const item = await retrieveItem(id, item_id)

        await req.redis.set(item_id, JSON.stringify(item), "EX", 21600)

        res.json(item)
    } catch (error) {
        handleError(error, res)
    }
}