const { Schema } = require('mongoose')

const clickedItem = new Schema({
    item_id: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

module.exports = clickedItem 