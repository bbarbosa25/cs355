// load express, initiate app
const express = require('express'), app = express();


const PORT = 3000
// static files
app.use(express.static('public'));

// dynamic content routes
var hits = {};
app.get('/hits/:pageID', (req, res) => {
 const pageHits = (hits[req.params.pageID]||0)+1;
 hits[req.params.pageID] = pageHits;
 res.send( (pageHits).toString());
});

// default route
app.all('*',(req,res)=>{res.status(404).send('Invalid URL.')});

// start server
app.listen(PORT, ()=>console.log(
    "Server Started: jttp://localhost:"
));