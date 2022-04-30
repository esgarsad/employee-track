INSERT INTO departments (dept_name)
VALUES
('Ownership'),
('Acounting'),
('Management'),
('Staff'),


INSERT INTO roles (title, salary, department_id)
VALUES
('Director', 150000, 1),
('Controller', 100000, 2),
('Accountant', 105000, 2),
('Marketing Manager', 95000, 3),
('Staff Manager', 85000, 3),
('Sales Associate', 55000, 4),
('Cashier', 45000, 4),
('Warehouse', 35000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Edgar', 'Nava', 1, NULL),
('Wendy', 'Villaran', 2, 1),
('Rick', 'Mendez', 3, 1),
('Mindy', 'Copper', 4, 1),
('Ale', 'Powell', 5, 1),
('Ralph', 'Mott', 6, 4),
('Craig', 'Ramirez', 7, 5),
('Richard', 'Feathers', 8, 5),

