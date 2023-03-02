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

//Connecting node to MYSQL
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
        switch (data.action) {
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
    connection.promise().query('SELECT * FROM departments;')
        .then(([rows, fields]) => {
            console.table(rows)
        })
        .catch(console.log)
        .then(() => init())
}
function viewRoles() {
    //MYSQL query to find the table of roles
    connection.promise().query('SELECT * FROM roles \n INNER JOIN departments ON roles.department_id = departments.id;')
        .then(([rows, fields]) => {
            console.table(rows)
        })
        .catch(console.log)
        .then(() => init())
}
function viewEmployees() {
    //MYSQL query to find the table of employee
    connection.promise().query('SELECT * FROM employees \n INNER JOIN roles ON roles.id = employees.role_id \n INNER JOIN departments ON roles.department_id = departments.id;')
        .then(([rows, fields]) => {
            console.table(rows)
        })
        .catch(console.log)
        .then(() => init())
}
function addDepartment() {
    //MYSQL query to add new row into department table with the name of data.name
    inquirer.prompt({
        type: "input",
        message: "What department do you want to add?",
        name: "dName"
    }).then((data) => {
        connection.promise().query(`INSERT INTO departments (name) \n VALUES (?);`, [data.dName])
            .then(console.log(`Added new ${data.dName} to database`))
            .then(() => init())
    })
}
function addRole() {
    //MYSQL query to add new role to departments
    connection.promise().query('SELECT * FROM departments')
        .then(([rows, fields]) => {
            //getting the list of current departments
            var departments = rows.map((element) => {
                return element.name
            })
            inquirer.prompt([{
                type: "input",
                message: "What's the name of the role?",
                name: "rName"
            }, {
                type: "number",
                message: "What is the salary of the position?",
                name: "rSalary"
            }, {
                type: "list",
                message: "Which department does the role belong to?",
                name: "rDepartment",
                choices: departments
            }]).then((data) => {
                //Finding the department id
                var index = departments.indexOf(data.rDepartment)
                connection.promise().query('INSERT INTO roles (title, salary, department_id) \n VALUES(?,?,?);', [data.rName, data.rSalary, index + 1])
                    .then(console.log(`Added ${data.rName} to ${departments[index]}`))
                    .then(() => init());
            })
        });
}
function addEmployee() {
    //MYSQL query to get the roles
    connection.promise().query("SELECT * FROM roles;")
        .then(([rows, fields]) => {
            var roles = rows.map((element) => {
                return element.title
            })
            //MYSQL query to get employees
            connection.promise().query("SELECT * FROM employees")
                .then(([rows, fields]) => {
                    var employees = rows.map((element) => {
                        return element.first_name + " " + element.last_name
                    })
                    employees.push("None")
                    inquirer.prompt([{
                        type: "input",
                        message: "What is the employee's first name?",
                        name: "eFirstName"
                    }, {
                        type: "input",
                        message: "What is the employee's last name?",
                        name: "eLastName"
                    }, {
                        type: "list",
                        message: "What is the role?",
                        name: "eRole",
                        choices: roles
                    }, {
                        type: "list",
                        message: "Who is their manager?",
                        name: "eManager",
                        choices: employees
                    }])
                        .then((data) => {
                            //Finding the role id
                            var role = roles.indexOf(data.eRole)
                            //Finding the manager id if not none
                            if (data.eManager == "None") {
                                var manager = null
                            } else {
                                var manager = employees.indexOf(data.eManager) + 1
                            }
                            connection.promise().query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) \n VALUES (?,?,?,?);`, [data.eFirstName, data.eLastName, role + 1, manager])
                                .then(() => console.log(`Added ${data.eFirstName} ${data.eLastName} to the database`))
                                .then(() => init())
                        })
                })
        })
}
function updateEmployee() {
    connection.promise().query("SELECT * FROM roles;")
        .then(([rows, fields]) => {
            var roles = rows.map((element) => {
                return element.title
            })
            //MYSQL query to get employees
            connection.promise().query("SELECT * FROM employees")
                .then(([rows, fields]) => {
                    var employees = rows.map((element) => {
                        return element.first_name + " " + element.last_name
                    })
                    inquirer.prompt([{
                        type: "list",
                        message: "Which employee would you like to assign a new role to?",
                        name: "uName",
                        choices: employees
                    }, {
                        type: "list",
                        message: "Select new role:",
                        name: "uRole",
                        choices: roles
                    }])
                    .then((data) => {
                        var employee = employees.indexOf(data.uName) + 1
                        var role = roles.indexOf(data.uRole) + 1
                        connection.promise().query(`UPDATE employees \n SET role_id = ? \n WHERE id = ?;`, [role, employee])
                        .then(() => {console.log(`Updated ${data.uName} with the role of ${data.uRole}`)})
                        .then(() => init())
                    })
                })
                
        })
}
init()
app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})