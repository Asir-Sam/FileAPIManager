const express = require('express');
const db = require('./db'); // Import the database connection
const fileWatcher = require('./fileWatcher'); // Import file watcher
const scheduler = require('./scheduler'); // Import scheduler

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware to parse JSON requests
app.use(express.json());

// Example API route
app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM RTU_CONFIG', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// You can add other routes and middleware as needed
