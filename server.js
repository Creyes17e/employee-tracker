var mysql = require("mysql2");
var inquirer = require("inquirer");
const { inherits } = require("util");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employee_trackerdb",
});

connection.connect(function (err) {
  if (err) throw err;
  init();
});

function init() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add departments, roles, & employees",
        "View departments, roles, & employees",
        "Update employees roles",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Add departments, roles, & employees":
          addEmployeeData();
          break;

        case "View departments, roles, & employees":
          viewEmployeeData();
          break;

        case "Update employee roles":
          updateEmployeeRoles();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

function addEmployeeData() {}

function viewEmployeeData() {}

function updateEmployeeRoles() {}
