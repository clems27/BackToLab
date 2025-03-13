// Import required modules
const express = require("express");
const path = require("path");

// Create an Express application
const app = express();

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
  Route: Recipe Details (Dynamic)
  This dynamic route simulates fetching recipe details based on the recipe ID.
  Static data to be replaced with a database query.
*/
app.get("/recipe/:id", (req, res) => {
  const recipe = {
    id: req.params.id,
    title: "Spaghetti Carbonara",
    ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan", "Pepper"],
    method: "Boil pasta. Cook pancetta. Mix eggs and cheese. Combine and serve.",
    prepTime: "10 min",
    cookTime: "20 min",
    country: "Italy"
  };
  res.render("recipe", { recipe });
});

/*
  Route: User Profile (Dynamic)
  This dynamic route simulates a user profile page.
  Replace the sample data with actual user information from database as needed.
*/
app.get("/user/:id", (req, res) => {
  const user = {
    id: req.params.id,
    username: "JohnDoe",
    email: "john@example.com",
    skill: "Toaster",
    recipes: ["Recipe 1", "Recipe 2", "Recipe 3"]
  };
  res.render("user", { user });
});

/*
  Route: Greeting (Optional)
  A simple dynamic route to test passing parameters.
*/
app.get("/hello/:name", (req, res) => {
  res.send(`Hello ${req.params.name}!`);
});

// Start the server on port 3000 and log a message once it is running
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
