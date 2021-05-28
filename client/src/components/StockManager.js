import React, { useState } from 'react'
import AllProductsSelector from './AllProductsSelector'
import WarehouseProductsSelector from './WarehouseProductsSelector'
import { gql, useMutation } from '@apollo/client'

const MOVE_STOCK = gql`
  mutation MoveStock($productId: Int!, $warehouseId: Int!, $amount: Int!, $direction: Direction!) {
      moveStock(productId: $productId, warehouseId: $warehouseId, amount: $amount, direction: $direction) {
        product {
            product_id 
            product_name 
            current_amount
            total
            }
        record {
            movement_id
            product_name
            stock_amount
            direction
            movement_date
            }
        }
    }
`


const StockManager = ({ id }) => {
    const [direction, setDirection] = useState("IN")
    const [amount, setAmount] = useState(1)
    const [productId, setProductId] = useState(0)


    const [moveStock, { loading, error }] = useMutation(MOVE_STOCK, {
        variables: { productId, warehouseId: Number(id), amount, direction },
        update(cache, { data: { moveStock: { product, record } } }) {
            cache.modify({
                fields: {
                    getWarehouseData() {
                        cache.writeQuery({
                            data: product,
                            query: gql`
                                query UpdateStock($id: Int!) {
                                    product_id 
                                    product_name 
                                    current_amount
                                    total
                                }
                            `,
                            variables: { id: productId },
                        })
                    },
                    getWarehouseProducts(existingProducts, { readField }) {
                        if (product.current_amount === 0) {
                            return existingProducts.filter(existingProduct => 
                                productId !== readField('product_id', existingProduct)
                            )
                        }

                    },
                    getMovementHistory(oldHistory = []) {
                        const newRecord = cache.writeFragment({
                            data: record,
                            fragment: gql`
                                 fragment NewRecord on MovementHistory {
                                    movement_id
                                    product_name
                                    stock_amount
                                    direction
                                    movement_date
                                }
                            `
                        })
                        return [...oldHistory, newRecord]
                    }
                }
            })
        },
        onError(error) {
            console.log(error.message)
        }
    })

    function manageWarehouseStock(e) {
        e.preventDefault()
        moveStock()
        setProductId(0)
    }

    function changeDirection(e) {
        setDirection(e.target.id)
        setProductId(0)
    }

    return (
        <form onSubmit={manageWarehouseStock}>
            <div className='add-product'>
                <div className="add-product-field">
                    <label>
                        <input type="radio" id="IN" name="stock" defaultChecked onChange={changeDirection} />Import
                    </label>
                    <label>
                        <input type="radio" id="OUT" name="stock" onChange={changeDirection} />Export
                    </label>
                </div>
                <div className="add-product-field add-product-selector-field ">
                    <div>Product</div>
                    {direction === 'IN' 
                    ? <AllProductsSelector productId={productId} setProductId={setProductId} /> 
                    : <WarehouseProductsSelector id={id} productId={productId} setProductId={setProductId} />}

                </div>
                <div className="add-product-field add-product-amount-field">
                    <div>Units</div>
                    <input value={amount} type="number" name="size" onChange={(e) => setAmount(Number(e.target.value))} />
                </div>
                <div className="add-product-last-field">
                    <button disabled={loading || !productId}>{direction === 'IN' ? 'Import' : 'Export'}</button>
                </div>
            </div>
            {error && <div className="error">{error.message}</div>}
        </form>
    )
}

export default StockManager
