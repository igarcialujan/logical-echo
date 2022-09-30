const { Schema } = require('mongoose')

const search = new Schema({
    query: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
})

module.exports = search 