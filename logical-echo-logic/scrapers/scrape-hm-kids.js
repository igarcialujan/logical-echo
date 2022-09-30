const logger = require( "../../logical-echo-api/utils/my-logger" )
const scrapeCollection = require('./scrape-collection')

function scrapeHMKids() {
    return (async () => {
        try {
            await scrapeCollection( {
                url: 'https://www2.hm.com/es_es/ninos/sostenibilidad/our-products.html',
                selector: '.item-link',
                infinite_scroll: false,
                button_selector: '.load-more-products button',
                name_selector: '.primary.product-item-headline', 
                img_selector: '.product-detail-thumbnail-image', 
                price_selector: '.Price-module--black-normal__Bh4GY',
                description_selector: '.ProductDescription-module--productDescription__2mqXe p',
                one_color_selector: false,  
                colors_selector: '.product-colors a',
                color_container_attribute: 'title',
                href_id_slice_positions: [-15, -5],
                store: 'H&M',
                pattern: 'Kids'
            } )

            logger.debug('end scraping H&M Kids Collection')
        } catch (error) {
            logger.error(error)
        }
    })()
}

module.exports = scrapeHMKids