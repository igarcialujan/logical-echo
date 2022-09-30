const logger = require( "../../logical-echo-api/utils/my-logger" )
const scrapeCollection = require('./scrape-collection')

function scrapeBershkaWoman() {
    return (async () => {
        try {
            await scrapeCollection( {
                url: 'https://www.bershka.com/es/mujer/ropa/join-life-c1010343062.html',
                selector: '.grid-card-link',
                infinite_scroll: true,
                button_selector: null,
                name_selector: '.product-title', 
                img_selector: '.image-item-wrapper img', 
                price_selector: '.price-elem',
                description_selector: '.description',
                one_color_selector: null,  
                colors_selector: '.color-name',
                color_container_attribute: 'innerText',
                href_id_slice_positions: [-17, -5],
                store: 'Bershka',
                pattern: 'Woman'
            } )

            logger.debug('end scraping Bershka Woman Collection')
        } catch (error) {
            logger.error(error)
        }
    })()
}

module.exports = scrapeBershkaWoman
