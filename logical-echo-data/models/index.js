const { model } = require('mongoose')
const { user, item, search, clickedItem, subscription } = require('./schemas')

module.exports = {
    User: model('User', user),
    Item: model('Item', item),
    Search: model('Search', search),
    ClickedItem: model('ClickedItem', clickedItem),
    Subscription: model('Subscription', subscription)
}