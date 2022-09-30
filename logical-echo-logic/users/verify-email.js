const { models: { User } } = require('logical-echo-data')
const { validateUsername } = require('../helpers/validators')
const { NotFoundError } = require('logical-echo-errors')

/**
 * @param {*} username 
 */
function verifyEmail(username) {
    validateUsername(username)

    return (async () => {
        try {
            const user = await User.findOne({ username })
            
            if (!user) throw new NotFoundError(`user with username ${username} not found`)
            
            user.verified = true
        
            await user.save()
        } catch (error) {
            throw error
        }
    })()
}

module.exports = verifyEmail