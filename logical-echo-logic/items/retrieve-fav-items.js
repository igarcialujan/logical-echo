const { models: { User, Item }, mongoose } = require('logical-echo-data')
// const { Types: { ObjectId } } = mongoose  
const { validateId } = require('../helpers/validators')
const { NotFoundError } = require('logical-echo-errors')
const { sanitizeDocument } = require('../helpers/sanitizers')

function retrieveFavItems(id) {
    validateId(id)

    return (async () => {
        try {
            const user = await User.findById(id).lean()

            // console.log(user)

            const { favs } = user

            if (!favs.length) throw new NotFoundError('no fav items found for this user')
    
            // const items = await Item.find({ item_id: { $in: favs } })
            const items = await Item.findOne({ item_id: "27091108" })

            // console.log(items)
    
            items.forEach(sanitizeDocument)
    
            return items
        } catch (error) {
            throw error
        }
    })()
}

module.exports = retrieveFavItems