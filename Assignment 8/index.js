const express = require('express');
const nedb = require('nedb-promises');
const bcrypt = require('bcrypt');

const app = express();
const db = nedb.create('users.jsonl');

app.use(express.static('public'));
app.use(express.json());

const makeToken = () => Math.random().toString(36).slice(2);
const SALT = 10;

app.get('/users', async (req, res) => {
  try {
    const users = await db.find({}, { password: 0, authenticationToken: 0 });
    res.json(users);
  } catch {
    res.json({ error: 'Could not load users.' });
  }
});

app.post('/users', async (req, res) => {
  const { username, password, name, email } = req.body;
  if (!username || !password || !name || !email) {
    return res.json({ error: 'Please fill in all fields.' });
  }

  const existing = await db.findOne({ username });
  if (existing) return res.json({ error: 'Username already taken.' });

  const hash = bcrypt.hashSync(password, SALT);
  const token = makeToken();

  const user = { username, password: hash, name, email, authenticationToken: token };
  const saved = await db.insert(user);

  const { password: _, ...clean } = saved;
  res.json(clean);
});

app.post('/users/auth', async (req, res) => {
  const { username, password } = req.body;

  const user = await db.findOne({ username });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.json({ error: 'Wrong username or password.' });
  }

  const newToken = makeToken();
  await db.update({ username }, { $set: { authenticationToken: newToken } });

  const { password: _, ...clean } = user;
  clean.authenticationToken = newToken;
  res.json(clean);
});

app.post('/users/logout', async (req, res) => {
  const { username, token } = req.body;

  const user = await db.findOne({ username });
  if (!user || user.authenticationToken !== token) {
    return res.status(403).json({ error: 'Invalid token or user.' });
  }

  await db.update({ username }, { $set: { authenticationToken: '' } });
  res.json({ message: 'You are now logged out.' });
});

app.patch('/users/:username/:token', async (req, res) => {
  const { username, token } = req.params;
  const { name, email } = req.body;

  const user = await db.findOne({ username });
  if (!user || user.authenticationToken !== token) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const updated = await db.update({ username }, { $set: { name, email } });
  res.json(updated ? { ok: true } : { error: 'Could not update.' });
});

app.delete('/users/:username/:token', async (req, res) => {
  const { username, token } = req.params;

  const user = await db.findOne({ username });
  if (!user || user.authenticationToken !== token) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const deleted = await db.remove({ username });
  res.json(deleted ? { ok: true } : { error: 'Could not delete user.' });
});

app.all('*', (req, res) => {
  res.status(404).send('This page doesn’t exist.');
});

app.listen(3000, () => {
  console.log('Server ready at http://localhost:3000');
});
