import { Express, Request, Response } from "express";

/**
 * Register debug routes that will help diagnose the application
 */
export function registerDebugRoutes(app: Express) {
  // API routes listing endpoint
  app.get('/api/debug/routes', (req: Request, res: Response) => {
    const routes: {method: string; path: string}[] = [];
    
    const stack = app._router.stack;
    
    function print(path: string, layer: any) {
      if (layer.route) {
        layer.route.stack.forEach((handler: any) => {
          routes.push({
            method: Object.keys(handler.route.methods)[0].toUpperCase(),
            path: path + layer.route.path
          });
        });
      } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach((stackItem: any) => {
          print((path || '') + (layer.regexp ? layer.regexp.toString() : ''), stackItem);
        });
      }
    }
    
    app._router.stack.forEach((layer: any) => {
      if (layer.route) {
        routes.push({
          method: Object.keys(layer.route.methods)[0].toUpperCase(),
          path: layer.route.path
        });
      } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach((stackItem: any) => {
          print('', stackItem);
        });
      }
    });
    
    res.json({
      routeCount: routes.length,
      routes: routes.sort((a, b) => a.path.localeCompare(b.path))
    });
  });
  
  // Browser information debug endpoint
  app.get('/api/debug/browser-info', (req: Request, res: Response) => {
    const userAgent = req.headers['user-agent'] || 'Not provided';
    const acceptHeader = req.headers['accept'] || 'Not provided';
    const host = req.headers['host'] || 'Not provided';
    const connection = req.headers['connection'] || 'Not provided';
    const referer = req.headers['referer'] || 'Not provided';
    
    res.json({
      userAgent,
      acceptHeader,
      host,
      connection,
      referer,
      ip: req.ip,
      path: req.path,
      method: req.method,
      protocol: req.protocol,
      secure: req.secure,
      xhr: req.xhr,
      query: req.query,
      cookies: req.cookies,
      timestamp: new Date().toISOString()
    });
  });

  // Application state check
  app.get('/api/debug/app-state', (req: Request, res: Response) => {
    res.json({
      environment: process.env.NODE_ENV || 'Not set',
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform,
      cwd: process.cwd(),
      timestamp: new Date().toISOString()
    });
  });

  // Debug HTML endpoint that will bypass the SPA catch-all route
  app.get('/api/debug/html', (req: Request, res: Response) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CephaloScan Debug Page</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #1e40af; }
    .test-section { margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
    button { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    button:hover { background: #2563eb; }
    pre { background: #f1f5f9; padding: 10px; overflow-x: auto; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>CephaloScan Debug Page</h1>
  
  <div class="test-section">
    <h2>API Tests</h2>
    <button onclick="testEndpoint('/api/health')">Test Health</button>
    <button onclick="testEndpoint('/api/debug/image-paths')">Test Images</button>
    <button onclick="testEndpoint('/api/debug/routes')">Test Routes</button>
    <button onclick="testEndpoint('/api/debug/browser-info')">Browser Info</button>
    <button onclick="testEndpoint('/api/debug/app-state')">App State</button>
  </div>
  
  <div class="test-section">
    <h2>Navigation Tests</h2>
    <button onclick="navigateTo('/')">Go Home</button>
    <button onclick="navigateTo('/cephalometric')">Go Analysis</button>
  </div>
  
  <div class="test-section">
    <h2>Image Test</h2>
    <div>Trying to load cephalometric.png:</div>
    <img src="/images/cephalometric.png" alt="Cephalometric" style="max-width: 100%; margin-top: 10px;">
  </div>
  
  <div class="test-section">
    <h2>Results</h2>
    <pre id="results">Tests will appear here...</pre>
  </div>

  <script>
    async function testEndpoint(endpoint) {
      const results = document.getElementById('results');
      results.textContent = 'Loading...';
      
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        results.textContent = JSON.stringify(data, null, 2);
      } catch (error) {
        results.textContent = 'Error: ' + error.message;
      }
    }
    
    function navigateTo(path) {
      document.getElementById('results').textContent = 'Navigating to: ' + path;
      window.location.href = path;
    }
    
    // Show browser information when page loads
    document.addEventListener('DOMContentLoaded', () => {
      testEndpoint('/api/debug/browser-info');
    });
  </script>
</body>
</html>
    `);
  });
}