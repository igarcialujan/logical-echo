const { Schema } = require('mongoose')

const item = new Schema({
    item_id: {
        type: String,
        required: true,
        unique: true
    },
    store: {
        type: String,
        required: true
    },
    pattern: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    images: {
        type: Array
    },
    price: {
        type: String
    },
    url: {
        type: String,
        required:true,
        unique: true
    },
    description: {
        type: String
    },
    colors: {
        type: Array
    },
    date: {
        type: String
    }
})

module.exports = item 