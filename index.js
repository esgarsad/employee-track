// npm packages set as variables
const inquirer = require("inquirer");
const cTable = require("console.table");

// modules set as variables
const {connection} = require('./db/connection');

let listOfEmployees = [];
let listOfRoles = [];

// function that runs upon starting the file
connection.connect((err) => {
  if (err) throw err;
  
  console.log(``);
  console.log("Employee Tracker");
  console.log(``);
  // calls the initialQuery function that asks the user what they would like to do
  initialQuery();
});

// initial question 
initialQuery = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View department",
        "View roles", 
        "View employees",
        "Add department",
        "Add roles",
        "Add employees",
        "Update employee role",
        "Exit"
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View department":
            connection.query(`SELECT dept_id AS Department_ID, departments.name AS Department_Name FROM departments`, (err, res) => {
                if (err) throw err;
                console.log(' ');
                console.log((`All Departments:`));
                console.table(res);
                console.log(' ');
                initialQuery();
              });
          break;

          case "View roles":
            const query = `SELECT roles.role_id AS Role_ID, roles.title AS Title, CONCAT('$', FORMAT (salary, 0)) AS Salary, departments.name AS Department 
        FROM roles 
        INNER JOIN departments ON roles.dept_id = departments.dept_id 
        ORDER BY roles.role_id ASC`
        connection.query(query, (err, res) => {
          if (err) throw err;
          console.log(' ');
          console.log((`All Roles:`));
          console.table(res);
          console.log(' ');
          initialQuery();
        });
            break;
           
                  
        case "View employees":
            const emplquery = `SELECT emp_id AS Employee_ID, first_name AS First_Name, last_name AS Last_Name, title AS Title, CONCAT('$', FORMAT (salary, 0)) AS Salary, departments.name AS Department 
            FROM employees 
            INNER JOIN roles ON employees.role_Id = roles.role_id 
            INNER JOIN departments ON roles.dept_id = departments.dept_id 
            ORDER BY last_name ASC`
          connection.query(emplquery, (err, res) => {
            if (err) throw err;
            console.log(' ');
            console.log((`All Employees:`));
            console.table(res);
            console.log(' ');
            initialQuery();
          });
          break;

        case "Add department":
            inquirer
          .prompt({
            type: "input",
            name: "dept_add",
            message:
              "What is the name of the department you would like to add?",
            validate: newDeptInput => {
              if (newDeptInput) {
                return true
              } else {
                console.log("Please enter a name for the new department");
                return false
              }
            }
          })
          .then((answer) => {
            console.log(' ');
            console.log((`Department Added:`) + ` ${answer.dept_add}`);
            console.log(' ');
            connection.query("INSERT INTO Departments SET ?", {name: answer.dept_add}, (err, res) => {
                if (err) throw err;
                initialQuery();
              }
            );
          });
            break;

            case "Add roles":
                connection.query(`SELECT * FROM departments`, (err, res) => {
                    if (err) throw err;
                    listOfDepartments = res.map(dept => (
                      {
                        name: dept.name,
                        value: dept.dept_id
                      }
                    ))
                    inquirer
                    .prompt([
                      {
                        type: "input",
                        name: "role_add",
                        message: "What is the name of the role you would like to add?",
                        validate: newRoleInput => {
                          if (newRoleInput) {
                            return true
                          } else {
                            console.log("Please enter a name for the new role");
                            return false
                          }
                        }
                      },
                      {
                        type: "number",
                        name: "salary",
                        message: "What is the salary for the role you would like to add?",
                        default: 10000
                      },
                      {
                        type: "list",
                        name: "deptId",
                        message: "What is the department for the role you would like to add?",
                        choices: listOfDepartments
                      }
                    ])
                    .then((answer) => {
                      console.log(' ');
                      console.log((`Role Added:`) + ` ${answer.role_add} with a salary of ${answer.salary}`);
                      console.log(' ');
                      connection.query("INSERT INTO Roles SET ?",
                        {
                          title: answer.role_add,
                          salary: answer.salary,
                          dept_id: answer.deptId,
                        },
                        (err, res) => {
                          if (err) throw err;
                          initialQuery();
                        }
                      );
                    });
                  })
            break;

            case "Add employees":
                connection.query(`SELECT * FROM roles`, (err,res) => {
                    if (err) throw err;
                    listOfRoles = res.map(role => (
                      {
                        name: role.title,
                        value: role.role_id
                      }
                    ));
                    
                    
                    inquirer
                      .prompt([
                        
                        {
                          type: "input",
                          name: "empAddFirstName",
                          message:
                            "What is the first name of the employee you would like to add?",
                          validate: firstNameInput => {
                            if (firstNameInput) {
                              return true
                            } else {
                              console.log ("Please enter a first name");
                              return false
                            }
                          }
                        },
                        {
                          type: "input",
                          name: "empAddLastName",
                          message:
                            "What is the last name of the employee you would like to add?",
                        },
                        {
                          type: "list",
                          name: "roleId",
                          message: "What is the role of the employee you would like to add?",
                          choices: listOfRoles
                        },
                        {
                          type: "number",
                          name: "empAddMgrId",
                          message:
                            "What is the manager ID of the employee you would like to add?",
                          default: 1,
                        },
                      ])
                      .then((answer) => {
                        console.log(' ');
                        console.log((`Employee Added:`) + ` ${answer.empAddFirstName} ${answer.empAddLastName}`);
                        console.log(' ');
                        connection.query("INSERT INTO Employees SET ?",
                          {
                            last_name: answer.empAddLastName,
                            first_name: answer.empAddFirstName,
                            role_id: answer.roleId,
                            manager_id: answer.empAddMgrId,
                          },
                          (err, res) => {
                            if (err) throw err;
                            initialQuery();
                          }
                        );
                      });
                    })                       
            break;

            case "Update employee role":
               
                let employeeLastName = null;
                
                // asks the user for the last name of the employee they would like to update
                inquirer
                  .prompt([
                    {
                      name: "empLastName",
                      type: "input",
                      message:
                        "What is the last name of the employee you would like to update?",
                    }
                  ])
                  // then it searches the database for employees with that last name and puts them into an array
                  .then((answer) => {
              
                    employeeLastName = answer.empLastName;
                    // db query to find all employees by user inputted last name
                    // then puts part of the response into an array for subsequent inquirer question
                    // then displays info to the user in table
                    const query = `SELECT emp_id AS Employee_ID, first_name AS First_Name, last_name AS Last_Name, title AS Title, salary AS Salary, departments.name AS Department FROM employees 
                    INNER JOIN roles ON employees.role_Id = roles.role_id
                    INNER JOIN departments ON roles.dept_id = departments.dept_id 
                    WHERE ?`;
                    // 
                    connection.query(query, { last_name: answer.empLastName }, (err, res) => {
                      if (err) throw err;
              
                      console.log(` `)
                      console.log((`Employee Information:`));
                      console.table(res);
                      console.log(` `);
              
                      listOfEmployees = res.map(employee => (
                        {
                          name: employee.First_Name,
                          value: employee.Employee_ID
                        }
                      ));
              
                      // db query to find all roles and then put them into an array for a subsequent inquirer question
                      connection.query("SELECT * FROM roles", (err, res) => {
                        if (err) throw err;
              
                        listOfRoles = res.map(role => (
                          {
                            name: role.title,
                            value: role.role_id
                          }
                        ))
              
                        inquirer.prompt([
                          {
                            type: "list",
                            name: "nameConfirm",
                            message: "Please select the employee to confirm",
                            choices: listOfEmployees
                          },
                          {
                            type: "list",
                            name: "roleChoice",
                            message: "Please select a new role for the employee",
                            choices: listOfRoles
                          }
                        ])
                        .then((answers) => {
              
                          const query = `UPDATE employees SET role_id = ${answers.roleChoice} WHERE emp_id = ${answers.nameConfirm}`;
                          connection.query(query, (err, res) => {
                              if (err) throw err;
                          });
                        })
                          .then(() => {
                            const query = `SELECT emp_id AS Employee_ID, first_name AS First_Name, last_name AS Last_Name, title AS Title, salary AS Salary, departments.name AS Department FROM employees 
                              INNER JOIN roles ON employees.role_Id = roles.role_id
                              INNER JOIN departments ON roles.dept_id = departments.dept_id 
                              WHERE ?`;
                            connection.query(query, {last_name: employeeLastName }, (err,res) => {
                              if (err) throw err;
                              console.log(` `);
                              console.log((`Updated Employee Information:`));
                              console.table(res);
                              console.log(` `);
                              initialQuery();
                            })
                          });
                        });        
                    }); 
                }); 
                   
            break;

        case "Exit":
          connection.end();
          break;
      }
    });
}



