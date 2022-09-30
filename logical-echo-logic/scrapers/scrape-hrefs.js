const logger = require('../../logical-echo-api/utils/my-logger')
const autoScroll = require('./helpers/autoscroll')
const clickLoadMoreButton = require('./helpers/click-load-more-button')
const getRandomElementFromArray = require('./helpers/get-random-element-from-array')

function scrapeHrefs(browser, { url, selector, infinite_scroll, button_selector }) {
    return (async () => { 
        try {
            logger.debug('start scraping')

            const page = await browser.newPage()

            await page.setViewport({ width: 1200, height: 800 })
    
            await page.setDefaultNavigationTimeout(0)

            const user_agents = [ 
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36', 
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36' 
            ]

            let user_agent = getRandomElementFromArray(user_agents)
            
            page.setUserAgent(user_agent)
    
            await page.goto(url)
            
            if (infinite_scroll) 
                await autoScroll(page)
            else 
                await clickLoadMoreButton(page, button_selector)
        
            await page.waitForSelector(selector).catch(() => {})
    
            const hrefs = await page.evaluate((sel) => {
                const anchors = Array.from(document.querySelectorAll(sel))
                
                let results = []

                anchors.forEach(anchor => results.push(anchor.href))

                return results
            }, selector)

            return hrefs
        } catch (error) {
            logger.error(error)
        }
    })()
}

module.exports = scrapeHrefs