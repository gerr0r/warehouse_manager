const { gql } = require('apollo-server')

const typeDefs = gql`
    type Product {
        product_id: Int!
        product_name: String!
        unit_size: Int!
        hazardous: Boolean!
    }
    type ImportProduct {
        product: WarehouseStock
        record: MovementHistory
    }
    type Warehouses {
        warehouse_id: Int!
        warehouse_name: String!
    }
    type WarehouseStock {
        product_id: Int!
        product_name: String!
        current_amount: Int!
        unit_size: Int!
        total: Int!
    }
    type WarehouseData {
        stock: [WarehouseStock]
        used: Int!
        free: Int!
    }
    type WarehouseProducts {
        product_id: Int!
        product_name: String!
    }
    type MovementHistory {
        movement_id: Int!
        product_name: String!
        stock_amount: Int!
        direction: Direction!
        movement_date: String!
    }
    enum Direction {
        IN
        OUT
    }
    type Query {
        getProducts: [Product]!
        getWarehouses: [Warehouses]!
        getWarehouseData(id: Int!): WarehouseData!
        getWarehouseProducts(id: Int!) : [WarehouseProducts]!
        getMovementHistory(warehouseId: Int!): [MovementHistory]
    }
    type Mutation {
        addProduct(productName: String!, unitSize: Int!, hazardState: Boolean!): Product!
        moveStock(productId: Int!, warehouseId: Int!, amount: Int!, direction: Direction!): ImportProduct!
    }
`

module.exports = typeDefs