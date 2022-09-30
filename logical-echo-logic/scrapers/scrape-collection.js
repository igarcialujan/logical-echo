require('dotenv').config()
const puppeteer = require('puppeteer')
const logger = require('../../logical-echo-api/utils/my-logger')
const scrapeHrefs = require('./scrape-hrefs')
const scrapeItem = require('./scrape-item')
const removeDuplicatesFromArrayOfObjects = require('./helpers/remove-duplicates-from-array-of-objects')
const registerItems = require('../register-items')

function scrapeCollection({ url, selector, infinite_scroll, button_selector, name_selector, img_selector, price_selector, description_selector, one_color_selector, colors_selector, color_container_attribute, href_id_slice_positions, store, pattern }) {
    return (async () => { 
        try {
            const browser = await puppeteer.launch({ 
                args: ['--disable-dev-shm-usage'] 
            })

            const scrape_hrefs_args = {
                url,
                selector,
                infinite_scroll,
                button_selector 
            }

            const hrefs = await scrapeHrefs(browser, scrape_hrefs_args)
            console.log(hrefs)

            const hrefs_slice = hrefs.slice(0, 20) // To avoid being blocked by the website due to too many requests.
            
            const hrefs_map = hrefs_slice.map(async (href) => {
                logger.debug(`scraping page ${href}`)
                
                try {
                    const item_selectors = { 
                        name_selector, 
                        img_selector, 
                        price_selector,
                        description_selector,
                        one_color_selector,  
                        colors_selector,
                        color_container_attribute,
                        href
                    }
    
                    const item = await scrapeItem(browser, item_selectors)

                    const [href_id_slice_start, href_id_slice_end] = href_id_slice_positions

                    item.item_id = href.slice(href_id_slice_start, href_id_slice_end)
                    item.store = store
                    item.pattern = pattern
                    item.url = href
                    item.date = new Date().toLocaleString()
    
                    return item
                } catch (error) {
                    logger.error(error)
                }
            })
            
            const items = await Promise.all(hrefs_map)

            const unique_items = removeDuplicatesFromArrayOfObjects(items, 'item_id')

            logger.debug(`scraped item ${JSON.stringify(unique_items)}`)
    
            await browser.close()
        
            await registerItems(unique_items)
            
            logger.debug('end scraping')
        } catch (error) {
            logger.error(error)
        }
    })()
}

module.exports = scrapeCollection
