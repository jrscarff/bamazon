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
	showProducts();
	customerOptions();
});

function customerOptions() {
	
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
			}
			else {
				var newQuantity = response[0].quantity - number;
				updateProducts(selection, newQuantity);
			}
		})
		
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
	connection.end();
}