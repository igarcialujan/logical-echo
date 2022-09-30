function getRandomElementFromArray(array) {
    var index = Math.floor(Math.random() * array.length)

    return array[index]
}

module.exports = getRandomElementFromArray