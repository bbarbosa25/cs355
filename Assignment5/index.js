const express = require('express');
const nedb = require("nedb-promises");

const app = express();
const db = nedb.create('hits.jsonl');

app.use(express.static("public"));
app.use(express.json());

app.get('/hits/:pageID', async (req, res) => {
    const pageID = req.params.pageID;

    try {
        let page = await db.findOne({ page: pageID });

        if (!page) {
            page = { page: pageID, count: 1 };
            await db.insert(page);
        } else {
            page.count += 1;
            await db.update({ page: pageID }, { $set: { count: page.count } });
        }

        res.json({ page: pageID, hits: page.count });
    } catch (error) {
        res.status(500).json({ error: "Error retrieving hit count" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
