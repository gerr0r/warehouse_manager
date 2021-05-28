import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = ({ link }) => {
    return (
        <nav className='main-nav'>
            <div>Warehouse Manager</div>
            <Link to={`/${link}`} className='link'>{link.toUpperCase()}</Link>
        </nav>
    )
}

export default Navigation
