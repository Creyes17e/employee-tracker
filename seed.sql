USE employee_trackerdb;

INSERT INTO department (department_name) values ("Sales");
INSERT INTO department (department_name) values ("Accounting");
INSERT INTO department (department_name) values ("Human Resources");
INSERT INTO department (department_name) values ("Marketing");

INSERT INTO job_role (title, salary, department_id) values ("Sales Manager", 60000, 1);
INSERT INTO job_role (title, salary, department_id) values ("Accountant", 80000, 2);
INSERT INTO job_role (title, salary, department_id) values ("HR Manager", 85000, 1);
INSERT INTO job_role (title, salary, department_id) values ("Director", 120000, 2);
INSERT INTO job_role (title, salary, department_id) values ("Executive Director", 110000, 2);
INSERT INTO job_role (title, salary, department_id) values ("Sales Person", 40000, 3);


INSERT INTO employee (first_name, last_name, role_id) values ("Mary", "Sanchez", 2);
INSERT INTO employee (first_name, last_name, role_id) values ("Robert", "Dawn", 3);
INSERT INTO employee (first_name, last_name, role_id) values ("David", "Rise", 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) values ("Mike", "Ike", 2, 3);