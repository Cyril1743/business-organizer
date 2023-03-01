DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;
USE business_db

CREATE TABLE departments (
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE roles (
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    CONSTRAINT Fk_department_id 
    FOREIGN KEY (department_id) 
    REFERENCES departments (id)
);

CREATE TABLE employees (
    id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    CONSTRAINT Fk_role_id
    FOREIGN KEY (role_id)
    REFERENCES roles (id)
);

ALTER TABLE employees
ADD FOREIGN KEY (manager_id) REFERENCES employees (id);
