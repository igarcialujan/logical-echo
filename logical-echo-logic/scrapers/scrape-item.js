const logger = require('../../logical-echo-api/utils/my-logger')
const getRandomElementFromArray = require('./helpers/get-random-element-from-array')

function scrapeItem (browser, item_selectors) {
    return (async () => {
        try {
            logger.debug('start scraping item')
            const page = await browser.newPage()

            await page.setDefaultNavigationTimeout(0)

            const user_agents = [ 
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', 
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36', 
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36' 
            ]

            let user_agent = getRandomElementFromArray(user_agents)
            
            page.setUserAgent(user_agent)
            
            const href = item_selectors.href
            await page.goto(href)

            const { name_selector, img_selector, price_selector, description_selector, one_color_selector, colors_selector } = item_selectors
            await page.waitForSelector(name_selector).catch(() => {})
            await page.waitForSelector(img_selector).catch(() => {})
            await page.waitForSelector(price_selector).catch(() => {})
            await page.waitForSelector(description_selector).catch(() => {})
            if (one_color_selector)
                await page.waitForSelector(one_color_selector).catch(() => {})
            await page.waitForSelector(colors_selector).catch(() => {})

            const item = await page.evaluate(({ name_selector, img_selector, price_selector, description_selector, one_color_selector, colors_selector, color_container_attribute }) => {
                const name = document.querySelector(name_selector).innerText

                const imgs = Array.from(document.querySelectorAll(img_selector))
                const images = imgs.map(image => image.src)

                const price = document.querySelector(price_selector).innerText

                const description = document.querySelector(description_selector).innerText

                let onlyOneColor = one_color_selector ? document.querySelector(one_color_selector) : null
                if (onlyOneColor)
                    onlyOneColor = onlyOneColor.innerText.split("|")[0].trim().slice(6)

                let colorSelection = Array.from(document.querySelectorAll(colors_selector))
                if (colorSelection.length) {
                    colorSelection = (color_container_attribute === 'innerText') ? 
                    colorSelection.map(color_container => color_container.innerText) :
                    (color_container_attribute === 'title') ?
                    colorSelection.map(color_container => color_container.title) :
                    colorSelection.map(color_container => color_container.alt)
                }

                const colors = onlyOneColor ? [onlyOneColor] : colorSelection

                const item = {  
                    name, 
                    images, 
                    price, 
                    description, 
                    colors 
                }

                return item
            }, item_selectors)

            logger.debug(`scraped item ${JSON.stringify(item)}`)

            return item
        } catch (error) {
            logger.error(error)
        }
    })()
}

module.exports = scrapeItem