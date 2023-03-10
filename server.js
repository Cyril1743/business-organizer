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
})

//function to be call initially
const question = [{
    type: "list",
    message: "What would you like to do?",
    name: "action",
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Update an employee's manager", "Remove department", "Remove role", "Remove employee", "View employees by manager", "Quit"]
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
            case "Update an employee's manager":
                updateManager()
                break
            case "Remove department":
                removeDepartment()
                break
            case "Remove role":
                removeRole()
                break
            case "Remove employee":
                removeEmployee()
                break
            case "View employees by manager":
                viewByManager()
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
    connection.promise().query('SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles \n INNER JOIN departments ON roles.department_id = departments.id;')
        .then(([rows, fields]) => {
            console.table(rows)
        })
        .catch(console.log)
        .then(() => init())
}
function viewEmployees() {
    //MYSQL query to find the table of employee
    connection.promise().query('SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, e2.first_name as manager_first_name, e2.last_name as manager_last_name FROM employees INNER JOIN roles ON roles.id = employees.role_id INNER JOIN departments ON roles.department_id = departments.id LEFT JOIN employees e2 ON employees.manager_id = e2.id;')
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
                for (var i = 0; i < rows.length; i++) {
                    if (rows[i].name == data.rDepartment) {
                        var id = rows[i].id
                    }
                }
                connection.promise().query('INSERT INTO roles (title, salary, department_id) \n VALUES(?,?,?);', [data.rName, data.rSalary, id])
                    .then(console.log(`Added ${data.rName} to ${data.rDepartment}`))
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
            var rolesAndIds = rows
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
                            for (var i = 0; i < rolesAndIds.length; i++) {
                                if (data.eRole == rolesAndIds[i].title) {
                                    var role = rolesAndIds[i].id
                                }
                            }
                            //Finding the manager id if not none
                            if (data.eManager == "None") {
                                var manager = null
                            } else {
                                var firstname = data.eManager.split(" ")
                                for (let i = 0; i < rows.length; i++) {
                                    if (firstname[0] == rows[i].first_name) {
                                        var manager = rows[i].id
                                    }
                                }
                            }
                            connection.promise().query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) \n VALUES (?,?,?,?);`, [data.eFirstName, data.eLastName, role, manager])
                                .then(() => console.log(`Added ${data.eFirstName} ${data.eLastName} to the database`))
                                .then(() => init())
                        })
                })
        })
}
function updateEmployee() {
    //MYSQL query to get the roles
    connection.promise().query("SELECT * FROM roles;")
        .then(([rows, fields]) => {
            var roles = rows.map((element) => {
                return element.title
            })
            var rolesAndIds = rows
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
                            for (var i = 0; i < rolesAndIds.length; i++) {
                                if (data.uRole == rolesAndIds[i].title) {
                                    var role = rolesAndIds[i].id
                                }
                            }
                            var name = data.uName.split(" ")
                            for (let i = 0; i < rows.length; i++) {
                                if (name[0] == rows[i].first_name) {
                                    var nameId = rows[i].id
                                }
                            }
                            connection.promise().query(`UPDATE employees \n SET role_id = ? \n WHERE id = ?;`, [role, nameId])
                                .then(() => { console.log(`Updated ${data.uName} with the role of ${data.uRole}`) })
                                .then(() => init())
                        })
                })

        })
}
function updateManager() {
    connection.promise().query("SELECT * FROM employees")
        .then(([rows, fields]) => {
            var employees = rows.map((element) => {
                return element.first_name + " " + element.last_name
            })
            inquirer.prompt([{
                type: "list",
                message: "Which employee would you like to update?",
                name: "uEName",
                choices: employees
            }, {
                type: "list",
                message: "Who is their new manager?",
                name: "uMName",
                choices: employees
            }])
                .then((data) => {
                    var eName = data.uEName.split(" ")
                    for (let i = 0; i < rows.length; i++) {
                        if (eName[0] == rows[i].first_name) {
                            var nameId = rows[i].id
                        }
                    }
                    var mName = data.uMName.split(" ")
                    for (let i = 0; i < rows.length; i++) {
                        if (mName[0] == rows[i].first_name) {
                            var mNameId = rows[i].id
                        }
                    }
                    connection.promise().query("UPDATE employees \n SET manager_id = ? \n WHERE id = ?", [mNameId, nameId])
                        .then(() => console.log(`Updated ${data.uEName}'s manager`))
                        .then(init())
                })
        })
}
function removeDepartment() {
    connection.promise().query(`SELECT * FROM departments`)
        .then(([rows, fields]) => {
            //getting the list of current departments
            var departments = rows.map((element) => {
                return element.name
            })
            inquirer.prompt([{
                type: "list",
                message: "Which department do you want to remove?",
                name: "rmDepartment",
                choices: departments
            }])
                .then((data) => {
                    connection.promise().query(`DELETE FROM departments WHERE name=?`, [data.rmDepartment])
                        .then(() => console.log(`Deleted ${data.rmDepartment} from departments`))
                        .then(() => init())
                })
        })
}
function removeRole() {
    connection.promise().query('SELECT * FROM roles')
        .then(([rows, fields]) => {
            //MYSQL query to get the roles
            var roles = rows.map((element) => {
                return element.title
            })
            inquirer.prompt([{
                type: "list",
                message: "Which role do you want to remove?",
                name: "rmRole",
                choices: roles
            }])
                .then((data) => {
                    connection.promise().query('DELETE FROM roles WHERE title=?', [data.rmRole])
                        .then(() => console.log(`Removed ${data.rmRole} from roles`))
                        .then(() => init())
                })
        })
}
function removeEmployee() {
    //MYSQL query to get employees
    connection.promise().query("SELECT * FROM employees")
        .then(([rows, fields]) => {
            var employees = rows.map((element) => {
                return element.first_name + " " + element.last_name
            })
            inquirer.prompt([{
                type: "list",
                message: "Which employee would you like to remove?",
                name: "rmEmployee",
                choices: employees
            }])
                .then((data) => {
                    var Ename = data.rmEmployee.split(" ")
                    connection.promise().query('DELETE FROM employees WHERE first_name=?', [Ename[0]])
                        .then(() => console.log(`Removed ${data.rmEmployee} from employees`))
                        .then(() => init())
                })
        })
}
function viewByManager() {
    connection.promise().query("SELECT * FROM employees")
        .then(([rows, fields]) => {
            var employees = rows.map((element) => {
                return element.first_name + " " + element.last_name
            })
            inquirer.prompt([{
                type: "list",
                message: "Which manager do you want to view?",
                name: "vManager",
                choices: employees
            }])
                .then((data) => {
                    var Ename = data.vManager.split(" ")
                    for (var i = 0; i < rows.length; i++) {
                        if (Ename[0] == rows[i].first_name) {
                            var mId = rows[i].id
                        }
                    }
                    connection.promise().query(`SELECT employees.first_name, employees.last_name, e2.first_name AS manager_first_name, e2.last_name AS manager_last_name FROM employees INNER JOIN employees e2 ON employees.manager_id = e2.id WHERE employees.manager_id=?;`, [mId])
                        .then(([rows, fields]) => {
                            if (rows.length != 0){
                            console.table(rows)
                            } else {
                                console.log(`No employees report to ${data.vManager}`)
                            }
                        })
                        .then(() => init())
                })
        })
}
init()
app.listen(PORT, () => { })