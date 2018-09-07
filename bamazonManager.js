let mysql = require('mysql');
let inquirer = require('inquirer');
let Product = require('./product')

let connection = mysql.createConnection({
    multipleStatements: true,
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
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit']
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
                    case 'Exit':
                        managerInterface.closeConnection();
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
        this.next();
    },

    addToInventory: function () {
        connection.query('SELECT * FROM products', (err, items) => {
            if (err) console.log(err);

            let names = [];

            const validateQuantity = (quantity) => {
                if (parseInt(quantity) > 0) return true;
                else return 'Please enter a valid quantity'
            };

            let questions = [
                {
                    name: 'selectedProduct',
                    type: 'list',
                    message: 'Add inventory to which product?',
                    choices: names
                },
                {
                    name: 'quantityToAdd',
                    type: 'input',
                    validate: validateQuantity,
                    message: 'How many units?'
                }
            ];

            items.forEach(item => {
                names.push(item.product_name);
            })
            inquirer
                .prompt(questions)
                .then(answer => {
                console.log('in promise')
                connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?', 
                [
                    answer.quantityToAdd, answer.selectedProduct
                ], (err, res) => {
                    if (err) console.log(err);
                    else if (res) console.log('Quantity added.');
                }
                )
            })
        })
        this.next();
    },

    addNewProduct: function () {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'product_name',
                    message: 'Name of new product:'
                },
                {
                    type: 'input',
                    name: 'department_name',
                    message: 'In which department:'
                },
                {
                    type: 'input',
                    name: 'price',
                    message: 'Cost of product:'
                },
                {
                    type: 'input',
                    name: 'stock_quantity',
                    message: 'Quantity of product:'
                },
            ]).then(answer => {
                connection.query('INSERT INTO products SET ?',
                    {
                        product_name: answer.product_name,
                        department_name: answer.department_name,
                        price: parseInt(answer.price),
                        stock_quantity: parseInt(answer.stock_quantity)
                    }, (err, res) => {
                        if(err) console.log(err);
                        else if(res) console.log('The following product successfully added:')
                    }
                );
                connection.query('SELECT * FROM products WHERE ?',
                    { product_name: answer.product_name },
                    (err, items) => {
                        if (err) console.log(err);
                        items.forEach(item => {
                            console.log(
                                'Item Id: ' + item.id + '\n' +
                                'Name: ' + item.product_name + '\n' +
                                'Price: ' + item.price + '\n' +
                                'Quantity: ' + item.stock_quantity + '\n============\n'
                            )
                        });
                    }
                );
            });
        this.next();
    }, 

    next: function() {
        inquirer
            .prompt([
                {
                    name: 'continue',
                    type: 'list', 
                    choices: ['Return to Manager View', 'Exit']
                }
            ]).then(answer=> {
                if (answer.continue === 'Return to Manager View')
                    this.welcomePrompt;
                else if (answer.continue === 'Exit')
                    this.closeConnection;
            });

    },

    closeConnection: function() {
        connection.end();
    }
}

