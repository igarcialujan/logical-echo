const logger = require('../../../logical-echo-api/utils/my-logger')

const isElementVisible = async (page, selector) => {
    logger.debug('start checking element is visible')

    let visible = true

    await page
        .waitForSelector(selector, { visible: true, timeout: 2000 })
        .catch(() => {
            logger.debug('element not visible')

            visible = false
        })
    
    return visible
}

async function clickLoadMoreButton(page, button_selector) {
    logger.debug('start clicking load more button')

    let load_more_visible = await isElementVisible(page, button_selector)
    logger.debug(load_more_visible)

    while (load_more_visible) {
        logger.debug('load more button visible')

        // await page.waitForSelector(button_selector)

        await page
        .click(button_selector)
        .catch(() => {})

        await page.waitForTimeout(2000)
        
        load_more_visible = await isElementVisible(page, button_selector)
    }
    
    
    // try {
    //     await page.evaluate(async (page, button_selector, visibility_check_selector) => {
    //         await new Promise (async (resolve, reject) => {
    //             const selector = visibility_check_selector ?? button_selector
    //             let load_more_visible = await isElementVisible(page, selector)
            
    //             while (load_more_visible) {
    //                 await page
    //                 .click(button_selector)
    //                 .catch(() => {})
                    
    //                 load_more_visible = await isElementVisible(page, selector)
    //             }
            
    //             resolve()
    //         })
    //     }, page, button_selector, visibility_check_selector)
    // } catch (error) {
    //     logger.error(error)
    // }
}

module.exports = clickLoadMoreButton