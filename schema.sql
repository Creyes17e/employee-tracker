create database if not exists employee_trackerdb;

use employee_trackerdb;

CREATE TABLE IF NOT EXISTS department(
id int auto_increment,
department_name varchar(100) not null,
primary key(id)
);

CREATE TABLE IF NOT EXISTS job_role(
id int auto_increment primary key,
title varchar(30),
salary decimal(10,0) not null,
department_id int not null,
foreign key(department_id)
references department(id)

);

CREATE TABLE IF NOT EXISTS employee(
id int auto_increment,
first_name varchar(30),
last_name varchar(30),
role_id int not null,
manager_id int,
primary key(id),
foreign key (role_id)
references job_role(id),
foreign key(manager_id) 
references employee(id)
);
