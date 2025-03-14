// Import required modules
const express = require("express");
const path = require("path");

// Create an Express application
const app = express();

//const db = require('./services/db/sd2-db');

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
  TEST ROUTE WITH DB
*/

/*
app.get("/all-users", function(req, res) {
  var sql = 'select * from users'
  var output = '<table border="1px">';
  db.query(sql).then(results => {

    res.json(results);
  })
  res.send("Hello All users");

}); 

*/

/*
  DYNAMIC ROUTE FOR USERS
*/
/*
  app.get("/users/:id", function(req, res) {
  var userID = req.params.id;
  var sql = 'SELECT * FROM user'

  db.query(sql, [userID]).then(results => {
    res.render(results);
  })

});
*/


/*
  DYNAMIC ROUTE FOR RECIPES
*/

/*
  app.get("/recipes/:id", function(req, res) {
  var recipeID = req.params.id;
  var sql = 'SELECT * FROM recipes'

  db.query(sql, [recipeID]).then(results => {
    res.render(results);
  })

});
*/




// Start the server on port 3000 and log a message once it is running
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
