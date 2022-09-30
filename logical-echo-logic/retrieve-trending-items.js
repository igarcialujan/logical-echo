const { models: { ClickedItem } } = require('logical-echo-data')
const { NotFoundError } = require('logical-echo-errors')
const retrieveItem = require( './retrieve-item' )
const { sanitizeDocument } = require('./helpers/sanitizers')
const { validateId } = require( './helpers/validators' )

function retrieveTrendingItems(id) {
    validateId(id)

    return (async () => {
        try {
            const itemsIds = await ClickedItem.find({}, { item_id: 1 }).lean()
    
            if (!itemsIds.length) throw new NotFoundError('no trending items found')
    
            let items
    
            for (const itemId of itemsIds) {
                const retrieves = await retrieveItem(id, itemId)
                items = retrieves
            }
    
            // const items = await Promise.all(itemsIds.map(async (item_id) => {
            //     const retrieves = await retrieveItem(id, item_id)
            //     return retrieves
            // }))
    
            items.forEach(sanitizeDocument)
    
            return items
        } catch (error) {
            throw error
        }
    })()
}

module.exports = retrieveTrendingItems