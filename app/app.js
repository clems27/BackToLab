// Import required modules
const express = require("express");
const path = require("path");
const mysql = require("mysql2")

// Create an Express application
var app = express();


// Connection to database , | CONNECTION is (db)

  const db2 = mysql.createConnection({
  host: 'db', // your database host
  port: 3306,
  user: 'root', // your database user
  password: 'password', // your database password
  database: 'sdb', // your database name
});

// Connect to the database
db2.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
});





// Serve static files (CSS, images, etc.) from the "src" folder
app.use(express.static(path.join(__dirname, "..", "src")));

// Set Pug as the view engine and specify the directory for Pug templates
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "..", "src", "views"));

/*
  Route: Home Page
  This route renders the home page using the "index.pug" template.
*/
app.get("/", (req, res) => {
  res.render("index");
});





/*
  TEST ROUTE WITH DB, WORKING
*/


app.get("/user", function (req, res) {
  const sql = 'SELECT * FROM users'; // Your SQL query to fetch all users

  db2.query(sql, (err, results) => { // connection (db)
    if (err) {
      console.error("Error fetching data: " + err);
      return res.status(500).json({ message: "Error fetching data" });
    }
    res.json(results); // Send the results as a JSON response
  });
});



/*
  DYNAMIC ROUTE FOR USERS 
*/

app.get("/users/:id", function(req, res) {
  const userID = req.params.id;
  const sql = 'SELECT * FROM users WHERE id = ?';

  db2.promise().query(sql, [userID])
    .then(([results]) => {
      res.json(results);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message }); 
    });
});




/*
  DYNAMIC ROUTE FOR RECIPES,
*/

app.get("/recipes/:id", function(req, res) {
  const userID = req.params.id;
  const sql = 'SELECT * FROM recipes WHERE id = ?';

  db2.promise().query(sql, [userID])
    .then(([results]) => {
      res.json(results);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});





// Start the server on port 3000 and log a message once it is running
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
