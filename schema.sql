DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;
USE business_db

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    CONSTRAINT Fk_department_id 
    FOREIGN KEY (department_id) 
    REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    CONSTRAINT Fk_role_id
    FOREIGN KEY (role_id)
    REFERENCES roles(id) 
);

ALTER TABLE employee
ADD FOREIGN KEY (manager_id) REFERENCES employee(id);
