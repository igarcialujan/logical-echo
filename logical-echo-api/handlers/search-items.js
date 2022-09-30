const { searchItems, registerSearch } = require('logical-echo-logic')
const { handleError } = require('./helpers')

module.exports = async (req, res) => {
    const { query: { q } } = req

    try {
        const search = {
            query: q,
            date: new Date().toLocaleString()
        }

        await registerSearch(search)

        const items = await searchItems(q)

        await req.redis.set(q, JSON.stringify(items), "EX", 21600)

        res.json(items)
    } catch (error) {
        handleError(error, res)
    }
}