var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",

	password: "",
	database: "bamazon_DB"
})

connection.connect(function(err) {
	if (err) {throw err};
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) {throw err}

		for (var i = 0; i < res.length; i++) {
			console.log(res[i].id, res[i].name, res[i].department, res[i].price, res[i].quantity);
		};
	startOptions();
	})
	
});

function customerOptions() {
	inquirer.prompt([
	{
		message: "What would you like to do?",
		name: "quitOption",
		type: "list",
		choices: ["Purchase an Item", "Quit"]
	}]).then(function(res) {
		if (res.quitOption === "Quit") {
			endBamazon();
		}
		else {	
			inquirer.prompt([
			{
				message: "Enter the id of the item you would like to purchase.",
				name: "choice"
			},
			{
				message: "How many of that item would you like to purchase?",
				name: "number"
			}]).then(function(res) {
				var selection = res.choice;
				var number = parseInt(res.number)
				connection.query("SELECT * FROM products WHERE id = ?", [selection], function(err, response) {
					if (err) {throw err}
					if (number > response[0].quantity) {
						console.log("That is more quantity than we currently have in stock. Please try again.")
						customerOptions();
					}
					else {
						var newQuantity = response[0].quantity - number;
						updateProducts(selection, newQuantity);
						startOptions();
					}
				})
				
			})
		}
	})
	
}

function startOptions() {
	inquirer.prompt([
	{
		message: "Which view would you like to use?",
		name: "mode",
		type: "list",
		choices: ["Customer View", "Manager View", "Quit"]
	}]).then(function(res) {
		switch (res.mode) {
			case "Customer View":
			return customerOptions()

			case "Manager View":
			return managerOptions()

			case "Supervisor View":
			return supervisorOptions()

			case "Quit":
			return endBamazon()
		}
	})
}

function showProducts() {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) {throw err}

		for (var i = 0; i < res.length; i++) {
			console.log(res[i].id, res[i].name, res[i].department, res[i].price, res[i].quantity);
		};
	})
}

function updateProducts(id, quantity) {
	connection.query("UPDATE products SET quantity = ? WHERE id = ?", [quantity, id], function(err, res) {
		if (err) {throw err};
	})
	showProducts();
}

function lowInventory() {
	connection.query("SELECT * FROM products WHERE quantity < 50", function(err, res) {
		if (err) {
			throw err
		}
		for (var i = 0; i < res.length; i++) {
			console.log(res[i].name, res[i].quantity);
		}
		
	})
}

function addInventory() {
	var productArray = [];
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) {
			throw err
		}
		for (var i = 0; i < res.length; i++) {
			productArray.push(res[i].name)
		}
		inquirer.prompt([
		{
			message: "Which item would you like to add inventory to?",
			name: "product",
			type: "list",
			choices: productArray
		},
		{
			message: "How much inventory would you like to add?",
			name: "added"
		}]).then(function(response) {
			connection.query("SELECT id, quantity FROM products WHERE name = ?", [response.product], function(err, res) {
				if (err) {
					throw err
				}
				var oldQuantity = res[0].quantity;
				var added = parseInt(response.added);
				oldQuantity += added;
				updateProducts(res[0].id, oldQuantity);
			})
		})
	})
}

function newProduct() {
	inquirer.prompt([
	{
		message: "What is the product you would like to add?",
		name: "product",
	},
	{
		message: "What department is this product in?",
		name: "department",
		type: "list",
		choices: ["Apparel", "Games", "Furniture", "Misc"]
	},
	{
		message: "What is that product's price?",
		name: "price"
	},
	{
		message: "What is the quantity of the product?",
		name: "quantity"
	}]).then(function(res) {
		var price = parseFloat(res.price);
		var quantity = parseInt(res.quantity);
		connection.query("INSERT INTO products SET ?", {
			name: res.product,
			department: res.department,
			price: price,
			quantity: quantity
		}, function(err, response) {
			if (err) {
				throw err
			}
			console.log(res.product + " has been added to the list of products for sale. Select View Products for sale to see most recent updates.")
		})
	})
}

function managerOptions() {
	inquirer.prompt([
	{
		message: "What would you like to do?",
		type: "list",
		name: "doing",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
	}]).then(function(res) {
		switch (res.doing) {
			case "View Products for Sale":
			return showProducts()

			case "View Low Inventory":
			return lowInventory()

			case "Add to Inventory":
			return addInventory()

			case "Add New Product":
			return newProduct()

			case "Quit":
			return endBamazon()
		}
	})
}

function endBamazon() {
	connection.end();
}