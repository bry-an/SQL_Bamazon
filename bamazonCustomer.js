var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(err => {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
    customer.displayItems();
});


let customer = {

    orderTotal: 0,
    cartItems: [],

    displayItems: function () {
        connection.query("SELECT id, product_name, price FROM products", (err, displayedItems) => {
            if (err) throw err;
            console.log("Welcome! Here is a list of our available products:")
            displayedItems.forEach(item => console.log(
                'Product ID: ' + item.id + '\n' +
                'Product Name: ' + item.product_name + '\n' +
                'Price: ' + item.price + '\n' +
                '==============\n'
            ));
            this.selectItem(displayedItems)
        });
    },

    selectItem: function (res) {
        idsArray = [];
        res.forEach(item => idsArray.push(item.id));

        const validateID = (whichItem) => {
            for (var i = 0; i < res.length; i++) {
                if (idsArray.indexOf(parseInt(whichItem)) !== -1) return true;
                else return 'Please enter a valid item id'
            }
        }

        const question = {
            name: 'whichItem',
            type: 'input',
            validate: validateID,
            message: 'Please enter the item number corresponding to the item you would like to purchase:'
        };

        inquirer
            .prompt(question)
            .then(answer => {
                this.selectQuantity(answer);
            });
    },

    selectQuantity: function (answer) {
        const query = 'SELECT stock_quantity, product_name, price FROM products WHERE id = ?';
        const item = answer.whichItem;
        connection.query(query, item, (err, results) => {
            if (err) throw err;

            this.orderTotal = results[0].price;
            this.cartItems.push({ name: results[0].product_name, id: item })
            const stockQuantity = results[0].stock_quantity;

            const validateStock = (quantity) => {
                if (parseInt(quantity) <= stockQuantity) return true;
                else return 'Sorry, your order quantity exceeds our stock quantity of ' + stockQuantity + '.\n Please adjust your quantity'
            }

            const validateQuantity = (quantity) => {
                if (parseInt(quantity) > 0) return true;
                else return 'Please enter a valid quantity';
            }

            const question = {
                name: 'quantity',
                type: 'input',
                validate: validateQuantity && validateStock,
                message: 'How many would you like to order?'
            }

            inquirer
                .prompt(question)
                .then((answer) => {
                    this.orderTotal *= answer.quantity;
                    console.log('Thanks! Your order of ' + answer.quantity + 'x ' + this.cartItems[0].name + ' for $' + this.orderTotal.toFixed(2) + ' has been successfully placed.');
                    this.updateDatabase(answer.quantity);
                    connection.end();
            });
        });
    },

    updateDatabase: function (quantityPurchased) {
        const query = 'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?';
        connection.query(query, [quantityPurchased, this.cartItems[0].id])

    }
}