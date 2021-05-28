import React from 'react'
import { useQuery, gql } from '@apollo/client'

const PRODUCTS = gql`
    query GetProducts($id: Int!)  {
        getWarehouseProducts(id: $id) {
            product_id
            product_name
        }
    }
`
const WarehouseProductsSelector = ({ id, productId, setProductId }) => {
    const { loading, error, data } = useQuery(PRODUCTS, {
        variables: { id: Number(id) }
    })
    
    if (loading) return 'Loading...'

    if (error) return `Error! ${error.message}`

    return (
        <select value={productId} onChange={(e) => setProductId(Number(e.target.value))}>
            <option value={0} disabled></option>
            {data.getWarehouseProducts.map(product =>
                <option key={product.product_id} value={product.product_id}>{product.product_name}</option>
            )}
        </select>
    )
}

export default WarehouseProductsSelector
