// Import required modules
const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const multer = require("multer");
const { randomInt } = require("crypto");


// Create an Express application
var app = express();

// Connection to database (db)
const db = require("./services/db")

// Serve static files (CSS, images, etc.) from the "static" folder
app.use(express.static(path.join(__dirname, "..", "static")));

// Set Pug as the view engine and specify the directory for Pug templates
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "..", "app", "views"));

// Static Routes for Pages
app.get("/search_recipe", (req, res) => res.render("search_recipe"));
app.get("/upload", (req, res) => res.render("upload"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/shopping_list", (req, res) => res.render("create_shopping_list"));

// Home page with randomized food images
app.get("/", (req, res) => {
  const foodImages = [
    { src: "/images/food1.jpg", alt: "Food 1" },
    { src: "/images/food2.jpg", alt: "Food 2" },
    { src: "/images/food3.jpg", alt: "Food 3" },
    { src: "/images/food4.jpg", alt: "Food 4" },
    { src: "/images/food5.jpg", alt: "Food 5" },
  ];

  // Randomly select an image
  const shuffledImages = foodImages.sort(() => 0.5 - Math.random()).slice(0, 1);
  res.render("index", { images: shuffledImages });
});

// Save Shopping List
app.post("/save-shopping-list", (req, res) => {
  const rawList = req.body.shoppingList || "";
  const shoppingList = rawList.split("\n").map((item) => item.trim()).filter((item) => item.length > 0);
  res.render("shopping_list", { shoppingList });
});

// Route: Home Page (fetch recipes from DB dynamically)
app.get("/home", (req, res) => {
  const sql = "SELECT * FROM recipes";

  db.query(sql)
    .then(([recipes]) => {
      res.render("home", { recipes });
    })
    .catch((err) => {
      console.error("Error fetching recipes:", err);
      res.status(500).send("Error fetching recipes");
    });
});

// Fetch all users from DB 
app.get("/user", function (req, res) {
  const sql = "SELECT * FROM users";

  db.query(sql)
    .then((users) => {
      res.render("users", { users });  
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
      res.status(500).send("Error fetching users");
    });
});



// Dynamic Route for Single User
app.get("/user/:id", function (req, res) {
  const userID = req.params.id;
  const sql = "SELECT * FROM users WHERE id = ?";

  db.query(sql, [userID])
    .then(([results]) => {
      res.json(results);
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      res.status(500).send("Error fetching user");
    });
});

// Fetch and render a single recipe
app.get("/recipes/:id", function (req, res) {
  const recipeID = req.params.id;
  const sql = `
    SELECT r.id, r.title, r.description, r.instructions, r.image_url, 
           i.name AS ingredient_name, i.quantity, i.unit
    FROM recipes r
    LEFT JOIN ingredients i ON r.id = i.recipe_id
    WHERE r.id = ?
  `;

  db.query(sql, [recipeID])
    .then(([results]) => {
      if (results.length > 0) {
        const recipe = {
          id: results[0].id,
          title: results[0].title,
          description: results[0].description,
          instructions: results[0].instructions,
          image: results[0].image_url,
          ingredients: results.map((ingredient) => ({
            name: ingredient.ingredient_name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          })),
        };

        res.render("recipe", { recipe });
      } else {
        res.status(404).send("Recipe not found");
      }
    })
    .catch((err) => {
      console.error("Error fetching recipe:", err);
      res.status(500).send("Error fetching recipe");
    });
});

// Fetch and render all recipes
app.get("/recipes", function (req, res) {
  const sql = "SELECT * FROM recipes";

  db.query(sql)
    .then(([recipes]) => {
      res.render("all-recipes", { recipes });
    })
    .catch((err) => {
      console.error("Error fetching recipes:", err);
      res.status(500).send("Error fetching recipes");
    });
});

// Recipe Search by ID
app.get("/recipes/search/results", (req, res) => {
  const recipeId = req.query.id;

  console.log("Searching for Recipe ID:", recipeId); // Debug log

  const sql = "SELECT * FROM recipes WHERE id = ?";

  db.query(sql, [recipeId])
    .then(([results]) => {
      console.log("Query Results:", results); // Debug log

      if (results.length > 0) {
        res.render("search", { recipe: results[0] });
      } else {
        res.render("search", { recipe: null, message: "Recipe not found" });
      }
    })
    .catch((err) => {
      console.error("Error fetching recipe:", err);
      res.status(500).send("Error fetching recipe");
    });
});

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "static", "images")); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});



// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
