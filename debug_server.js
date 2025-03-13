const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Serve static files
app.use(express.static(__dirname));

// Forward API requests to the main server
app.use('/api', (req, res) => {
  const url = `http://localhost:5000${req.url}`;
  console.log(`Proxying request to: ${url}`);
  
  fetch(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
  })
  .then(response => response.json())
  .then(data => res.json(data))
  .catch(error => {
    console.error('Error proxying request:', error);
    res.status(500).json({ error: 'Proxy error' });
  });
});

// Serve debug.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'debug.html'));
});

// Serve test page
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/test.html'));
});

app.listen(port, () => {
  console.log(`Debug server listening at http://localhost:${port}`);
});