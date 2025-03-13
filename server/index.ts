import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup static file serving
const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));
app.use('/images', express.static(path.join(publicPath, 'images')));
app.use('/public', express.static(publicPath));

// Create a catchall route for serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });
  
  // Debug route to view all registered routes
  app.get('/api/debug/routes', (_req, res) => {
    const routes: {method: string, path: string}[] = [];
    
    app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        // Routes registered directly on the app
        const path = middleware.route.path;
        const methods = Object.keys(middleware.route.methods);
        methods.forEach(method => {
          routes.push({ method: method.toUpperCase(), path });
        });
      } else if (middleware.name === 'router') {
        // Router middleware
        middleware.handle.stack.forEach((handler: any) => {
          if (handler.route) {
            const path = handler.route.path;
            const methods = Object.keys(handler.route.methods);
            methods.forEach(method => {
              routes.push({ method: method.toUpperCase(), path });
            });
          }
        });
      }
    });
    
    res.json({ routes });
  });

  // Temporarily disabling Vite to use direct static file serving
  // This ensures we serve our static HTML directly
  if (false && app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // No need to call serveStatic since we're handling it directly
    // serveStatic(app);
    
    // Add a fallback route handler for any unmatched routes
    app.use('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'public/index.html'));
    });
  }

  // Use the port provided by Replit's environment, or default to 5000
  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`Server is running on port ${port}`);
    log(`Direct URL: http://localhost:${port}`);
    if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
      log(`Replit URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
    }
  });
})();
