import context from './context'
import { validateItemId, validateToken } from "./helpers/validators"
import retrieveUser from './retrieve-user'

/**
 * Retrieves the details of the selected item.
 * 
 * @param {string} id The id of the item being retrieved.
 * 
 * @throws {TypeError} When any of the arguments does not match the correct type.
 */
 function retrieveItem(token, item_id) {
    if (token)
        validateToken(token)

    validateItemId(item_id)

    return (async () => {
        if (token) {     
            const res = await fetch(`${context.API_URL}/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    
            const { status } = res 
    
            if (status === 401 || status === 404) {
                const { error } = await res.json()
        
                throw new Error(error)    
            } else if (status === 200) {
                const user = await res.json()
    
                const { favs = [] } = user 
    
                const res2 = await fetch(`${context.API_URL}/items/${item_id}`, {
                    method: 'GET'
                })
    
                const { status } = res2 
    
                if (status === 200) {
                    const item = await res2.json()
    
                    item.isFav = favs.includes(item.item_id)
                    
                    console.log(item)
    
                    return item 
                } else {
                    const { error } = await res2.json()
        
                    throw new Error(error)
                }
            } else throw new Error('Unknown error')
        } else {
            const res = await fetch(`${context.API_URL}/items/${item_id}`, {
                method: 'GET'
            })

            const { status } = res 

            if (status === 200) {
                const item = res.json()

                return item 
            } else {
                const { error } = await res.json()
    
                throw new Error(error)
            }
        }
    })()
 }

export default retrieveItem