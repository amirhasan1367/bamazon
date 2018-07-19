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
    readProducts();
});

function readProducts(res) {
    console.log("This is what we have in stock. Happy shopping!...\n");
    connection.query("SELECT item_id, product_name, department_name, price FROM products", function (err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | ");

        }
        //console.log("this is results" + res)
        customerSelection(res);

    });
}

function customerSelection(res) {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "productId",
                    type: "input",
                    message: "Please select the id of the product you would like to purchase: ",
                    validate: function (input) {
                        //console.log("this is result " + res)
                        if (isNaN(input)) {
                            return (" \n Error!! Enter a valid product by entering the product id on the left column");
                        }
                        if (parseInt(input) > 5) {
                            return (" \n Error!! Enter a valid product by entering the product id on the left column");
                        }
                        else {
                            return true;
                        }
                    }
                },
                {
                    name: "orderQty",
                    type: "input",
                    message: "What quantity do you like to order? ",
                    validate: function (input1) {
                        if (isNaN(input1)) {
                            return (" \n Error!! Enter a valid quantity.");
                        }
                        /*                     if (parseInt(input1) > res[parseInt(input) - 1].stock_quantity) {
                                                return (" \n Not enough stock available to fulfill the order!");
                                            } */
                        else {
                            return true;
                        }
                    }

                }
            ]).then(function (answer) {
                /*                 console.log("ID: " + answer.productId);
                                console.log("QTY: " + answer.orderQty);
                                console.log("qty of it" + results[1].stock_quantity); */

                if (parseInt(answer.orderQty) > results[parseInt(answer.productId) - 1].stock_quantity) {
                    console.log(" \n Not enough stock available to fulfill the order!");
                }
                else{
                    var total = parseInt(answer.orderQty) * (results[parseInt(answer.productId) - 1].price);
                    console.log ("Your total is: " + total);
                    updateInventory();
                }
            })
        
    });
}

function updateInventory(){

    connection.end();
}
