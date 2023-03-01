//NPM packages to be used
const express = require("express")
const mysql = require("mysql2")
const inquirer = require("inquirer")
const cTable = require("console.table")

//initializing express for server
const app = express()
const PORT = process.env.PORT || 3001

//Middleware for express
app.use(express.json())

//Connecting node to mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "Punkie15",
    database: "business_db"
}, console.log("Connected to business_db"))

//function to be call initially
const question = [{
    type: "list",
    message: "What would you like to do?",
    name: "action",
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Quit"]
}]
function init() {
    inquirer.prompt(question).then((data) => {
        switch(data.action){
            case "View all departments":
                viewDepartments()
                break
            case "View all roles":
                viewRoles()
                break
            case "View all employees":
                viewEmployees()
                break
            case "Add a department":
                addDepartment()
                break
            case "Add a role":
                addRole()
                break
            case "Add an employee":
                addEmployee()
                break
            case "Update an employee role":
                updateEmployee()
                break
            case "Quit":
                break
            default:
                console.log("No response recieved!")
        }
            
    })
}
function viewDepartments() {
    //function to view to departments
    connection.promise().query('SELECT * FROM departments')
        .then(([rows, fields]) => {
            console.log(rows)
            console.log(fields)
            console.table(rows)
        })
        .catch(console.log)
        .then(()=> init())
}
function viewRoles() {
    //mysql query to find the table of roles
    connection.promise().query('SELECT * FROM roles')
        .then(([rows, fields]) => {
            console.table(rows)
        })
        .catch(console.log)
        .then(() => init())
}
function viewEmployees() {
    //myqsl query to find the table of employees
    connection.promise().query('SELECT * FROM employees')
        .then(([rows, fields]) => {
            console.table(rows)
        })
        .catch(console.log)
        .then(() => init())
}
function addDepartment() {
    inquirer.prompt({
        type: "input",
        message: "What department do you want to add?",
        name: "dName"
    }).then((data) => {
        connection.promise().query(`INSERT INTO departments (name) \n VALUES (?);`, [data.dName])
            .then(console.log(`Added new ${data.dName} to database`))
            .then(()=> init())
        //TODO: mysql query to add new row into department table with the name of data.name
    })
}
function addRole() {
    connection.promise().query('SELECT * FROM departments')
        .then(([rows, fields]) => {
            var departments = rows.map((element) => {
                return element.name
            })
            inquirer.prompt([{
                type: "input",
                message: "What's the name of the role?",
                name: "rName"
            },{
                type: "number",
                message: "What is the salary of the position?",
                name: "rSalary"
            }, {
                type: "list",
                message: "Which department does the role belong to?",
                name: "rDepartment",
                choices: departments
            }]).then((data) =>{
                connection.promise().query(`INSERT INTO roles (name, salary, department) \n VALUES (?, ?, ?)`, [data.rName, data.rSalary, data.rDepartment])
                    .then(console.log(`${data.rName} added to the database`))
                    .then(init())
            })
        })
}
function addEmployee() {
    connection.promise().query("SELECT * FROM departments")
    inquirer.prompt({
        type: "input",
        message: "What is the employee's first name?",
        name: "eFirstName"
    },{
        type: "input",
        message: "What is the employee's last name?",
        name: "eLastName"
    },{
        type: "input",
        message: "What is the "
    })
}
init()
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})