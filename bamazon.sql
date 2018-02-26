DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	id INT(10) AUTO_INCREMENT NOT NULL,
	name VARCHAR(45),
	department VARCHAR(45),
	price DECIMAL(30, 2),
	quantity INT(10),
	PRIMARY KEY (id)
);

INSERT INTO products (name, department, price, quantity)
VALUES ("Sunglasses", "Apparel", 10.00, 100), ("Monopoly", "Games", 15.50, 50), ("Fallout 4", "Games", 60.00, 150), ("Desk", "Furniture", 100.00, 25), ("Sandals", "Apparel", 17.00, 75), ("Playing Cards", "Games", 1.50, 2500), ("Jeans", "Apparel", 50.00, 450), ("Folding Chair", "Furniture", 15.00, 6300), ("Pajamas", "Apparel", 9.50, 800), ("Toothpaste", "Misc", 2.50, 1000);