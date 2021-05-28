import React, { useState } from 'react'
import Navigation from '../components/Navigation'
import { useQuery, gql } from '@apollo/client'

import WarehouseData from '../components/WarehouseData'

const WAREHOUSES = gql`
    query GetWarehouses {
        getWarehouses {
            warehouse_id
            warehouse_name
        }
    }
`

const Warehouse = () => {
    const [warehouse, setWarehouse] = useState(false)

    const { loading, error, data } = useQuery(WAREHOUSES)

    if (loading) return 'Loading...'

    if (error) return `Error! ${error.message}`

    return (
        <div className='page-layout'>
            <Navigation link='products' />
            <div className='warehouse-selector'>
                <span>Select warehouse: </span>
                <select defaultValue='header' onChange={(e) => setWarehouse(e.target.value)}>
                    <option disabled value='header'></option>
                    {data.getWarehouses.map(warehouse =>
                        <option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>{warehouse.warehouse_name}</option>
                    )}
                </select>
            </div>
            {warehouse && <WarehouseData id={warehouse} />}
        </div>
    )
}

export default Warehouse
