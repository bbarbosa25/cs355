const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const usersFile = path.join(__dirname, 'users.json');
const postsFile = path.join(__dirname, 'posts.json');
const publicPath = path.join(__dirname, 'public');

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

// Redirect to register page on root
app.get('/', (req, res) => {
  res.redirect('/register.html');
});

// Load/save helpers
function loadUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile));
}
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}
function loadPosts() {
  if (!fs.existsSync(postsFile)) return [];
  return JSON.parse(fs.readFileSync(postsFile));
}
function savePosts(posts) {
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
}

// Register
app.post('/users/register', async (req, res) => {
  const { name, email, username, password } = req.body;
  const users = loadUsers();

  if (users.find(u => u.email === email || u.username === username)) {
    return res.status(400).json({ error: 'Email or username already exists' });
  }

  const hash = await bcrypt.hash(password, 10);
  users.push({ name, email, username, password: hash });
  saveUsers(users);
  res.json({ message: 'Registration successful' });
});

// Login
app.post('/users/auth', async (req, res) => {
  const { email, username, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.email === email && u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ message: 'Login successful' });
});

// Blog Routes
app.get('/posts', (req, res) => res.json(loadPosts()));
app.post('/posts', (req, res) => {
  const posts = loadPosts();
  const { title, content, authorUsername } = req.body;
  posts.push({ id: Date.now(), title, content, authorUsername });
  savePosts(posts);
  res.json({ message: 'Post created' });
});
app.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, authorUsername } = req.body;
  const posts = loadPosts();
  const index = posts.findIndex(p => p.id == id && p.authorUsername === authorUsername);
  if (index === -1) return res.status(403).json({ error: 'Unauthorized' });
  posts[index] = { ...posts[index], title, content };
  savePosts(posts);
  res.json({ message: 'Post updated' });
});
app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { authorUsername } = req.body;
  let posts = loadPosts();
  const post = posts.find(p => p.id == id && p.authorUsername === authorUsername);
  if (!post) return res.status(403).json({ error: 'Unauthorized' });
  posts = posts.filter(p => p.id != id);
  savePosts(posts);
  res.json({ message: 'Post deleted' });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
