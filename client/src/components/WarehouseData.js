import React from 'react'
import StockManager from '../components/StockManager'
import WarehouseStockList from '../components/WarehouseStockList'
import MovementHistoryList from '../components/MovementHistoryList'

import { useQuery, gql } from '@apollo/client'

const WAREHOUSE = gql`
    query GetWarehouse($id: Int!) {
        getWarehouseData(id: $id) {
            stock {
                product_id
                product_name
                unit_size
                current_amount
                total
            }
            used
            free
        }
    }
`

const WarehouseData = ({ id }) => {
    const { loading, error, data } = useQuery(WAREHOUSE, {
        variables: { id: Number(id) }
    })


    if (loading) return 'Loading...'

    if (error) return `Error! ${error.message}`

    return (
        <div>
            <StockManager id={id} />
            {data.getWarehouseData.stock.length > 0 && <WarehouseStockList products={data.getWarehouseData.stock} />}
            <div className='warehouse-capacity-info'>
                <div>Space used : {data.getWarehouseData.used} <small>kg</small></div>
                <div>Space left : {data.getWarehouseData.free} <small>kg</small></div>
            </div>
            <div>
            </div>
            <MovementHistoryList id={id} />
        </div>
    )
}

export default WarehouseData
