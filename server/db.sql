-- CREATE DATABASE management;

CREATE TABLE IF NOT EXISTS warehouse (
    warehouse_id SERIAL PRIMARY KEY,
    warehouse_name VARCHAR(255) NOT NULL,
    capacity SMALLINT NOT NULL CHECK (capacity BETWEEN 5000 AND 20000)
);

CREATE TABLE IF NOT EXISTS product (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL UNIQUE,
    unit_size FLOAT NOT NULL CHECK (unit_size > 0),
    hazardous BOOLEAN DEFAULT FALSE
);

-- many-to-many relationship table
CREATE TABLE IF NOT EXISTS warehouse_product (
    product_id SERIAL REFERENCES product(product_id),
    warehouse_id SERIAL REFERENCES warehouse(warehouse_id),
    current_amount FLOAT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS movement (
    movement_id SERIAL PRIMARY KEY,
    product_id SERIAL REFERENCES product(product_id),
    warehouse_id SERIAL REFERENCES warehouse(warehouse_id),
    direction VARCHAR CHECK (direction IN ('IN', 'OUT')),
    stock_amount FLOAT NOT NULL CHECK (stock_amount > 0),
    movement_date DATE NOT NULL DEFAULT NOW()
);

-- mock up preliminary data

-- add warehouses
INSERT INTO warehouse (warehouse_name, capacity)
VALUES ('Sofia', 5000),
       ('Plovdiv', 10000),
       ('Varna', 15000),
       ('Bourgas', 20000);

-- add some products for the main list
INSERT INTO product (product_name, unit_size, hazardous) 
VALUES ('Chemicals', 10, true),
       ('Fertilizer', 25, true),
       ('Soil', 50, false),
       ('Seeds', 20, false),
       ('Turf', 10, false);

-- import products to warehouses 
INSERT INTO movement (product_id, warehouse_id, stock_amount, direction, movement_date) 
VALUES (1 ,1 , 50, 'IN', DATE('2021-05-01')),
       (2 ,1 , 20, 'IN', DATE('2021-05-03')),
       (1 ,2 , 50, 'IN', DATE('2021-05-10')),
       (2 ,2 , 50, 'IN', DATE('2021-05-15')),
       (3 ,3 , 10, 'IN', DATE('2021-05-12')),
       (5 ,3 , 50, 'IN', DATE('2021-05-20')),
       (4 ,4 , 20, 'IN', DATE('2021-05-11')),
       (5 ,4 , 60, 'IN', DATE('2021-05-21'));

-- sync many-to-many relation
INSERT INTO warehouse_product (product_id, warehouse_id, current_amount) 
VALUES (1, 1, 50),
       (2, 1, 20),
       (1 ,2, 50),
       (2 ,2 ,50),
       (3 ,3 , 10),
       (5 ,3 , 50),
       (4 ,4 , 20),
       (5 ,4 , 60);
