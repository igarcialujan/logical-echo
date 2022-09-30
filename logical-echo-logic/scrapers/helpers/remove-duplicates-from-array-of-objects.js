function removeDuplicatesFromArrayOfObjects(array_of_objects, key) {
    return [...new Map(array_of_objects.map(obj => [obj[key], obj])).values()]
}

module.exports = removeDuplicatesFromArrayOfObjects