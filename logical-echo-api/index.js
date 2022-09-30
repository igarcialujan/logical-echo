require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const { mongoose } = require('logical-echo-data')
const cors = require('cors')
const Redis = require('ioredis')
const cache = require('./cache')
const { 
    registerUser,
    verifyEmail,
    authenticateUser, 
    retrieveUser, 
    modifyUser,
    unregisterUser,
    searchItems,
    registerSubscription,
    retrieveItem,
    retrieveFavItems,
    retrieveTrendingItems
} = require('./handlers')
const logger = require('./utils/my-logger')

const { env: { PORT, MONGO_URI }, argv: [, , port = PORT || 8080] } = process

logger.info('starting server');

(async () => {
    try {
        await mongoose.connect(MONGO_URI || 'mongodb://localhost/test')
        
        const redis = new Redis({
            host: '127.0.0.1',
            port: 6379
        })

        const server = express()

        server.use(cors())

        server.use((req, res, next) => {
            req.redis = redis
            next()
        })

        const api = express.Router()

        const jsonBodyParser = bodyParser.json()

        api.post('/users', jsonBodyParser, registerUser)

        api.get('/users/:username/verify/:registration_token', verifyEmail)

        api.post('/users/auth', jsonBodyParser, authenticateUser)

        api.get('/users', cache, retrieveUser)

        api.patch('/users', jsonBodyParser, modifyUser)

        api.delete('/users', jsonBodyParser, unregisterUser)

        api.get('/items', cache, searchItems)

        api.get('/items/:item_id', cache, retrieveItem) 

        api.get('/items/trend', cache, retrieveTrendingItems)

        api.get('/items/favs', retrieveFavItems)

        api.post('/subscriptions', jsonBodyParser, registerSubscription)

        api.all('*', (req, res) => {
            res.status(404).json({ message: 'sorry, this endpoint is not available' })
        })

        server.use('/api', api)

        server.listen(port, () => logger.info(`server up and listening on port ${port}`))

        process.on('SIGINT', () => {
            logger.info('stopping server')

            process.exit(0)
        })
    } catch (error) {
        logger.error(error)
    }
})()
