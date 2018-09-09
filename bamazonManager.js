let mysql = require('mysql');
let inquirer = require('inquirer');

let connection = mysql.createConnection({
    multipleStatements: true,
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

    validateNumericInput: (quantity) => {
        if (parseInt(quantity) > 0 && !isNaN(quantity)) return true;
        else return 'Please enter a valid number'
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
        console.log('The following products are currently for sale')
        connection.query('SELECT * FROM products', (err, items) => {
            if (err) console.log(err);
            items.forEach(item => console.log(
                'Item Id: ' + item.id + '\n' +
                'Name: ' + item.product_name + '\n' +
                'Price: ' + item.price + '\n' +
                'Quantity: ' + item.stock_quantity + '\n============\n'
            ));
            this.next()
        });
    },

    viewLowInventory: function () {
        connection.query('SELECT * FROM products WHERE stock_quantity < 100', (err, items) => {
            if (err) console.log(err);
            console.log('The following items have a quantity fewer than 100\n')
            items.forEach(item => console.log(
                'Item Id: ' + item.id + '\n' +
                'Name: ' + item.product_name + '\n' +
                'Price: ' + item.price + '\n' +
                'Quantity: ' + item.stock_quantity + '\n============\n'
            ));
            this.next();
        });
    },

    addToInventory: function () {
        connection.query('SELECT * FROM products', (err, items) => {
            if (err) console.log(err);

            let products = [];
            items.forEach(item => {
                products.push('id: ' + item.id + ' | ' + 
                    item.product_name)
            });


            let questions = [
                {
                    name: 'selectedProduct',
                    type: 'list',
                    message: 'Add inventory to which product?',
                    choices: products
                },
                {
                    name: 'quantityToAdd',
                    type: 'input',
                    validate: this.validateNumericInput,
                    message: 'How many units?'
                }
            ];

            inquirer
                .prompt(questions)
                .then(answer => {
                    let pipe = answer.selectedProduct.indexOf('|');
                    let product = answer.selectedProduct.slice((pipe + 2));
                    // console.log('try this', answer.selectedProduct.slice((pipe + 2)));
                    // console.log('quantity', answer.quantityToAdd)
                    // console.log('product', answer.selectedProduct)
                connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE product_name = ?', 
                [
                    answer.quantityToAdd, product 
                ], (err, res) => {
                    if (err) console.log(err);
                    if (!res.affectedRows) console.log('Quantity not added. Please try another product and/or quantity');
                    else if (res.affectedRows) console.log('Quantity added.')
                    this.next();
                }
                )
            })
        })
    },

    addNewProduct: function () {
        let questions = 
                [
                    {
                        type: 'input',
                        name: 'product_name',
                        message: 'Name of new product:',
                    },
                    {
                        type: 'input',
                        name: 'department_name',
                        message: 'In which department:'
                    },
                    {
                        type: 'input',
                        name: 'price',
                        message: 'Cost of product:',
                        validate: this.validateNumericInput
                    },
                    {
                        type: 'input',
                        name: 'stock_quantity',
                        message: 'Quantity of product:',
                        validate: this.validateNumericInput
                    },
                ]
        inquirer
            .prompt(questions)
                .then(answer => {
                    connection.query('INSERT INTO products SET ?',
                        {
                            product_name: answer.product_name,
                            department_name: answer.department_name,
                            price: parseInt(answer.price),
                            stock_quantity: parseInt(answer.stock_quantity)
                        }, (err, res) => {
                            if(err) console.log(err);
                            else if(res) console.log('The following product successfully added:\n')
                        }
                    );
                connection.query("SELECT * from products WHERE id = (SELECT MAX(id) from products)",
                    (err, items) => {
                        if (err) console.log(err);
                        items.forEach(item => {
                            console.log(
                                'Item Id: ' + item.id + '\n' +
                                'Name: ' + item.product_name + '\n' +
                                'Department: ' + item.department_name + '\n' +
                                'Price: ' + item.price + '\n' +
                                'Quantity: ' + item.stock_quantity + '\n============\n'
                            )
                        });
                        this.next();
                    }
                );
            });
    }, 

    next: function() {
        inquirer
            .prompt([
                {
                    name: 'continue',
                    type: 'list', 
                    choices: ['Main Menu', 'Exit'],
                    message: 'Please select an option:'
                }
            ]).then(answer => {
                if (answer.continue === 'Main Menu')
                    this.welcomePrompt();
                else if (answer.continue === 'Exit')
                    this.closeConnection();
            });

    },

    closeConnection: function() {
        connection.end();
    }
}

