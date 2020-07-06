var mysql = require("mysql2");
var inquirer = require("inquirer");
const { inherits } = require("util");
const { forEach } = require("mysql2/lib/constants/charset_encodings");
const consoleTable = require("console.table");
const logo = require("asciiart-logo");
const config = require("./package.json");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_trackerdb",
  // multipleStatements: true,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log(logo(config).render());
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
        "Remove Role",
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

        case "Remove Role":
          removeRole();
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
    console.log("------------------Employees------------------");
    console.table(res);
    runApp();
  });
}

//Displays all departments
function viewAllDepartments() {
  var query = "SELECT * FROM department";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("------------------Departments------------------");
    console.table(res);
    runApp();
  });
}

//Displays all job roles
function viewAllRoles() {
  var query = "SELECT * FROM job_role";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("--------------------Roles--------------------");
    console.table(res);
    runApp();
  });
}

//Adds employee
function addEmployee() {
  var query = "SELECT * FROM job_role";

  connection.query(query, function (err, res) {
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
              choiceArray.push({
                name: res[i].department_name,
                value: res[i].id,
              });
            }
            return choiceArray;
          },
        },
      ])
      .then(function (answer) {
        var query2 = "SELECT * FROM department";

        connection.query(query2, answer.departmentChoice, function (err, res) {
          if (err) throw err;

          var query3 = "INSERT INTO job_role SET ?";
          var values = {
            title: answer.roleTitle,
            salary: parseInt(answer.roleSalary),
            department_id: answer.departmentChoice,
          };
          connection.query(query3, values);
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
  var query = "SELECT first_name, last_name, role_id, id FROM employee";
  var query2 = "SELECT title, id FROM job_role";

  connection.query(query, function (err, res) {
    connection.query(query2, function (err2, res2) {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "empName",
            type: "list",
            message: "Which employee's role would you like to update?",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < res.length; i++) {
                choiceArray.push({
                  name: res[i].first_name + " " + res[i].last_name,
                  value: res[i].id,
                });
              }
              return choiceArray;
            },
          },
          {
            name: "listOfRoles",
            type: "list",
            message: "Select a new role for the employee",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < res2.length; i++) {
                choiceArray.push({
                  name: res2[i].title + "--" + " Role ID: " + res2[i].id,
                });
              }
              return choiceArray;
            },
          },
          {
            name: "updatedRole",
            type: "input",
            message: "What is the new role's id?",
            validate: function (input) {
              if (input === "") {
                return "Invalid input, try again";
              }
              return true;
            },
          },
        ])
        .then(function (answer) {
          var query3 = `UPDATE employee SET role_id = ? WHERE id = ?`;
          var values = [answer.updatedRole, answer.empName];

          connection.query(query3, values, function (err, res) {
            if (err) throw err;
            console.log(
              `You have successfully updated the employee's job role to ${answer.listOfRoles}`
            );
          });
          viewAllEmployees();
        });
    });
  });
}

//Removes Roles that were created
function removeRole() {
  var query = "SELECT * FROM job_role";

  connection.query(query, function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "removeRole",
          type: "list",
          message: "Which role would you like to remove?",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].title);
            }
            return choiceArray;
          },
        },
      ])
      .then(function (answer) {
        var query2 = "DELETE FROM  job_role WHERE ?";
        connection.query(query2, { title: answer.removeRole }, function (
          err,
          res
        ) {
          if (err) throw err;
          console.log(
            `You have successfully removed the role:${answer.removeRole}`
          );
          viewAllRoles();
        });
      });
  });
}

//Removes an employee
//TODO REMOVE EMPLOYEE FUNCTIONALITY
function removeEmployee() {
  var query =
    'SELECT CONCAT_WS (" ",first_name,last_name) AS full_name FROM employee';

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
              choiceArray.push({ name: res[i].full_name, value: res[i].id });
            }
            return choiceArray;
          },
        },
      ])
      .then(function (answer) {
        var query2 = "DELETE FROM employee WHERE id=?";
        connection.query(
          query2,
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
