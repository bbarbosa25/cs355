const express = require('express'); // Load express module
const nedb = require("nedb-promises"); // Load nedb module

const app = express(); // Init app
const db = nedb.create('myfile.jsonl'); // Init db

app.use(express.static('public')); // Enable static routing

// Insert route
app.get('/insert', (req, res) => {
    try {
        const doc = JSON.parse(req.query.doc); // Parse document from query
        db.insert(doc)
            .then(doc => {
                res.send('Inserted:\n' + JSON.stringify(doc, null, 2));
            })
            .catch(err => {
                res.send('Could not insert document.');
            });
    } catch (err) {
        res.send('Could not insert document');
    }
});

// Search route
app.get('/search', (req, res) => {
    try {
        const query = JSON.parse(req.query.find); // Parse search query
        db.find(query)
            .then(docs => {
                const results = docs.map(doc =>
                    JSON.stringify(doc, null, 2)
                ).join('\n');
                res.send(results);
            });
    } catch (err) {
        res.send('Could not execute query.');
    }
});

// Default route for handling invalid URLs
app.all('*', (req, res) => {
    res.status(404).send('Invalid URL.');
});

// Start server
app.listen(3000, () => console.log('🚀 Server started: http://localhost:3000'));
