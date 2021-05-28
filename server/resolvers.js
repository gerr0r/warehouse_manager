const pool = require("./db/pool")
const db = require('./db/query')
const calc = require('./utils/calc')


const resolvers = {
    Query: {
        getProducts: async () => {
            try {
                const result = await db.getProducts()
                return result.rows
            } catch (error) {
                console.error(error)
            }
        },
        getWarehouses: async () => {
            try {
                const result = await db.getWarehouses()
                return result.rows
            } catch (error) {
                console.error(error)
            }
        },
        getWarehouseData: async (_, { id }) => {
            try {
                const warehouse = await db.getWarehouse(id)
                if (warehouse.rowCount === 0) throw new Error("Warehouse doesn't exist.")

                const warehouseCapacity = warehouse.rows[0].capacity

                const stock = await db.getWarehouseStock(id)
                let usedSpace = 0
                if (stock.rowCount) {
                    //calc used space
                    stockSizes = [0]
                    for (let i = 0; i < stock.rows.length; i++) {
                        let stockSize = await calc([stock.rows[i].current_amount, stock.rows[i].unit_size], 'multiply')
                        stock.rows[i].total = stockSize
                        stockSizes.push(stockSize)
                    }
                    usedSpace = await calc(stockSizes, 'add')
                }
                // calculate free space
                const freeSpace = await calc([warehouseCapacity, usedSpace], 'subtract')
                return {
                    stock: stock.rows,
                    used: usedSpace,
                    free: freeSpace
                }
            } catch (error) {
                console.error(error)
            }
        },
        getWarehouseProducts: async (_, { id }) => {
            try {
                const result = await db.getWarehouseStock(id)
                return result.rows
            } catch (error) {
                console.error(error)
            }
        },
        getMovementHistory: async (_, { warehouseId }) => {
            try {
                const result = await db.getMovementHistory(warehouseId)
                return result.rows
            } catch (error) {
                console.error(error)
            }
        }
    },
    Mutation: {
        addProduct: async (_, { productName, unitSize, hazardState }) => {
            try {
                if (productName.trim() === '') throw new Error('Product name is required')
                if (unitSize < 1) throw new Error('Minimum unit size is 1')

                const result = await db.addProduct(productName, unitSize, hazardState)
                return result.rows[0]
            } catch (error) {
                console.error(error)
                if (error.code == '23505') throw new Error('Product exists')
                throw new Error(error.message)
            }
        },
        moveStock: async (_, { productId, warehouseId, amount, direction }) => {
            try {
                if (amount < 1) throw new Error("Minimum amount is 1 unit.")
                const product = await db.getProduct(productId)
                // if (result.rowCount === 0) throw new Error("Product doesn't exist.")
                if (product.rowCount === 0) throw new Error("Product doesn't exist.")
                const productSize = await calc([amount, product.rows[0].unit_size], 'multiply')

                const warehouse = await db.getWarehouse(warehouseId)
                if (warehouse.rowCount === 0) throw new Error("Warehouse doesn't exist.")

                const warehouseCapacity = warehouse.rows[0].capacity

                const stock = await db.getWarehouseStock(warehouseId)

                let newStockAmount
                if (direction === 'IN') {
                    let usedSpace = 0
                    if (stock.rowCount) {
                        // check hazard state
                        const warehouseHazardState = stock.rows[0].hazardous
                        const productHazardState = product.rows[0].hazardous
                        if (productHazardState && !warehouseHazardState) {
                            throw new Error("Fail: This product is hazardous.You have non-hazardous products in this warehouse.")
                        } else if (!productHazardState && warehouseHazardState) {
                            throw new Error("Fail: This product is non-hazardous.You have hazardous products in this warehouse.")
                        } else {
                            //calc used space
                            stockSizes = [0]
                            for (let i = 0; i < stock.rows.length; i++) {
                                let stockSize = await calc([stock.rows[i].current_amount, stock.rows[i].unit_size], 'multiply')
                                stockSizes.push(stockSize)
                            }
                            usedSpace = await calc(stockSizes, 'add')
                        }
                    }
                    // calculate free space
                    const freeSpace = await calc([warehouseCapacity, usedSpace], 'subtract')
                    if (productSize > freeSpace) throw new Error("Not enough room.")
                    
                    // at this point we are ok so update database
                    if (stock.rows.find(row => row.product_id === productId)) {
                        newStockAmount = await db.increaseWarehouseProduct(productId, warehouseId, amount)
                    } else {
                        newStockAmount = await db.addWarehouseProduct(productId, warehouseId, amount)
                    }

                } else { // OUT
                    const stockCurrentAmount = stock.rows.find(row => row.product_id === productId).current_amount
                    if (!stockCurrentAmount) {
                        throw new Error("Product not found in stock")
                    } else if (stockCurrentAmount < amount) {
                        throw new Error(`Not enough stock from this product. Current amount: ${stockCurrentAmount}`)
                    } else {
                        newStockAmount = await db.decreaseWarehouseProduct(productId, warehouseId, amount)
                        if (newStockAmount.rows[0].current_amount === 0) await db.clearRecord(productId, warehouseId)
                    }
                }

                const newStockTotalSize = await calc([newStockAmount.rows[0].current_amount, product.rows[0].unit_size], 'multiply')

                const record = await db.moveStock(productId, warehouseId, amount, direction)

                return {
                    product: {
                        product_id: product.rows[0].product_id,
                        product_name: product.rows[0].product_name,
                        current_amount: newStockAmount.rows[0].current_amount,
                        total: newStockTotalSize
                    },
                    record: {
                        movement_id: record.rows[0].movement_id,
                        movement_date: record.rows[0].movement_date,
                        product_name: product.rows[0].product_name,
                        stock_amount: record.rows[0].stock_amount,
                        direction: record.rows[0].direction
                    }
                }
            } catch (error) {
                console.error(error)
                throw new Error(error.message)
            }
        }
    }
}

module.exports = resolvers