import context from './context'
import { validateToken, validateItemId } from './helpers/validators'
import retrieveUser from './retrieve-user'
/**
 * Searches for items that meet the query criteria.
 * 
 * @param {string} query The search criteria entered by the user in the search form.
 * 
 * @throws {TypeError} When any of the arguments does not match the correct type.
 */
 function toggleFavItem(token, item_id) {
    // validateToken(token)
    validateItemId(item_id)

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

            const index = favs.indexOf(item_id)

            if (index < 0)
                favs.push(item_id)
            else
                favs.splice(index, 1)

            const res2 = await fetch(`${context.API_URL}/users`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ favs })
            })

            const { status } = res2 

            if (status === 204) {
                return
            } else {
                const { error } = await res2.json()
    
                throw new Error(error)
            }
        } else throw new Error('Unknown error')
    })()
}

export default toggleFavItem
