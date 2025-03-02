const express = require("express");

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static("public"));

// Object containing available breeds (these are just example breeds)
const breeds = ["labrador", "beagle", "husky", "poodle", "bulldog"];

// GET /breeds → Returns the list of available breeds
app.get("/breeds", (req, res) => {
    res.json(breeds);
});

// Start the server
app.listen(PORT, () => {
    console.log(`🐶 Dog API is running on http://localhost:${PORT}`);
});
