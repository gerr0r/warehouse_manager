import React from 'react'

import { ReactComponent as Import } from '../svg/import.svg'
import { ReactComponent as Export } from '../svg/export.svg'

import { useQuery, gql } from '@apollo/client'
import getDate from '../utils/date'

const MOVEMENT = gql`
    query GetMovementHistory($warehouseId: Int!) {
        getMovementHistory(warehouseId: $warehouseId) {
            movement_id
            product_name
            stock_amount
            direction
            movement_date
        }
    }
`

const MovementHistoryList = ({ id }) => {

    const { loading, error, data } = useQuery(MOVEMENT, {
        variables: { warehouseId: Number(id) }
    })

    if (loading) return 'Loading...'

    if (error) return `Error! ${error.message}`

    return (
        <div>
            <div>Stock imports/exports history</div>
            <table className='products-table'>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Product name</th>
                        <th>Units</th>
                        <th>Import/Export</th>
                    </tr>                   
                </thead>
                <tbody>
                    {data.getMovementHistory.map(movement =>
                        <tr key={movement.movement_id}>
                            <td className='cell-center'>{getDate(movement.movement_date)}</td>
                            <td>{movement.product_name}</td>
                            <td className='cell-center'>{movement.stock_amount}</td>
                            <td className='cell-center'>{movement.direction === 'IN' ? <Import /> : <Export />}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default MovementHistoryList
