let mysql = require('mysql');
let inquirer = require('inquirer');
let Product = require('./product')

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
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
    getItems: function () {

        connection.query('SELECT * FROM products', (err, items) => {
            let itemsArr = [];
            if (err) console.log(err);
            items.forEach(item => {
                let newItem = new Product(item.id, item.product_name, item.department_name, item.price, item.stock_quantity);
                itemsArr.push(newItem);
            })
        })
    },

    displayItems: function () {
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
            message: 'Welcome to the Bamazon Manager View',
            name: 'welcome',
            type: 'list',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
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
    viewProducts: function () {
        this.displayItems();
    },

    viewLowInventory: function () {
        connection.query('SELECT * FROM products WHERE stock_quantity < 80', (err, items) => {
            if (err) console.log(err);
            items.forEach(item => console.log(
                'Item Id: ' + item.id + '\n' +
                'Name: ' + item.product_name + '\n' +
                'Price: ' + item.price + '\n' +
                'Quantity: ' + item.stock_quantity + '\n============\n'
            ));
        });
    },

    addToInventory: function () {
        connection.query('SELECT * FROM products', (err, items) => {
            if (err) console.log(err);

            let products = [];
            let names = [];

            const validateQuantity = (quantity) => {
                if (parseInt(quantity) > 0) return true;
                else return 'Please enter a valid quantity'
            }

            items.forEach(item => {
                names.push(item.product_name);
                products.push({ name: item.product_name, id: item.id });
            })
            inquirer.prompt([
                {
                    name: 'selectedProduct',
                    type: 'list',
                    message: 'Add inventory to which product?',
                    choices: products
                },
                {
                    name: 'quantityToAdd',
                    type: 'input',
                    validate: validateQuantity,
                    message: 'How many units?'
                }

            ]).then(answer => {
                let selectedProduct = answer.selectedProduct;
                connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?', [
                    answer.quantityToAdd, answer.selectedProduct
                ], (err, res) => {
                    if (err) console.log(err);

                    else if (res) console.log('Quantity added.');
                }
                )
            })
        })
    },

    addNewProduct: function () {
        console.log('add new product');
    }
}

