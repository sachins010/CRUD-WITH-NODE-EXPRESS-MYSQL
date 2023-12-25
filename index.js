
// const express = require("express");

// const mysql = require('mysql2');
// const bodyParser = require('body-parser');
// const app = express();

// app.use(bodyParser.json())



// var mysqlConnection = mysql.createConnection({
//     host : 'localhost',
//     user : 'root',
//     password : 'root',
//     database : 'mememployeedb'
// })

// mysqlConnection.connect((err)=>{
//     if(err){
//         console.error('Error in DB connection',err);
//     }
//     else{
//         console.log('DB connected successfully');
//     }
// });

// mysqlConnection.query(
//     "CREATE TABLE IF NOT EXISTS users ( emp_id INT AUTO_INCREMENT PRIMARY KEY, emp_name VARCHAR(40) NOT NULL ,salary int  )",
//     (err) => {
//         if(err){
//             console.error("Error creating users table:",err);
//         }
//         else{
//             console.log("Table is created ");
//         }
//     }
// );

// mysqlConnection.query(
//     "INSERT INTO users (emp_name , salary ) VALUES (?,?)",
//     [emp_name , salary],

//     (err)=>{
//         if(err){
//             console.log("Error inserting data:",err);
//         }
//     }
// )

// app.post('/mememployeedb',(req,res)=>{

//     const {emp_name , salary} = req.body;

//     mysqlConnection.query(
//         "INSERT INTO users (emp_name,salary) values(?,?)",
//         [emp_name , salary],

//         (err)=>{

//             if(err){
//                 console.log("error in inserting data:",err);
//                 res.status(500).console.log("Internal server error");

//             }else{
//             console.log("data successfully inserted");
//             res.status(201).console.log("user registerd successfully");
//              }
            
//         }

//     )
    
// })

// app.listen(3000,()=>console.log('Express server is running on port 3000'))


const express = require("express");
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

/* connection of mysql node to database */

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mememployeedb'
});

mysqlConnection.connect((err) => {
    if (err) {
        console.error('Error in DB connection', err);
    } else {
        console.log('DB connected successfully');
    }
});

// creating a table 
mysqlConnection.query(
    "CREATE TABLE IF NOT EXISTS users ( emp_id INT AUTO_INCREMENT PRIMARY KEY, emp_name VARCHAR(40) NOT NULL, salary INT )",
    (err) => {
        if (err) {
            console.error("Error creating users table:", err);
        } else {
            console.log("Table is created");
        }
    },
    
            // Reset the AUTO_INCREMENT value for emp_id to 1
            mysqlConnection.query("ALTER TABLE users AUTO_INCREMENT = 1", (err) => {
                if (err) {
                    console.error("Error resetting AUTO_INCREMENT:", err);
                } else {
                    console.log("AUTO_INCREMENT reset successfully");
                }
            })
);

// POST api to insert the data into table
app.post('/mememployeedb', (req, res) => {
    const { emp_name, salary } = req.body;

    mysqlConnection.query(
        "INSERT INTO users (emp_name, salary) VALUES (?, ?)",
        [emp_name, salary],
        (err) => {
            if (err) {
                console.error("Error inserting data:", err);
                res.status(500).send("Internal server error");
            } else {
                console.log("Data successfully inserted");
                res.status(201).send("User registered successfully");
            }
        }
    );
});


// Get or retriew the data from table
app.get('/mememployeedb', (req, res)=>{
    mysqlConnection.query(
        "SELECT * FROM users",
        (err,results)=>{
            if(err){
                console.log("error to get data:",err);
                res.status(500).send("error to get data:");
            }else{
                console.table(results);
                res.status(201).json(results);
            }
        }
    )
})

// delete the data in table
app.delete('/mememployeedb', (req, res)=>{
    const {emp_id} = req.body;
    mysqlConnection.query(
        " DELETE from users where emp_id = ?",
        [emp_id],
        (err,results)=>{
            if(err){
                console.log("Id is not found",err);
                res.status(500).send("Id is not found");
            }else{
                console.log("Data deleted successfully");
                res.status(200).send("Data deleted successfully :");
            }
        }
       
    )
})

// Updating the data inside the table
app.put('/mememployeedb', (req, res)=>{
    const emp_id = req.body.emp_id;
    const{emp_name, salary}=req.body;
    mysqlConnection.query(
        "UPDATE users SET emp_name = ?, salary = ? WHERE emp_id = ?",
        [emp_name, salary, emp_id],
        (err, results) => {
            if (err) {
                console.error("Error updating user:", err);
                res.status(500).send("Internal server error");
            } else {
                console.log("User updated successfully");
                res.status(200).send("User updated successfully");
            }
        }
    )
})
app.listen(3001, () => console.log('Express server is running on port 3001'));
