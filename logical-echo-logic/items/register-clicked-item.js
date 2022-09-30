const { validateItemId, validateString } = require('../helpers/validators')
const { models: { ClickedItem } } = require('logical-echo-data')

function registerClickedItem(clickedItem) {
    const { item_id, date } = clickedItem
    validateItemId(item_id)
    validateString(date)

    return (async () => {
        try {
            await ClickedItem.create(clickedItem)
        } catch (error) {
            throw error 
        }
    })()
}

module.exports = registerClickedItem