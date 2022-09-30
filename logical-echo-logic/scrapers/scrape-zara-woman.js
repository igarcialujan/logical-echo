const logger = require( "../../logical-echo-api/utils/my-logger" )
const scrapeCollection = require('./scrape-collection')

function scrapeZaraWoman() {
    return (async () => {
        try {
            await scrapeCollection( {
                url: 'https://www.zara.com/es/es/search?searchTerm=join%20life&section=WOMAN',
                selector: '.product-link.product-grid-product__link.link',
                infinite_scroll: true,
                button_selector: null,
                name_selector: '.product-detail-info__header-name', 
                img_selector: '.media-image img', 
                price_selector: '.price-current__amount',
                description_selector: '.product-detail-description p',
                one_color_selector: '.product-detail-selected-color.product-detail-info__color',  
                colors_selector: '.product-detail-color-selector__color-area > span',
                color_container_attribute: 'innerText',
                href_id_slice_positions: [-14, -5],
                store: 'Zara',
                pattern: 'Woman'
            } )

            logger.debug('end scraping Zara Woman Collection')
        } catch (error) {
            logger.error(error)
        }
    })()
}

module.exports = scrapeZaraWoman
