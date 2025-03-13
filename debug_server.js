const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files from public folder
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Set up route for debug page
app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'debug.html'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading debug.html:', err);
      return res.status(500).send('Error reading debug file');
    }
    res.send(data);
  });
});

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'API is working' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Debug server running at http://localhost:${port}`);
});