const logger = require( "../../logical-echo-api/utils/my-logger" )
const scrapeCollection = require('./scrape-collection')

function scrapeMangoKids() {
    return (async () => {
        try {
            await scrapeCollection( {
                url: 'https://shop.mango.com/es/search?kw=committed&brand=kids&origin=ultimas-busquedas',
                selector: '.bb1c_',
                infinite_scroll: true,
                button_selector: null,
                name_selector: '.product-name', 
                img_selector: '.image-btn > img', 
                price_selector: '.product-sale',
                description_selector: '.product-info-text',
                one_color_selector: false,  
                colors_selector: '.color-container > img',
                color_container_attribute: 'alt',
                href_id_slice_positions: [-13, -5],
                store: 'Mango',
                pattern: 'Kids'
            } )

            logger.debug('end scraping Mango Kids Collection')
        } catch (error) {
            logger.error(error)
        }
    })()
}

module.exports = scrapeMangoKids
