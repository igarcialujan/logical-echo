const { models: { User } } = require('logical-echo-data')
const { validateId, validatePassword } = require('../helpers/validators')
const { CredentialsError } = require('logical-echo-errors')
const bcrypt = require('bcryptjs')

/**
 * 
 * @param {*} id 
 * @param {*} password 
 */
function unregisterUser(id, password) {
    validateId(id)
    validatePassword(password)

    return (async () => {
        try {
            const user = await User.findById(id)
            
            if (!user || !bcrypt.compareSync(password, user.password)) 
                throw new CredentialsError('wrong credentials')
        
            await user.remove()
        } catch (error) {
            throw error
        }
    })()
}

module.exports = unregisterUser 