import React from 'react'

const WarehouseStockList = ({ products }) => {
    return (
        <div>
            <div>Available stock</div>
            <table className='products-table'>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Product name</th>
                        <th>Units</th>
                        <th>Unit size [kg]</th>
                        <th>Total [kg]</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product =>
                        <tr key={product.product_id}>
                            <td className='cell-right'>{product.product_id}</td>
                            <td>{product.product_name}</td>
                            <td className='cell-center'>{product.current_amount}</td>
                            <td className='cell-center'>{product.unit_size}</td>
                            <td className='cell-center'>{product.total}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default WarehouseStockList
