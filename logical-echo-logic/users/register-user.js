const { validateEmail, validatePassword, validateName, validateUsername } = require('../helpers/validators')
const { ConflictError } = require('logical-echo-errors')
const { models: { User } } = require('logical-echo-data')
const bcrypt = require('bcryptjs')

/**
 * @param {*} name
 * @param {*} username
 * @param {*} email 
 * @param {*} password 
 */
function registerUser(name, username, email, password) {
    validateName(name)
    validateUsername(username)
    validateEmail(email)
    validatePassword(password)

    return (async () => {
        try {
            await User.create({ name, username, email, password: bcrypt.hashSync(password) })
        } catch (error) {
            if (error.code === 11000)
                throw new ConflictError(`user with email ${email} already exists`)

            throw error
        }
    })()     
}

module.exports = registerUser