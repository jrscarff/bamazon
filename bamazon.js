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
		connection.query("UPDATE products SET quantity = quantity - ? WHERE id = ?", [number, selection], function(err, response) {
			if (err) {throw err}
		})
		showProducts();
		connection.end();
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