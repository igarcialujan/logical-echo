const { modifyUser } = require('logical-echo-logic')
const { handleError, validateAuthorizationAndExtractPayload } = require('./helpers')

module.exports = async (req, res) => {
    const { headers: { authorization }, body: data } = req 

    try {
        const { sub: id } = validateAuthorizationAndExtractPayload(authorization)

        await modifyUser(id, data)

        await req.redis.del(id)
        
        res.status(204).send()   
    } catch (error) {
        handleError(error, res)
    }
}