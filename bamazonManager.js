let mysql = require('mysql');
let inquirer = require('inquirer');

let connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(err => {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
    managerInterface.welcomePrompt();
});

let managerInterface = {
    displayItems: function() {
        connection.query('SELECT * FROM products', (err, items) => {
            if (err) console.log(err);
            items.forEach(item => console.log(
                'Item Id: ' + item.id + '\n' + 
                'Name: ' + item.product_name + '\n' +
                'Price: ' + item.price + '\n' +
                'Quantity: ' + item.stock_quantity + '\n============\n'
            ));
        });
    },
    welcomePrompt: function () {
        let questions = {
            name: 'welcome',
            type: 'list',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
        };
        inquirer
            .prompt(questions)
            .then(answer => {
                switch (answer.welcome) {
                    case 'View Products for Sale':
                        managerInterface.viewProducts();
                        break;
                    case 'View Low Inventory':
                        managerInterface.viewLowInventory();
                        break;
                    case 'Add to Inventory':
                        managerInterface.addToInventory();
                        break;
                    case 'Add New Product':
                        managerInterface.addNewProduct();
                        break;
                }
            });
        },
    viewProducts: function() {
        this.displayItems();
    },

    viewLowInventory: function() {
        connection.query('SELECT * FROM products where stock_quantity < 5', (err, items) => {
            if (err) console.log(err);
            items.forEach(item => console.log(
                'Item Id: ' + item.id + '\n' + 
                'Name: ' + item.product_name + '\n' +
                'Price: ' + item.price + '\n' +
                'Quantity: ' + item.stock_quantity + '\n============\n'
            ));
        });
    },

    addToInventory: function() {
        console.log('add to inventory');
    },

    addNewProduct: function() {
        console.log('add new product');
    }
}

