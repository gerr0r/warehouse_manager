const pool = require('./pool')

async function query(text, params) {
    try {
        const result = await pool.query(text, params)
        return result
    } catch (error) {
        throw error
    }
}

async function getProduct(id) {
    const text = "SELECT * FROM product WHERE product_id=$1"
    const values = [id]
    return await query(text, values)
}

async function getProducts() {
    const text = "SELECT * FROM product"
    return await query(text)
}

async function addProduct(productName, unitSize, hazardState) {
    const text = "INSERT INTO product (product_name, unit_size, hazardous) \
                    VALUES ($1, $2, $3) \
                    ON CONFLICT (product_name) DO NOTHING \
                    RETURNING *"
    const values = [productName, unitSize, hazardState]
    return await query(text, values)
}

async function getWarehouse(id) {
    const text = "SELECT * FROM warehouse WHERE warehouse_id=$1"
    const values = [id]
    return await query(text, values)
}

async function getWarehouses() {
    const text = "SELECT warehouse_id, warehouse_name FROM warehouse"
    return await query(text)
}


async function getWarehouseStock(id) {
    const text = "SELECT product_id, product_name, current_amount, unit_size, hazardous \
                    FROM warehouse_product \
                    INNER JOIN product USING(product_id) \
                    WHERE warehouse_id=$1"
    const values = [id]
    return await query(text, values)
}

async function addWarehouseProduct(productId, warehouseId, amount) {
    const text = "INSERT INTO warehouse_product (product_id, warehouse_id, current_amount) VALUES ($1,$2,$3) RETURNING *"
    const values = [productId, warehouseId, amount]
    return await query(text, values)
}

async function increaseWarehouseProduct(productId, warehouseId, amount) {
    const text = "UPDATE warehouse_product SET current_amount = current_amount + $3 \
                    WHERE product_id=$1 AND warehouse_id=$2 RETURNING *"
    const values = [productId, warehouseId, amount]
    return await query(text, values)
}

async function decreaseWarehouseProduct(productId, warehouseId, amount) {
    const text = "UPDATE warehouse_product SET current_amount = current_amount - $3 \
                    WHERE product_id=$1 AND warehouse_id=$2 RETURNING *"
    const values = [productId, warehouseId, amount]
    return await query(text, values)
}

async function moveStock(productId, warehouseId, amount, direction) {
    const text = "INSERT INTO movement (product_id, warehouse_id, stock_amount, direction, movement_date) VALUES ($1,$2,$3,$4,DEFAULT) RETURNING *"
    const values = [productId, warehouseId, amount, direction]
    return await query(text, values)
}

async function clearRecord(productId, warehouseId) {
    const text = "DELETE FROM warehouse_product WHERE product_id=$1 AND warehouse_id=$2"
    const values = [productId, warehouseId]
    return await query(text, values)
}

async function getMovementHistory(warehouseId) {
    const text = "SELECT movement_id, movement_date, product_name, stock_amount, direction \
                    FROM movement \
                    INNER JOIN product \
                    USING(product_id) \
                    WHERE warehouse_id=$1 \
                    ORDER BY movement_id"
    const values = [warehouseId]
    return await query(text, values)
}

module.exports = {
    getProduct,
    getProducts,
    addProduct,
    getWarehouse,
    getWarehouses,
    getWarehouseStock,
    addWarehouseProduct,
    increaseWarehouseProduct,
    decreaseWarehouseProduct,
    moveStock,
    clearRecord,
    getMovementHistory
}