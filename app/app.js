// Import express.js and path module
const express = require("express");
const path = require("path");

// Update the path to the db file relative to the new location of app.js
const db = require("./services/db");

// Create express app
const app = express();

// Set static files location (serve CSS, images, etc.)
// Since app.js is in "app", we need to go up one level to reach the "src" folder
app.use(express.static(path.join(__dirname, "..", "src")));

// Serve the homepage (index.html) when accessing "/"
// The index.html file is located in "../src/html/index.html"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "src", "html", "index.html"));
});

// Route for database testing
app.get("/db_test", async (req, res) => {
    try {
        const sql = "SELECT * FROM test_table";
        const results = await db.query(sql);
        res.json(results);
    } catch (err) {
        res.status(500).send("Database error");
    }
});

// Dynamic route for /hello/:name
app.get("/hello/:name", (req, res) => {
    res.send("Hello " + req.params.name);
});

// Goodbye route
app.get("/goodbye", (req, res) => {
    res.send("Goodbye world!");
});

// Start server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
