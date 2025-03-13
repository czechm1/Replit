const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3333;

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Parse JSON bodies
app.use(express.json());

// Setup static file serving from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API health endpoint for testing
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mode: 'simple-cjs-server',
    env: {
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV
    }
  });
});

// API endpoint to list files in public directory
app.get('/api/files', (req, res) => {
  const publicDir = path.join(__dirname, 'public');
  fs.readdir(publicDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ files });
  });
});

// Serve static HTML for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Simple WebCeph server running on port ${port}`);
  console.log(`Server URL: http://localhost:${port}`);
  
  // Print environment information
  console.log('Environment variables:');
  console.log(`  PORT: ${process.env.PORT}`);
  console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`  REPL_ID: ${process.env.REPL_ID}`);
  console.log(`  REPL_SLUG: ${process.env.REPL_SLUG}`);
  console.log(`  REPLIT_DEPLOYMENT_ID: ${process.env.REPLIT_DEPLOYMENT_ID}`);
});