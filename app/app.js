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
