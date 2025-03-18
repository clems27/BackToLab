// Import required modules
const express = require("express");
const path = require("path");
const mysql = require("mysql2");

// Create an Express application
var app = express();

// Connection to database (db2)
const db2 = mysql.createConnection({
  host: 'db', // your database host
  port: 3306,
  user: 'root', // your database user
  password: 'password', // your database password
  database: 'sdb', // your database name
});

// Serve static files (CSS, images, etc.) from the "src" folder
app.use(express.static(path.join(__dirname, "..", "static")));

// Set Pug as the view engine and specify the directory for Pug templates
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "..", "app", "views"));

/*
  Route: Home Page
  This route renders the home page using the "index.pug" template.
*/
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/search_recipes", (req, res) => {
  res.render("search_recipes");
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

/*
  Route to render the shopping list form
*/

/*
  Route to render the shopping list form
*/
app.get("/shopping_list", (req, res) => {
  res.render("create_shopping_list");
});

/*
  Route to handle shopping list form submission
*/
app.post("/save-shopping-list", (req, res) => {
  const rawList = req.body.shoppingList || "";
  const shoppingList = rawList.split("\n").map(item => item.trim()).filter(item => item.length > 0);
  // Logic to save 'shoppingList' to a database or file can be added here
  res.render("shopping_list", { shoppingList });
});


/*
  TEST ROUTE WITH DB, WORKING
*/
app.get("/user", function (req, res) {
  const sql = 'SELECT * FROM users'; // Your SQL query to fetch all users

  db2.query(sql, (err, results) => { // connection (db)
    if (err) {
      console.log('Error fetching users:', err);
      res.status(500).send('Error fetching users');
      return;
    }
    res.json(results); // Send the results as a JSON response
  });
});

/*
  DYNAMIC ROUTE FOR USERS
*/
app.get("/user/:id", function (req, res) {
  const userID = req.params.id;
  const sql = 'SELECT * FROM users WHERE id = ?';

  db2.promise().query(sql, [userID])
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.log('Error fetching user:', err);
      res.status(500).send('Error fetching user');
    });
});

/*
  DYNAMIC ROUTE FOR RECIPES
  This will fetch and render a single recipe
*/
app.get("/recipes/:id", function (req, res) {
  const recipeID = req.params.id;

  // SQL query to get the recipe and its ingredients
  const sql = `
    SELECT r.id, r.title, r.description, r.instructions, r.image_url, i.name AS ingredient_name, i.quantity, i.unit
    FROM recipes r
    LEFT JOIN ingredients i ON r.id = i.recipe_id
    WHERE r.id = ?
  `;

  db2.promise().query(sql, [recipeID])
    .then(([results]) => {
      if (results.length > 0) {
        // Separate the ingredients for rendering
        const recipe = {
          id: results[0].id,
          title: results[0].title,
          description: results[0].description,
          instructions: results[0].instructions,
          image: results[0].image_url,
          ingredients: results.map(ingredient => ({
            name: ingredient.ingredient_name,
            quantity: ingredient.quantity,
            unit: ingredient.unit
          }))
        };
        
        // Render the recipe template with recipe and ingredients
        res.render('recipe', { recipe });
      } else {
        res.status(404).send('Recipe not found');
      }
    })
    .catch((err) => {
      console.log('Error fetching recipe:', err);
      res.status(500).send('Error fetching recipe');
    });
});

/*
  DYNAMIC ROUTE FOR ALL RECIPES
  This will fetch and render all recipes
*/
app.get("/recipes", function (req, res) {
  const sql = 'SELECT * FROM recipes';

  db2.promise().query(sql)
    .then(([recipes_results]) => {
      res.render('all-recipes', { recipes: recipes_results });
    })
    .catch((err) => {
      console.log('Error fetching recipes:', err);
      res.status(500).send('Error fetching recipes');
    });
});

/*
  This route will render a home page dynamically based on users
*/
app.get('/home', (req, res) => {
  const sql = 'SELECT * FROM users'; // Query to get all users

  db2.promise().query(sql)
    .then(([users]) => {
      res.render('home', { users });
    })
    .catch((err) => {
      console.log('Error fetching users:', err);
      res.status(500).send('Error fetching users');
    });
});



app.get("/recipes/search/results", (req, res) => {
  const recipeId = req.query.id; // Get the recipe ID from the query string

  if (!recipeId) {
    return res.render("search", { recipe: null, message: "Please enter a recipe ID" });
  }

  // SQL query to fetch recipe and ingredients
  const sql = `
    SELECT r.id, r.title, r.description, r.instructions, r.image_url, 
           i.name AS ingredient_name, i.quantity, i.unit
    FROM recipes r
    LEFT JOIN ingredients i ON r.id = i.recipe_id
    WHERE r.id = ?
  `;

  db2.promise().query(sql, [recipeId])
    .then(([results]) => {
      if (results.length > 0) {
        // Structure the recipe data
        const recipe = {
          id: results[0].id,
          title: results[0].title,
          description: results[0].description,
          instructions: results[0].instructions,
          image_url: results[0].image_url,
          ingredients: results.map(ingredient => ({
            name: ingredient.ingredient_name,
            quantity: ingredient.quantity,
            unit: ingredient.unit
          }))
        };

        // Render the search page with the found recipe
        res.render("search", { recipe, message: null });
      } else {
        res.render("search", { recipe: null, message: "Recipe not found" });
      }
    })
    .catch((err) => {
      console.error("Error fetching recipe:", err);
      res.status(500).send("Error fetching recipe");
    });
});



// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
