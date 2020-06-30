create database if not exists employee_trackerdb;

use employee_trackerdb;

CREATE TABLE IF NOT EXISTS department(
id integer not null primary key,
employee_name varchar(100) not null
);

CREATE TABLE IF NOT EXISTS job_role(
id int not null primary key,
title varchar(30),
salary decimal,
department_id int not null
);

CREATE TABLE IF NOT EXISTS employee(
id int not null primary key,
first_name varchar(30),
last_name varchar(30),
role_id int not null,
manager_id int
);
