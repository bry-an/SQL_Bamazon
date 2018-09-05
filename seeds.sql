DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon; 

USE bamazon;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT, 
    product_name VARCHAR(50) NOT NULL, 
    department_name VARCHAR(40) NOT NULL, 
    price DECIMAL(8, 2),
    stock_quantity INT
);

INSERT INTO products 
    (product_name, department_name, price, stock_quantity)
VALUES 
    ("A Gentleman in Moscow", "Books_Fiction", 15.99, 200),
    ("Exit West", "Books_Fiction", 12.99, 250),
    ("The Sound and the Fury", "Books_Fiction", 9.99, 300),
    ("Barn Burning", "Short-Stories", 5.99, 130),
    ("Lincoln in the Bardo", "Books_Fiction", 17.99, 90),
    ("Sing Unburied Sing", "Books_Fiction", 13.99, 200),
    ("A Higher Loyalty", "Books_Non-Fiction", 16.99, 70),
    ("A Rose for Emily", "Short-Stories", 4.99, 170),
    ("Lab Girl", "Books_Non-Fiction", 12.99, 230),
    ("Clean Code", "Books_Non-Fiction", 10.99, 45);

SELECT * FROM products;