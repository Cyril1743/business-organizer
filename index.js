//NPM packages to be used
const express = require("express")
const mysql = require("mysql2")
const inquirer = require("inquirer")
const cTable = require("console.table")

const app = express()
const PORT = process.env.PORT || 3001

const connection = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "Punkie15",
    database: "business_db"
})
//function to be call initially
function init() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name: "action",
        chioces: ["View all departments", "View all roles", "View all employees", "Add a department", "Add an employee", "Update an employee role", "Quit"]
    }]).then((data) => {
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
    //TODO: function to view to departments
    init()
}
function viewRoles() {
    //TODO: mysql query to find the table of roles
    init()
}
function viewEmployees() {
    //TODO: myqsl query to find the table of employees
    init()
}
function addDepartment() {
    inquirer.prompt({
        type: "input",
        message: "What department do you want to add?",
        name: "dName"
    }).then((data) => {
        //TODO: mysql query to add new row into department table with the name of data.name
    })
}
function addEmployee() {
    inquirer.prompt({
        type: "input",
        message: "What is the employees"
    })
}