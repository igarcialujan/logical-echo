const { models: { Item } } = require('logical-echo-data')

function registerItems(items) {
// validation executed by the insertMany() method of mongoose/MongoDB
    return (async () => {
        try {
            await Item.insertMany(items)
        } catch (error) {
            throw error
        }
    })()
}

module.exports = registerItems