var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

connection.connect(err => {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
    displayItems();
    // start();
});


function displayItems() {
    connection.query("SELECT id, product_name, price FROM products", (err, res) => {
        if (err) throw err;
        idsArray = [];
        console.log("Welcome! Here is a list of our available products:")
        res.forEach(item => idsArray.push(item.id));
        res.forEach(item => console.log(
            'Product ID: ' + item.id + '\n' +
            'Product Name: ' + item.product_name + '\n' +
            'Price: ' + item.price + '\n' +
            '==============\n'
        ));
        selectItems(res)
    });
}

function selectItems(res) {
    let validateID = (whichItem) => {
        for (var i = 0; i < res.length; i++) {
            if (res[i].id === parseInt(whichItem)) return;
            else return 'Please enter a valid item id'
            // return res[i].id === parseInt(whichItem) || 'Please enter a valid item ID';
        }
    }

    // let validateQuant = (res, entered) {
    //     for (var i = 0; i < res.length; i++) 
    // }
    inquirer
        .prompt([
            {
                name: 'whichItem',
                type: 'input',
                validate: validateID,
                message: 'Please enter the item number corresponding to the item you would like to purchase:'
            },
            // {
            //     name: 'howMany', 
            //     type: 'input', 
            //     validate: (val) => 



            // }
        ]);
}