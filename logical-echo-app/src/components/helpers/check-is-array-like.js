function checkIsArrayLike(elem) {
    return elem instanceof Array || NodeList.prototype.isPrototypeOf(elem) || HTMLCollection.prototype.isPrototypeOf(elem)
}

export default checkIsArrayLike