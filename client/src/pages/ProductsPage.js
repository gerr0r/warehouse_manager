import React from 'react'
import Navigation from '../components/Navigation'
import ProductsList from '../components/ProductsList'
import { useQuery, gql } from '@apollo/client'
import AddProductForm from '../components/AddProductForm'

const PRODUCTS = gql`
    query GetProducts {
        getProducts {
            product_id
            product_name
            unit_size
            hazardous
        }
    }
`

const Products = () => {
    const { loading, error, data } = useQuery(PRODUCTS)

    if (loading) return 'Loading...'

    if (error) return `Error! ${error.message}`

    return (
        <div className='page-layout'>
            <Navigation link='warehouses' />
            <AddProductForm />
            <br />
            <ProductsList products={data.getProducts} />
        </div>
    )
}

export default Products
