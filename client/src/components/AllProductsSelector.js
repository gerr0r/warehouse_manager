import React from 'react'
import { useQuery, gql } from '@apollo/client'

const PRODUCTS = gql`
    query GetProducts {
        getProducts {
            product_id
            product_name
        }
    }
`

const AllProductsSelector = ({productId, setProductId}) => {
    const { loading, error, data } = useQuery(PRODUCTS)

    if (loading) return 'Loading...'

    if (error) return `Error! ${error.message}`

    return (
        <select value={productId} onChange={(e) => setProductId(Number(e.target.value))}>
        <option disabled value={0}></option>
        {data.getProducts.map(product => 
            <option key={product.product_id} value={product.product_id}>{product.product_name}</option>
        )}
    </select>
    )
}

export default AllProductsSelector
