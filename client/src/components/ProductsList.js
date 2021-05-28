import React from 'react'
import { ReactComponent as Hazard } from '../svg/hazard.svg'

const ProductsList = ({ products }) => {
    return (
        <table className='products-table'>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Product name</th>
                    <th>Unit size [kg]</th>
                    <th>Hazardous</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product =>
                    <tr key={product.product_id}>
                        <td className='cell-right'>{product.product_id}</td>
                        <td>{product.product_name}</td>
                        <td className='cell-center'>{product.unit_size}</td>
                        <td className='cell-center'>{product.hazardous && <Hazard />}</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default ProductsList
