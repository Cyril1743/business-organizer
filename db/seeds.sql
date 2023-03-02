INSERT INTO departments (name)
VALUES 
    ('Pharmacy'),
    ('Customer Service'),
    ('Accounting'),
    ('Meat'),
    ('Seafood'),
    ('Grocery');

INSERT INTO roles (title, salary, department_id)
VALUES
    ("Pharmacy Intern", 75000, 1),
    ("Pharmacy Tech", 90000, 1),
    ("Customer Service Manager", 60000, 2),
    ("Customer Service Associate", 30000, 2),
    ("Accounting Manager", 100000, 3),
    ("Accountant", 50000, 3),
    ("Meat Manager", 40000, 4),
    ("Meat Associate", 30000, 4),
    ("Seafood Manager", 40000, 5),
    ("Seafood Associate", 30000, 5),
    ("Grocery Manager", 40000, 6),
    ("Cashier", 20000, 6),
    ("Grocery Assistant Manager", 30000, 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
    ("Tess", "Kent", 2, NULL),
    ("Eleni", "Lambert", 1, 1),
    ("Samuel", "Stark", 1, 1),
    ("Josh", "Doe", 1, 1),
    ("Ryan", "Rosales", 3, NULL),
    ("Conrad", "Hancock", 4, 4);
SELECT * FROM roles