import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { ReactComponent as Hazard } from '../svg/hazard.svg'

const ADD_PRODUCT = gql`
  mutation AddProduct($productName: String!, $unitSize: Int!, $hazardState: Boolean!) {
      addProduct(productName: $productName, unitSize: $unitSize, hazardState: $hazardState) {
        product_id 
        product_name 
        unit_size
        hazardous
        }
    }
`

const AddProductForm = () => {
    const [productName, setProductName] = useState('')
    const [unitSize, setUnitSize] = useState(1)
    const [hazardState, setHazardState] = useState(false)

    const [addProduct, { loading, error }] = useMutation(ADD_PRODUCT, {
        variables: { productName, unitSize, hazardState },
        update(cache, { data: { addProduct } }) {
            cache.modify({
                fields: {
                    getProducts() {
                        cache.writeQuery({
                            data: addProduct,
                            query: gql`
                                query NewProduct {
                                    product_id 
                                    product_name 
                                    unit_size
                                    hazardous
                                }
                            `
                        })
                    }
                }
            })
        },
        onError(error) {
            console.log(error.message)
        }
    })

    function submitProductForm(e) {
        e.preventDefault()
        addProduct()
        setProductName('')
        setUnitSize(1)
        setHazardState(false)
    }

    return (
        <div>
            <h2 className='header'>Add product</h2>
            <form onSubmit={submitProductForm}>
                <div className='add-product'>
                    <div className='add-product-field'>
                        <div>Product name</div>
                        <input value={productName} type="text" name="name" onChange={(e) => setProductName(e.target.value)} />
                    </div>
                    <div className='add-product-field'>
                        <div>Size per unit</div>
                        <input value={unitSize} type="number" name="size" onChange={(e) => setUnitSize(Number(e.target.value))} />
                    </div>
                    <div className='add-product-field'>
                        <div className='hazard-icon'><Hazard /></div>
                        <input checked={hazardState} type="checkbox" name="hazard" onChange={(e) => setHazardState(!hazardState)} />
                    </div>
                    <div className='add-product-last-field'>
                        <button disabled={loading}>+</button>
                    </div>
                </div>
                {error && <div className='error'>{error.message}</div>}
            </form>
        </div>
    )
}

export default AddProductForm
