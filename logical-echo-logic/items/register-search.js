const { validateString } = require('../helpers/validators')
const { models: { Search } } = require('logical-echo-data')

function registerSearch(search) {
    const { query, date } = search
    
    validateString(query)
    validateString(date)

    return (async () => {
        try {
            await Search.create(search)
        } catch (error) {
            throw error 
        }
    })()
}

module.exports = registerSearch