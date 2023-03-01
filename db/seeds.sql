INSERT INTO departments (id, name)
VALUES 
    (1, 'Pharmacy'),
    (2, 'Customer Service'),
    (3 ,'Accounting'),
    (4, 'Meat'),
    (5, 'Seafood'),
    (6, 'Grocery');
INSERT INTO roles (id, title, salary, department_id)
VALUES
    (1, "Pharmacy Intern", 75000, 1),
    (2, "Pharmacy Tech", 90000, 1),
    (3, "Customer Service Manager", 60000, 2),
    (4, "Customer Service Associate", 30000, 2),
    (5, "Accounting Manager", 100000, 3),
    (6, "Accountant", 50000, 3),
    (7, "Meat Manager", 40000, 4),
    (8, "Meat Associate", 30000, 4),
    (9, "Seafood Manager", 40000, 5),
    (10, "Seafood Associate", 30000, 5),
    (11, "Grocery Manager", 40000, 6),
    (12, "Cashier", 20000, 6),
    (13, "Grocery Assistant Manager", 30000, 6);
SELECT * FROM roles