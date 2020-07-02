var mysql = require("mysql2");
var inquirer = require("inquirer");
const { inherits } = require("util");
const { forEach } = require("mysql2/lib/constants/charset_encodings");
const consoleTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_trackerdb",
});

connection.connect(function (err) {
  if (err) throw err;
  runApp();
});

function runApp() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Add Role",
        "Add Department",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Departments":
          viewAllDepartments();
          break;

        case "View All Roles":
          viewAllRoles();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Add Role":
          addRole();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

//Displays all employees
function viewAllEmployees() {
  var query = "SELECT * FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("----------Employees----------");
    console.table(res);
    runApp();
  });
}

//Displays all departments
function viewAllDepartments() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("----------Departments----------");
    console.table(res);
    runApp();
  });
}

//Displays all job roles
function viewAllRoles() {
  var query = "SELECT * FROM job_role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("----------Roles----------");
    console.table(res);
    runApp();
  });
}

//Adds employee
function addEmployee() {
  connection.query("SELECT * FROM job_role", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the employee's first name?",
          validate: function (input) {
            if (input === "") {
              return "Invalid input, try again";
            }
            return true;
          },
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the employee's last name?",
          validate: function (input) {
            if (input === "") {
              return "Invalid input, try again";
            }
            return true;
          },
        },
        {
          name: "job_role",
          type: "list",
          message: "What is the employee's role?",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].title);
            }
            return choiceArray;
          },
        },
        {
          name: "emp_manager",
          type: "input",
          message: "Who is the employee's manager?",
        },
      ])
      .then(function (answer) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].title === answer.job_role) {
            answer.role_id = res[i].id;
          }
        }
        var query = "INSERT INTO employee SET ?";
        const values = {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
        };
        connection.query(query, values, function (err) {
          if (err) throw err;
          console.log("The employee has been succesfully added!");
          runApp();
        });
      });
  });
}

//Adds department
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is the new department name?",
      validate: function (input) {
        if (input === "") {
          return "Invalid input, try again";
        }
        return true;
      },
    })
    .then(function (answer) {
      var query = "INSERT INTO department (department_name) VALUES (?)";
      connection.query(query, answer.department, function (err) {
        if (err) throw err;
        console.log(
          `You have successfully added department: ${answer.department.toUpperCase()}.`
        );
      });
      viewAllDepartments();
    });
}

//Adds new job role
function addRole() {
  var query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "What is the title of the new role?",
          validate: function (input) {
            if (input === "") {
              return "Invalid input, try again";
            }
            return true;
          },
        },
        {
          name: "roleSalary",
          type: "input",
          message: "What is the salary of the new role?",
          validate: function (input) {
            if (input === "") {
              return "Invalid input, try again";
            }
            return true;
          },
        },
        {
          name: "departmentChoice",
          type: "list",
          message: "Which department is the new role under?",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].department_name);
            }
            return choiceArray;
          },
        },
      ])
      .then(function (answer) {
        var query2 = "SELECT * FROM department";
        var chosenDept = answer.departmentChoice;
        connection.query(query2, chosenDept, function (err, res) {
          if (err) throw err;
          let filterDepartment = res.filter(function (res) {
            return res.department_name == chosenDept;
          });
          let id = filterDepartment[0].id;

          var query3 = "INSERT INTO job_role SET ?";

          connection.query(query3, {
            title: answer.roleTitle,
            salary: parseInt(answer.roleSalary),
            department_id: id,
          });
          console.log(
            `You have successfully added role: ${answer.roleTitle.toUpperCase()}.`
          );
        });
        viewAllRoles();
      });
  });
}

//Updates employee's job role
function updateEmployeeRole() {
  var query = "SELECT * FROM job_role";
  connection.query(query, function (err, res) {
    connection;
  });
}

//Removes an employee
//TODO REMOVE EMPLOYEE FUNCTIONALITY
function removeEmployee() {
  var query = "SELECT * FROM employee";
  connection.query(query, function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "removeEmp",
          type: "list",
          message: "Which employee would you like to remove?",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              var firstName = `${res[i].first_name} `;
              var lastName = `${res[i].last_name} `;
              var combined = firstName.concat(lastName);

              choiceArray.push(combined);
            }
            return choiceArray;
          },
        },
      ])
      .then(function (answer) {
        connection.query(
          "DELETE FROM employee WHERE ?",
          {
            id: answer.removeEmp,
          },
          function (err, res) {
            if (err) throw err;
          }
        );
        viewAllEmployees();
      });

    console.log("success");
  });
}
