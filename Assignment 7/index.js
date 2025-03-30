const express = require('express');
const nedb = require("nedb-promises");

const app = express();
const db = nedb.create('users.jsonl');

app.use(express.static('public'));
app.use(express.json());

app.get('/users', (req, res) => {
  db.find({})
    .then(users => res.json(users))
    .catch(error => res.json({ error }));
});

app.get('/users/:username', (req, res) => {
  db.findOne({ username: req.params.username })
    .then(doc => {
      if (doc) res.json(doc);
      else res.json({ error: 'Username not found.' });
    })
    .catch(error => res.json({ error }));
});

app.post('/users', (req, res) => {
  const { username, password, name, email } = req.body;
  if (!username || !password || !name || !email)
    return res.json({ error: 'Missing fields.' });
  db.findOne({ username })
    .then(existing => {
      if (existing) res.json({ error: 'Username already exists.' });
      else return db.insert({ username, password, name, email });
    })
    .then(newDoc => { if (newDoc) res.json(newDoc); })
    .catch(error => res.json({ error }));
});

app.patch('/users/:username', (req, res) => {
  const { name, email } = req.body;
  db.update({ username: req.params.username }, { $set: { name, email } })
    .then(numUpdated => {
      if (numUpdated === 0) res.json({ error: 'Something went wrong.' });
      else res.json({ ok: true });
    })
    .catch(error => res.json({ error }));
});

app.delete('/users/:username', (req, res) => {
  db.remove({ username: req.params.username }, { multi: false })
    .then(numDeleted => {
      if (numDeleted === 0) res.json({ error: 'Something went wrong.' });
      else res.json({ ok: true });
    })
    .catch(error => res.json({ error }));
});

app.all('*', (req, res) => res.status(404).send('Invalid URL.'));

app.listen(3000, () => console.log("Server started on http://localhost:3000"));
