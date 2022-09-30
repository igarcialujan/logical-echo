require('dotenv').config()
const { mongoose, models: { Item } } = require('logical-echo-data')
const nodeCron = require('node-cron')
const scrapeHMBabies = require('./scrape-hm-babies')
const scrapeHMKids = require('./scrape-hm-kids')
const scrapeHMMan = require('./scrape-hm-man')
const scrapeHMWoman = require('./scrape-hm-woman')
const scrapeMangoWoman = require('./scrape-mango-woman')
const scrapeZaraKids = require('./scrape-zara-kids')
const scrapeZaraMan = require('./scrape-zara-man')
const scrapeZaraWoman = require('./scrape-zara-woman')

const { env: { MONGO_URI } } = process;

// async function execAllScrapers() {
//     await mongoose.connect(MONGO_URI)

//     await Item.deleteMany()

//     // await scrapeHMBabies()
//     // await scrapeHMKids()
//     // await scrapeHMWoman()
//     // await scrapeHMMan()
//     // await scrapeMangoWoman()
//     // await scrapeZaraKids()
//     await scrapeZaraWoman()
//     // await scrapeZaraMan()

//     await mongoose.disconnect()
// }

// const job = nodeCron.schedule('* * * * *', execAllScrapers)

(async () => {
    await mongoose.connect(MONGO_URI)

    await Item.deleteMany()

    await scrapeHMWoman()

    await scrapeMangoWoman()

    await mongoose.disconnect()
})()

