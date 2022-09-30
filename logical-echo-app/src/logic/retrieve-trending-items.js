import context from './context'
import { validateToken } from "./helpers/validators"
import retrieveUser from './retrieve-user'

/**
 * Retrieves the details of the selected item.
 * 
 * @throws {TypeError} When any of the arguments does not match the correct type.
 */
 function retrieveTrendingItems(token) {
    // if (token)
    //     validateToken(token)
        
    return (async () => {
        if (token) {
            const res = await retrieveUser(token)
            
            // await fetch(`${context.API_URL}/users`, {
            //     method: 'GET',
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // })
    
            const { status } = res 
    
            if (status === 401 || status === 404) {
                // const { error } = res.json()
    
                throw new Error(res)
            } else if (status === 200) {
                // const user = await res.json()
                const user = res
    
                const { favs = [] } = user 
    
                const res2 = await fetch(`${context.API_URL}/items/trend`, {
                    method: 'GET'
                })
    
                const { status } = res2 
    
                if (status === 200) {
                    const items = await res2.json()
    
                    items.forEach(item => {
                        item.isFav = favs.includes(item.item_id)
                    })
    
                    return items 
                } else {
                    const { error } = res2.json()
    
                    throw new Error(error)
                }
            } else throw new Error('Unknown error')
        } else {
            const res = await fetch(`${context.API_URL}/items/trend`, {
                method: 'GET'
            })

            const { status } = res

            if (status === 200) {
                const items = await res.json()

                return items 
            } else {
                const { error } = res.json()

                throw new Error(error)
            }
        }
    })()
}

export default retrieveTrendingItems