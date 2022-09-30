const { models: { Item } } = require('logical-echo-data')
const { validateQuery } = require('../helpers/validators')
const { NotFoundError } = require('logical-echo-errors')
const { sanitizeDocument } = require('../helpers/sanitizers')

function searchItems(query) {
    validateQuery(query)

    return (async () => {
        try {
            const items = await Item.find({ $text: { $search: query }}).lean()
            
            if (!items.length) throw new NotFoundError('No items found for your query')
    
            items.forEach(sanitizeDocument)
    
            return items
        } catch (error) {
            throw error
        }
    })()
}

module.exports = searchItems
