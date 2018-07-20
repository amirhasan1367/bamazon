var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "totti1367",
    database: "bamazon",
    insecureAuth: true
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    managerMenu();
});

function managerMenu() {
    inquirer
        .prompt({
            name: "managerView",
            type: "list",
            message: "Hello manager! What would you like to do today?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            console.log(answer.managerView);

            switch (answer.managerView) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLow();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;
            }

            //connection.end();

        });

}

function viewProducts() {
    console.log("This is what we have in stock. Happy shopping!...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | Price: $" + res[i].price + " | Qty: " + res[i].stock_quantity);
        }
    });
}

function viewLow() {
    console.log("We are running low on the following products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | Price: $" + res[i].price + " | Qty: " + res[i].stock_quantity);
            }
        }
    });
}

function addInventory() {
    console.log("Lets review your inventory to see if something needs to be added...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | Price: $" + res[i].price + " | Qty: " + res[i].stock_quantity);
        }

        inquirer
            .prompt([
                {
                    name: "stockItem",
                    type: "input",
                    message: "Please select the id of the product you would like to add inventory to: ",
                    validate: function (input) {
                        //console.log("this is result " + res)
                        if (isNaN(input)) {
                            return (" \n Error!! Enter a valid product by entering the product id on the left column");
                        }
                        if (parseInt(input) > 10) {
                            return (" \n Error!! Enter a valid product by entering the product id on the left column");
                        }
                        else {
                            return true;
                        }
                    }
                },
                {
                    name: "stockQty",
                    type: "input",
                    message: "How many would you like to add? ",
                    validate: function (input) {
                        //console.log("this is result " + res)
                        if (isNaN(input)) {
                            return (" \n Error!! Enter a valid number");
                        }

                        else {
                            return true;
                        }
                    }
                },
            ]).then(function (answer) {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: res[parseInt(answer.stockItem) - 1].stock_quantity + parseInt(answer.stockQty),
                        },
                        {
                            item_id: answer.stockItem,
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Your inventory is updated. Have a nice day!");
                        
                    })
            })


    });
}

function addProduct(){
    console.log("What would you like to add?\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;



    }) 
}