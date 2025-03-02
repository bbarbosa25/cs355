const express = require("express");
const app = express();
const PORT = 3000;
app.use(express.static("public"));
const breeds = ["labrador", "beagle", "husky", "poodle", "bulldog"];
app.get("/breeds", (req, res) => {
    res.json(breeds);
});
app.listen(PORT, () => {
    console.log(`🐶 Dog API is running on http://localhost:${PORT}`);
});
