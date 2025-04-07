// Import required modules
const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const multer = require("multer");
const { randomInt } = require("crypto");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require("fs");



// Create an Express application
const app = express();

// Connection to database (db)
const db = require("./services/db")

// Session middleware
app.use(session({
  secret: 'magic_recipe',  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Authentication middleware to check for logged-in users (Registered or Admin)
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user && (req.session.user.role === 'REGISTERED_USER' || req.session.user.role === 'MODERATOR')) {
    return next();
  }
  res.status(401).render("login", { message: "You must be logged in as a registered user or admin to access this page.", title: "Login" });
}


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

// Serve registration page 
app.get('/register', (req, res) => {
  res.render('register');  
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



// User Profile Route
app.get("/profile", isAuthenticated, async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.username) {
      console.error("User session not found.");
      return res.redirect("/login");
    }

    const { username, id } = req.session.user;

    const sql = "SELECT username, email, role, skill_level_id FROM users WHERE id = ?";
    const [userData] = await db.query(sql, [id]);

    if (userData.length === 0) {
      return res.status(404).send("User not found.");
    }

    const [uploadedRecipes] = await db.query(
      "SELECT * FROM recipes WHERE user_id = ?",
      [id]
    );

    const [likes] = await db.query(
      `SELECT r.* FROM likes lr 
       JOIN recipes r ON lr.recipe_id = r.id 
       WHERE lr.user_id = ?`,
      [id]
    );

    const shoppingListItems = uploadedRecipes
      .map(r => r.shopping_list)
      .filter(Boolean)
      .flatMap(item => item.split(',').map(i => i.trim()));

    res.render("profile", {
      title: "User Profile",
      user: userData[0],
      recipes: uploadedRecipes,
      likes,
      shopping_list: shoppingListItems,
      message: "Profile loaded successfully",
    });

  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).send("Error fetching user profile");
  }
});


// Edit Profile Route
app.get("/edit-profile", isAuthenticated, (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { id, username, email, role, skill_level_id } = req.session.user;

  res.render("edit-profile", {
    title: "Edit Profile",
    user: { id, username, email, role, skill_level_id },
    error: req.query.error || null,
    success: req.query.success || null
  });
});


// Route to handle profile updates
app.post("/update-profile", isAuthenticated, async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const { id } = req.session.user;
    const { username, email, role, skill_level_id } = req.body;

    if (!username || !email || !role || !skill_level_id) {
      return res.redirect("/edit-profile?error=All fields are required.");
    }

    console.log("Updating user with:", { username, email, role, skill_level_id });

    await db.query(
      "UPDATE users SET username = ?, email = ?, role = ?, skill_level_id = ? WHERE id = ?",
      [username, email, role, skill_level_id, id]
    );

    // Update session
    req.session.user = {
      ...req.session.user,
      username,
      email,
      role,
      skill_level_id
    };

    res.redirect("/edit-profile?success=Profile updated successfully!");
  } catch (err) {
    console.error("Error updating profile:", err);
    res.redirect("/edit-profile?error=An error occurred while updating the profile.");
  }
});








// Fetch and render all recipes
app.get("/recipes", async (req, res) => {
  const sql = "SELECT * FROM recipes";

  try {
    const recipes = await db.query(sql);
    console.log("Fetched Recipes:", recipes); 

    if (recipes.length === 0) {
      return res.render("all-recipes", { recipes: [], message: "No recipes found." });
    }

    res.render("all-recipes", { recipes });
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).send("Error fetching recipes");
  }
});


// Route to get user’s recipe list
app.get('/my recipes', async (req, res) => {
  try {
    const userId = req.session.user.id; 

    // Fetch recipes from the database for the logged-in user
    const [recipes] = await db.query(
      'SELECT id, title, country_origin, image_url FROM recipes WHERE user_id = ?',
      [userId]
    );

    // If no recipes are found, you can handle this case
    if (recipes.length === 0) {
      return res.render('recipes', { message: 'No recipes found!' });
    }

    // Render the recipe list page
    res.render('recipes', { recipes: recipes });

  } catch (error) {
    console.error('Error fetching user recipes:', error.message);
    res.status(500).render('error', { message: 'Error fetching recipes' });
  }
});



// Fetch and render a single recipe
app.get('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;

  try {
    // Fetch recipe from the database
    const [results] = await db.query(
      `SELECT id, user_id, title, country_origin, instructions, prep_duration, cook_duration, image_url, ingredients, shopping_list, diet
       FROM recipes
       WHERE id = ?`, [recipeId]
    );

    console.log("Raw Query Result:", results); 

    // If the result is not an array or is empty, return a 404 error
    if (!results || (Array.isArray(results) && results.length === 0)) {
      return res.status(404).render("error", { message: "Recipe not found" });
    }

    // If the result is an object (not an array), use it directly
    const recipe = Array.isArray(results) ? results[0] : results;

    console.log("Processed Recipe:", recipe);

    // Check if the ingredients are a string, then convert them to an array
    const ingredientsArray = typeof recipe.ingredients === 'string'
      ? recipe.ingredients.split(',').map(ingredient => ingredient.trim())
      : [];
    
    // Check if the shopping list is a string, then convert it to an array
    const shoppingListArray = typeof recipe.shopping_list === 'string'
      ? recipe.shopping_list.split(',').map(item => item.trim())
      : [];

    // Fetch comments for the recipe
    const comments = await db.query(
      `SELECT c.comment_text, u.username, c.created_at 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.recipe_id = ? 
       ORDER BY c.created_at DESC`, 
       [recipeId]
    );

    console.log("Fetched Comments:", comments);

    // Fetch likes count
    const [likeCount] = await db.query(
      `SELECT COUNT(*) AS count 
       FROM likes 
       WHERE recipe_id = ?`, 
       [recipeId]
    );

    console.log("Likes Count:", likeCount);

    const finalRecipe = {
      id: recipe.id,
      user_id: recipe.user_id,
      title: recipe.title,
      country_origin: recipe.country_origin,
      instructions: recipe.instructions,
      prep_duration: recipe.prep_duration,
      cook_duration: recipe.cook_duration,
      image_url: recipe.image_url,
      ingredients: ingredientsArray,
      shopping_list: shoppingListArray,
      diet: recipe.diet,
      comments: comments,
      likeCount: likeCount.count || 0,
    };

    // Render the recipe-detail page with the finalRecipe object
    res.render("recipe-detail", { recipe: finalRecipe });

  } catch (error) {
    console.error("Error fetching recipe:", error.message);
    res.status(500).render("error", { message: "Error fetching recipe" });
  }
});





// Recipe Search by ID
app.get("/recipes/search/results", async (req, res) => {
  const recipeId = req.query.id; 

  // If no recipe ID is provided, show the search form
  if (!recipeId) {
    console.log("No recipe ID provided, showing search bar.");
    return res.render("search", { recipe: null, message: null });
  }

  console.log("Searching for Recipe ID:", recipeId);

  const sql = `
    SELECT r.id, r.user_id, r.title, r.country_origin, r.ingredients, r.instructions, 
           r.prep_duration, r.cook_duration, r.image_url, r.created_at,
           mc.name AS meal_category, sl.level AS skill_level
    FROM recipes r
    LEFT JOIN meal_categories mc ON r.meal_Categories_id = mc.id
    LEFT JOIN skill_levels sl ON r.skill_level_id = sl.id
    WHERE r.id = ?;
  `;

  try {
    const results = await db.query(sql, [recipeId]);

    console.log("Query Results:", results); 

    // If results object has data (it's not empty)
    if (results && results[0]) {
      console.log("Rendering recipe:", results[0]); 
      res.render("search", { recipe: results[0], message: null });
    } else {
      console.log("No recipe found for the given ID");
      res.render("search", { recipe: null, message: "Recipe not found" });
    }
  } catch (err) {
    console.error("Error fetching recipe:", err);
    res.status(500).send("Error fetching recipe");
  }
});



// Comment on a Recipe
app.post("/recipes/:id/comment", isAuthenticated, async (req, res) => {
  const { comment } = req.body;

  if (!comment) {
    console.warn("Empty or missing comment field.");
    return res.status(400).send("Comment is required.");
  }

  try {
    await db.query(
      "INSERT INTO comments (recipe_id, user_id, comment_text) VALUES (?, ?, ?)",
      [req.params.id, req.session.user.id, comment]
    );
    res.redirect(`/recipes/${req.params.id}`);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).send("Error adding comment");
  }
});


// Like a Recipe
app.post("/recipes/:id/like", isAuthenticated, async (req, res) => {
  try {
    await db.query("INSERT INTO likes (recipe_id, user_id) VALUES (?, ?)", [req.params.id, req.session.user.id]);
    res.redirect(`/recipes/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding like");
  }
});


// Registration Route
app.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Check if all fields are filled out
  if (!username || !email || !password || !confirmPassword) {
    return res.render("register", { message: "All fields are required.", title: "Register" });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.render("register", { message: "Passwords do not match.", title: "Register" });
  }

  try {
    // Check if the username or email already exists
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?", [username, email]
    );

    // Verify if rows contain data
    if (rows && rows.length > 0) {
      return res.render("register", { message: "Username or Email already exists.", title: "Register" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    // On successful registration, redirect to login page
    res.render("register", { message: "Registration successful! You can now log in.", title: "Register" });

  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).render("register", { message: "Error registering user. Please try again.", title: "Register" });
  }
});


// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: Username: ${username}, Password: ${password ? "Provided" : "Not Provided"}`);

  try {
    // Fetch user from the database
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    console.log(`Database query result: ${JSON.stringify(rows)}`);

    // Check if the result is an array or an object directly
    const user = Array.isArray(rows) ? rows[0] : rows;

    if (!user) {
      console.log("Login failed: User not found");
      return res.render("login", { message: "User not found", title: "Login" });
    }

    console.log(`User found: ${JSON.stringify(user)}`);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    console.log(`Password match: ${isMatch}`);

    if (!isMatch) {
      console.log("Login failed: Incorrect password");
      return res.render("login", { message: "Incorrect password", title: "Login" });
    }

    // Set session on successful login
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    console.log("Session set after login:", req.session.user);
    
    if (user.role === "MODERATOR") {
      res.redirect("/moderator-dashboard");
    } else {
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error("Error during login process:", err);
    res.status(500).render("login", { message: "Login failed", title: "Login" });
  }
});



// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).send("Error logging out");
    }
    res.redirect("/login");
  });
});


// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use static/images folder for saving uploaded files
    const uploadPath = path.join(__dirname, "..", "static", "images");
    
    // Ensure the folder exists, or create it if necessary
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); 
    }
    
    cb(null, uploadPath); // The folder to store uploaded images
  },
  filename: (req, file, cb) => {
    // Use a unique filename for each file based on current timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Protected Upload Route
app.get('/upload', isAuthenticated, (req, res) => {
  res.render('upload', { 
    title: "Upload Your Recipe", 
    registeredUser: true 
  });
});

// POST route for uploading recipes (protected)
app.post('/upload', isAuthenticated, upload.single('upload-image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Extract form data and file path
  const { title, country_origin, ingredients, instructions, prep_duration, cook_duration, meal_Categories_id, skill_level_id } = req.body;
  const imagePath = '/images/' + req.file.filename;
  const userId = req.session.user.id;

  try {
    // Save the recipe to the database
    await db.query(`
      INSERT INTO recipes (title, country_origin, ingredients, instructions, prep_duration, cook_duration, meal_Categories_id, skill_level_id, image_url, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [title, country_origin, ingredients, instructions, prep_duration, cook_duration, meal_Categories_id, skill_level_id, imagePath, userId]
    );

    res.send('Recipe uploaded successfully!');
  } catch (err) {
    console.error('Error uploading recipe:', err);
    res.status(500).send('Error uploading recipe');
  }
});





// User Dashboard Route
app.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    console.log("User ID:", userId);

    // Fetch user details
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    console.log("User Data:", user);

    // Fetch the user's recipes
    const [recipes] = await db.query("SELECT * FROM recipes WHERE user_id = ?", [userId]);
    console.log("My Recipes:", recipes);

    // Fetch liked recipes
    const [likes] = await db.query(
      `SELECT r.* FROM likes lr 
       JOIN recipes r ON lr.recipe_id = r.id 
       WHERE lr.user_id = ?`, 
      [userId]
    );
    console.log("Liked Recipes:", likes);

   // Fetch shopping list
    const [shoppingList] = await db.query("SELECT * FROM shopping_list WHERE user_id = ?", [userId]);
    console.log("My Shopping List:", shoppingList);  
// Ensure shoppingList is an array (even if the result is undefined or null)
    const shoppingListData = shoppingList || [];
    console.log("Shopping List Data to Render:", shoppingListData); 

        // Render the dashboard with the data
      res.render("dashboard", {
        title: "User Dashboard",
        user: user,
        recipes: recipes || [],
        likes: likes || [],
        shoppingList: shoppingListData,
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).send("Error fetching user profile");
    }
});


//Moderator Route
app.get("/moderator-dashboard", isAuthenticated, async (req, res) => {
  console.log("Moderator dashboard access attempt by:", req.session.user);
  
  if (req.session.user.role !== "MODERATOR") {
    return res.status(403).render("403", { message: "Access denied" });
  }

  try {
    // Assuming you are fetching flagged items from the database
    const [flaggedItems] = await db.query("SELECT * FROM flagged_content");

    // Pass flaggedItems as an empty array if undefined
    res.render("moderator-dashboard", {
      title: "Moderator Dashboard",
      user: req.session.user,
      flaggedItems: flaggedItems || [],
      users: [],
      recipes: [] 
    });
  } catch (error) {
    console.error("Error loading moderator dashboard:", error);
    res.render("moderator-dashboard", {
      title: "Moderator Dashboard",
      user: req.session.user,
      flaggedItems: [],
      users: [],
      recipes: [],
      error: "An error occurred while loading the dashboard."
    });
  }
});


// Error handling for non-existent routes
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});



// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
