const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// Setup static file serving for public directory
app.use(express.static(path.join(__dirname, 'public')));

// API health endpoint for testing
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mode: 'simplified-server'
  });
});

// Serve static HTML for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`WebCeph server running on port ${port}`);
  console.log(`Server URL: http://localhost:${port}`);
});