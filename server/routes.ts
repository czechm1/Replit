import express, { type Express, Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { LandmarksCollection, Landmark } from "@shared/schema";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// API Documentation object
const apiDocumentation = {
  openapi: "3.0.0",
  info: {
    title: "Cephalometric Landmarks API",
    version: "1.0.0",
    description: "API for managing cephalometric landmarks and analysis"
  },
  servers: [
    {
      url: "http://0.0.0.0:5000",
      description: "Current server"
    }
  ],
  paths: {
    "/api/landmarks": {
      get: {
        summary: "Get landmarks data",
        description: "Retrieve the complete set of cephalometric landmarks with their coordinates",
        responses: {
          "200": {
            description: "Successful operation"
          }
        }
      }
    },
    "/api/tracing-lines": {
      get: {
        summary: "Get tracing lines data",
        description: "Retrieve the complete set of tracing lines with their paths and styling",
        responses: {
          "200": {
            description: "Successful operation"
          }
        }
      }
    },
    "/api/analysis-lines": {
      get: {
        summary: "Get analysis lines data",
        description: "Retrieve the complete set of analysis lines with their paths and styling",
        responses: {
          "200": {
            description: "Successful operation"
          }
        }
      }
    },
    "/api/landmarks-collections/:id": {
      get: {
        summary: "Get a landmarks collection",
        description: "Retrieve a specific landmarks collection by ID",
        responses: {
          "200": {
            description: "Successful operation"
          },
          "404": {
            description: "Collection not found"
          }
        }
      }
    },
    "/api/patients/:patientId/landmarks-collections": {
      get: {
        summary: "Get patient's landmark collections",
        description: "Retrieve all landmark collections for a specific patient",
        responses: {
          "200": {
            description: "Successful operation"
          }
        }
      }
    }
  }
};

// Define analysis data schemas
const AnalysisSchema = z.object({
  patientId: z.string(),
  analysisType: z.string(),
  date: z.string(),
  measurements: z.record(z.string(), z.number()),
  annotations: z.string().optional(),
});

type Analysis = z.infer<typeof AnalysisSchema>;

// Create in-memory storage for analyses
const analyses: Analysis[] = [];

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve custom API documentation
  app.get("/api-docs", (req, res) => {
    res.json(apiDocumentation);
  });
  
  // Serve HTML API documentation UI
  app.get("/api-docs/ui", (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cephalometric API Documentation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #2c3e50;
        }
        .endpoint {
          background-color: #f8f9fa;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 15px;
          border-left: 4px solid #3498db;
        }
        .method {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 3px;
          font-weight: bold;
          margin-right: 10px;
        }
        .get { background-color: #61affe; color: white; }
        .post { background-color: #49cc90; color: white; }
        .put { background-color: #fca130; color: white; }
        .delete { background-color: #f93e3e; color: white; }
        .path {
          font-family: monospace;
          font-weight: bold;
        }
        .description {
          margin: 10px 0;
        }
        .responses {
          margin-top: 10px;
        }
        .response {
          margin: 5px 0;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .server-info {
          margin-bottom: 20px;
          padding: 10px;
          background-color: #e8f4f8;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Cephalometric API Documentation</h1>
        <p>Version 1.0.0</p>
      </div>
      
      <div class="server-info">
        <strong>Server URL:</strong> http://0.0.0.0:5000
      </div>
      
      <div id="endpoints">
        <h2>Endpoints</h2>
        
        <div class="endpoint">
          <div><span class="method get">GET</span><span class="path">/api/landmarks</span></div>
          <div class="description">Retrieve the complete set of cephalometric landmarks with their coordinates</div>
          <div class="responses">
            <div class="response"><strong>200:</strong> Successful operation</div>
          </div>
        </div>
        
        <div class="endpoint">
          <div><span class="method get">GET</span><span class="path">/api/tracing-lines</span></div>
          <div class="description">Retrieve the complete set of tracing lines with their paths and styling</div>
          <div class="responses">
            <div class="response"><strong>200:</strong> Successful operation</div>
          </div>
        </div>
        
        <div class="endpoint">
          <div><span class="method get">GET</span><span class="path">/api/analysis-lines</span></div>
          <div class="description">Retrieve the complete set of analysis lines with their paths and styling</div>
          <div class="responses">
            <div class="response"><strong>200:</strong> Successful operation</div>
          </div>
        </div>
        
        <div class="endpoint">
          <div><span class="method get">GET</span><span class="path">/api/landmarks-collections/:id</span></div>
          <div class="description">Retrieve a specific landmarks collection by ID</div>
          <div class="responses">
            <div class="response"><strong>200:</strong> Successful operation</div>
            <div class="response"><strong>404:</strong> Collection not found</div>
          </div>
        </div>
        
        <div class="endpoint">
          <div><span class="method get">GET</span><span class="path">/api/patients/:patientId/landmarks-collections</span></div>
          <div class="description">Retrieve all landmark collections for a specific patient</div>
          <div class="responses">
            <div class="response"><strong>200:</strong> Successful operation</div>
          </div>
        </div>
        
        <div class="endpoint">
          <div><span class="method post">POST</span><span class="path">/api/landmarks-collections</span></div>
          <div class="description">Create a new landmarks collection</div>
          <div class="responses">
            <div class="response"><strong>201:</strong> Successful operation</div>
            <div class="response"><strong>400:</strong> Invalid landmarks collection data</div>
          </div>
        </div>
        
        <div class="endpoint">
          <div><span class="method put">PUT</span><span class="path">/api/landmarks-collections/:id</span></div>
          <div class="description">Update a landmarks collection</div>
          <div class="responses">
            <div class="response"><strong>200:</strong> Successful operation</div>
            <div class="response"><strong>404:</strong> Collection not found</div>
            <div class="response"><strong>400:</strong> Invalid landmarks collection data</div>
          </div>
        </div>
        
        <div class="endpoint">
          <div><span class="method delete">DELETE</span><span class="path">/api/landmarks-collections/:id</span></div>
          <div class="description">Delete a landmarks collection</div>
          <div class="responses">
            <div class="response"><strong>204:</strong> Successful operation</div>
            <div class="response"><strong>404:</strong> Collection not found</div>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });

  // Static files are already being served in server/index.ts
  // Get all analyses for a patient
  app.get("/api/patients/:patientId/analyses", (req, res) => {
    const { patientId } = req.params;
    const patientAnalyses = analyses.filter((a) => a.patientId === patientId);
    res.json(patientAnalyses);
  });

  // Get a specific analysis by id
  app.get("/api/analyses/:analysisId", (req, res) => {
    const { analysisId } = req.params;
    const analysis = analyses.find(
      (a) => a.patientId + "-" + a.date === analysisId
    );

    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    res.json(analysis);
  });

  // Create a new analysis
  app.post("/api/analyses", (req, res) => {
    try {
      const validatedData = AnalysisSchema.parse(req.body);
      analyses.push(validatedData);
      res.status(201).json(validatedData);
    } catch (error) {
      res.status(400).json({ message: "Invalid analysis data", error });
    }
  });

  // Update an existing analysis
  app.put("/api/analyses/:analysisId", (req, res) => {
    const { analysisId } = req.params;
    const analysisIndex = analyses.findIndex(
      (a) => a.patientId + "-" + a.date === analysisId
    );

    if (analysisIndex === -1) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    try {
      const validatedData = AnalysisSchema.parse(req.body);
      analyses[analysisIndex] = validatedData;
      res.json(validatedData);
    } catch (error) {
      res.status(400).json({ message: "Invalid analysis data", error });
    }
  });

  // Get analysis templates
  app.get("/api/analysis-templates", (req, res) => {
    // This would normally fetch from a database
    const templates = [
      { id: "tweed", name: "Tweed" },
      { id: "steiner", name: "Steiner" },
      { id: "ricketts", name: "Ricketts" },
      { id: "downs", name: "Downs" },
      { id: "mcnamara", name: "McNamara" },
      { id: "jarabak", name: "Jarabak" },
    ];

    res.json(templates);
  });

  // Get tracing lines data
  app.get("/api/tracing-lines", async (req, res) => {
    try {
      const tracingLinesPath = path.join(__dirname, 'mock', 'tracing-lines.json');
      const tracingLinesData = await fs.promises.readFile(tracingLinesPath, 'utf-8');
      // Add a slight delay to simulate network latency
      setTimeout(() => {
        res.json(JSON.parse(tracingLinesData));
      }, 300);
    } catch (error) {
      console.error("Error reading tracing lines data:", error);
      res.status(500).json({ message: "Error reading tracing lines data" });
    }
  });

    // Add analysis lines endpoint
    app.get('/api/analysis-lines', async (req, res) => {
      try {
        const analysisLinesPath = path.join(__dirname, 'mock', 'analysis-lines.json');
        const analysisLinesData = await fs.promises.readFile(analysisLinesPath, 'utf-8');
        console.log('tracingLinesData:', analysisLinesData);
        // Add a slight delay to simulate network latency
        setTimeout(() => {
          res.json(JSON.parse(analysisLinesData));
        }, 300);
      } catch (error) {
        console.error('Error fetching analysis lines:', error);
        res.status(500).json({
          status: 'error',
          message: 'Failed to retrieve analysis lines',
          data: []
        });
      }
    });
  
  // Get detected landmarks data - read from the JSON file
  app.get("/api/detected-landmarks", async (req, res) => {
    try {
      const landmarksPath = path.join(
        __dirname,
        "mock",
        "detected-landmarks.json"
      );
      const landmarksData = await fs.promises.readFile(landmarksPath, "utf-8");

      // Add a slight delay to simulate network latency
      setTimeout(() => {
        res.json(JSON.parse(landmarksData));
      }, 300);
    } catch (error) {
      console.error("Error reading landmarks data:", error);
      res.status(500).json({ message: "Error reading landmarks data" });
    }
  });

  // Get landmarks data from landmarks.json
  app.get("/api/landmarks", async (req, res) => {
    try {
      const landmarksPath = path.join(__dirname, "mock", "landmarks.json");
      const landmarksData = await fs.promises.readFile(landmarksPath, "utf-8");

      // Add a slight delay to simulate network latency
      setTimeout(() => {
        res.json(JSON.parse(landmarksData));
      }, 300);
    } catch (error) {
      console.error("Error reading landmarks data:", error);
      res.status(500).json({ message: "Error reading landmarks data" });
    }
  });

  // Landmarks API
  app.get("/api/landmarks-collections/:id", async (req, res) => {
    const { id } = req.params;
    const collection = await storage.getLandmarksCollection(id);

    if (!collection) {
      return res
        .status(404)
        .json({ message: "Landmarks collection not found" });
    }

    res.json(collection);
  });

  app.get(
    "/api/patients/:patientId/landmarks-collections",
    async (req, res) => {
      const { patientId } = req.params;
      const collections = await storage.getLandmarksCollectionsByPatient(
        patientId
      );
      res.json(collections);
    }
  );

  app.post("/api/landmarks-collections", async (req, res) => {
    try {
      const collection: LandmarksCollection = req.body;
      const created = await storage.createLandmarksCollection(collection);
      res.status(201).json(created);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Invalid landmarks collection data", error });
    }
  });

  app.put("/api/landmarks-collections/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const updates: Partial<LandmarksCollection> = req.body;
      const updated = await storage.updateLandmarksCollection(id, updates);

      if (!updated) {
        return res
          .status(404)
          .json({ message: "Landmarks collection not found" });
      }

      res.json(updated);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Invalid landmarks collection data", error });
    }
  });

  app.delete("/api/landmarks-collections/:id", async (req, res) => {
    const { id } = req.params;
    const deleted = await storage.deleteLandmarksCollection(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Landmarks collection not found" });
    }

    res.status(204).send();
  });

  // Debug endpoint to check if the server is running
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      mode: "single-user",
    });
  });

  // Root level health check
  app.get("/healthz", (req, res) => {
    res.send("ok");
  });

  // Simple CRUD operations for landmarks - no collaboration tracking
  app.post(
    "/api/landmarks-collections/:collectionId/landmarks",
    async (req, res) => {
      const { collectionId } = req.params;
      const { landmark, username } = req.body;

      if (!landmark) {
        return res.status(400).json({
          message: "Missing required field: landmark",
        });
      }

      try {
        // Add the landmark to the collection
        const collection = await storage.getLandmarksCollection(collectionId);
        if (!collection) {
          return res.status(404).json({ message: "Collection not found" });
        }

        const updatedLandmarks = [...collection.landmarks, landmark];
        const updatedCollection = await storage.updateLandmarksCollection(
          collectionId,
          {
            landmarks: updatedLandmarks,
            lastModifiedBy: username || "unknown",
          }
        );

        res.status(201).json({
          message: "Landmark added successfully",
          landmark,
          collection: updatedCollection,
        });
      } catch (error) {
        console.error("Error adding landmark:", error);
        res.status(500).json({
          message: "Error adding landmark",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  );

  // Update landmark endpoint - simplified
  app.put(
    "/api/landmarks-collections/:collectionId/landmarks/:landmarkId",
    async (req, res) => {
      const { collectionId, landmarkId } = req.params;
      const { landmark, username } = req.body;

      if (!landmark) {
        return res.status(400).json({
          message: "Missing required field: landmark",
        });
      }

      try {
        // Update the landmark
        const collection = await storage.getLandmarksCollection(collectionId);
        if (!collection) {
          return res.status(404).json({ message: "Collection not found" });
        }

        const updatedLandmarks = collection.landmarks.map((l: Landmark) =>
          l.id === landmarkId ? landmark : l
        );

        const updatedCollection = await storage.updateLandmarksCollection(
          collectionId,
          {
            landmarks: updatedLandmarks,
            lastModifiedBy: username || "unknown",
          }
        );

        res.json({
          message: "Landmark updated successfully",
          landmark,
          collection: updatedCollection,
        });
      } catch (error) {
        console.error("Error updating landmark:", error);
        res.status(500).json({
          message: "Error updating landmark",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  );

  // Delete landmark endpoint - simplified
  app.delete(
    "/api/landmarks-collections/:collectionId/landmarks/:landmarkId",
    async (req, res) => {
      const { collectionId, landmarkId } = req.params;
      const { username } = req.body;

      try {
        // Delete the landmark
        const collection = await storage.getLandmarksCollection(collectionId);
        if (!collection) {
          return res.status(404).json({ message: "Collection not found" });
        }

        const updatedLandmarks = collection.landmarks.filter(
          (l: Landmark) => l.id !== landmarkId
        );

        const updatedCollection = await storage.updateLandmarksCollection(
          collectionId,
          {
            landmarks: updatedLandmarks,
            lastModifiedBy: username || "unknown",
          }
        );

        res.json({
          message: "Landmark deleted successfully",
          collection: updatedCollection,
        });
      } catch (error) {
        console.error("Error deleting landmark:", error);
        res.status(500).json({
          message: "Error deleting landmark",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  );

  // Debug endpoint to check image paths
  app.get("/api/debug/image-paths", (req, res) => {
    const publicPath = path.join(process.cwd(), "public");
    const imagesPath = path.join(publicPath, "images");

    // Check if directories exist
    const publicExists = fs.existsSync(publicPath);
    const imagesExists = fs.existsSync(imagesPath);

    // List files in directories if they exist
    const publicFiles: string[] = [];
    const imageFiles: string[] = [];

    if (publicExists) {
      try {
        const files = fs.readdirSync(publicPath);
        files.forEach((file) => publicFiles.push(file));
      } catch (error) {
        publicFiles.push(
          `Error reading directory: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    if (imagesExists) {
      try {
        const files = fs.readdirSync(imagesPath);
        files.forEach((file) => imageFiles.push(file));
      } catch (error) {
        imageFiles.push(
          `Error reading directory: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    res.json({
      paths: {
        publicPath,
        imagesPath,
      },
      exists: {
        publicExists,
        imagesExists,
      },
      files: {
        publicFiles,
        imageFiles,
      },
    });
  });

  // Create and return HTTP server (without WebSocket)
  const httpServer = createServer(app);
  console.log("Starting server in single-user mode");

  return httpServer;
}
