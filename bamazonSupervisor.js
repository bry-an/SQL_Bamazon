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
    supervisorInterface.welcomePrompt();
});

let supervisorInterface = {
    welcomePrompt: function() {
        let questions = {
            message: 'Welcome to the Bamazon Supervisor View', 
            name: 'welcome', 
            type: 'list', 
            choices: ['View Product Sales by Department', 'Create New Department']
        }

        inquirer
            .prompt(questions)
            .then(answer => {
                if (answer.welcome === 'View Product Sales by Department')
                    this.viewSales();
                else if(answer.welcome === 'Create New Department')
                    this.createDepartment();
            })
    },

    viewSales: function() {

    }

}