import context from './context'
// import { validateToken } from './helpers/validators'
import retrieveUser from './retrieve-user'
/**
 * Retrieves items that the user has stored in his favs list.
 * 
 * @param {string} token The token received from the API when the user is logged in the application.
 * 
 * @throws {TypeError} When any of the arguments does not match the correct type.
 */
 function retrieveFavItems(token) {
    // validateToken(token)

    return (async () => {
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

            if (favs.length) {
                let items = []

                await Promise.all(favs.map(async (id, index) => {
                    const res2 = await fetch(`${context.API_URL}/items/${id}`,{
                        method: "GET"
                      })
          
                    if (res2.ok) {
                        const item = await res2.json()

                        if (!item) return new Error(`no item found with id ${id}`)
                                
                        items[index] = item
          
                        if (index === favs.length - 1) {
                            items = items.map(item => ( { ...item, isFav: true } ))
                        }
                    }
                }))

                return items
                // const res2 = await fetch(`${context.API_URL}/items/favs`, {
                //     method: 'GET',
                //     headers: {
                //         'Authorization': `Bearer ${token}`,
                //     }
                // })
        
                // const { status } = res2 
    
                // if (status === 200) {
                //     const items = await res2.json()
                //     console.log(items)
                    
                //     items.forEach(item => item.isFav = true)

                //     return items
                // } else {
                //     const { error } = await res2.json()
        
                //     throw new Error(error)
                // }
            } else throw new Error('No favorites found in your profile')
        } else throw new Error('Unknown error')
    })()
}

export default retrieveFavItems