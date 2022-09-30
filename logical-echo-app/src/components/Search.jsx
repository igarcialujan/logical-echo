import { useQueryParams } from '../hooks'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logger from '../utils/logger'
import './Search.css'

function Search() {
    logger.debug('Search -> render')

    const queryParams = useQueryParams()

    const [query, setQuery] = useState(queryParams.get('q'))
    
    const navigate = useNavigate()

    // useEffect(() => {
    //     // let navbar = document.querySelector('.navbar')
    //     // let scroll_end = (window.innerHeight + window.scrollY) >= document.body.offsetHeight
    //     const search = document.querySelector('.search')
    //     // let images = document.querySelectorAll('.thumbnail')
    //     search.classList.add('show')
    // }, [])

    const search = query => {
        setQuery(query)

        navigate(`/items?q=${query}`)
    }

    return <>
            <form className="search-form form" onSubmit={event => {
                event.preventDefault()

                const query = event.target.query.value 

                search(query)
            }}>
                <input className="field" type="text" placeholder="Search criteria" name="query" defaultValue={query} />
                <button type="submit" className="button button--medium clickable">Search</button>
            </form>
    </>
}

export default Search