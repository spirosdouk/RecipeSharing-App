const express = require('express');
const next = require('next');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Enable CORS for all routes
  server.use(cors());

  // Parse incoming JSON requests
  server.use(express.json());

  // Define your custom API route
  server.post('/api/auth/login', (req, res) => {
    // Here, you would handle the login logic, for example:
    const { email, password } = req.body;

    // Dummy authentication check
    if (email === 'user@example.com' && password === 'password') {
      res.json({ token: 'fake-jwt-token' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

  // Handle all other requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
