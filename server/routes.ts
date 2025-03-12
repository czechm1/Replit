import express, { type Express } from "express";
import path from "path";
import fs from "fs";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { 
  LandmarksCollection, 
  WebSocketMessage, 
  WebSocketMessageSchema 
} from "@shared/schema";

// Global WebSocket server reference
let wss: WebSocketServer | null = null;

// Define analysis data schemas
const AnalysisSchema = z.object({
  patientId: z.string(),
  analysisType: z.string(),
  date: z.string(),
  measurements: z.record(z.string(), z.number()),
  annotations: z.string().optional()
});

type Analysis = z.infer<typeof AnalysisSchema>;

// Create in-memory storage for analyses
const analyses: Analysis[] = [];

// WebSocket connection tracking
type CollaborationClient = {
  ws: WebSocket;
  userId: string;
  username: string;
};

// Track active collections and their connected clients
type CollaborativeCollections = {
  [collectionId: string]: CollaborationClient[];
};

const collaborativeCollections: CollaborativeCollections = {};

// Broadcast a message to all clients in a collection except the sender
function broadcastToCollection(
  collectionId: string, 
  message: WebSocketMessage, 
  excludeClient?: WebSocket
) {
  const clients = collaborativeCollections[collectionId];
  if (!clients) return;

  clients.forEach(client => {
    if (client.ws !== excludeClient && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  });
}

// Broadcast the list of users in a collection to all connected clients
function broadcastUsers(collectionId: string) {
  const clients = collaborativeCollections[collectionId];
  if (!clients) return;

  const users = clients.map(client => ({
    id: client.userId,
    username: client.username
  }));

  const message: WebSocketMessage = {
    type: "users_in_collection",
    collectionId,
    users
  };

  clients.forEach(client => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Static files are already being served in server/index.ts
  // Get all analyses for a patient
  app.get('/api/patients/:patientId/analyses', (req, res) => {
    const { patientId } = req.params;
    const patientAnalyses = analyses.filter(a => a.patientId === patientId);
    res.json(patientAnalyses);
  });

  // Get a specific analysis by id
  app.get('/api/analyses/:analysisId', (req, res) => {
    const { analysisId } = req.params;
    const analysis = analyses.find(a => a.patientId + '-' + a.date === analysisId);
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    
    res.json(analysis);
  });

  // Create a new analysis
  app.post('/api/analyses', (req, res) => {
    try {
      const validatedData = AnalysisSchema.parse(req.body);
      analyses.push(validatedData);
      res.status(201).json(validatedData);
    } catch (error) {
      res.status(400).json({ message: 'Invalid analysis data', error });
    }
  });

  // Update an existing analysis
  app.put('/api/analyses/:analysisId', (req, res) => {
    const { analysisId } = req.params;
    const analysisIndex = analyses.findIndex(a => a.patientId + '-' + a.date === analysisId);
    
    if (analysisIndex === -1) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    
    try {
      const validatedData = AnalysisSchema.parse(req.body);
      analyses[analysisIndex] = validatedData;
      res.json(validatedData);
    } catch (error) {
      res.status(400).json({ message: 'Invalid analysis data', error });
    }
  });

  // Get analysis templates
  app.get('/api/analysis-templates', (req, res) => {
    // This would normally fetch from a database
    const templates = [
      { id: 'tweed', name: 'Tweed' },
      { id: 'steiner', name: 'Steiner' },
      { id: 'ricketts', name: 'Ricketts' },
      { id: 'downs', name: 'Downs' },
      { id: 'mcnamara', name: 'McNamara' },
      { id: 'jarabak', name: 'Jarabak' }
    ];
    
    res.json(templates);
  });
  
  // Landmarks API
  app.get('/api/landmarks-collections/:id', async (req, res) => {
    const { id } = req.params;
    const collection = await storage.getLandmarksCollection(id);
    
    if (!collection) {
      return res.status(404).json({ message: 'Landmarks collection not found' });
    }
    
    res.json(collection);
  });
  
  app.get('/api/patients/:patientId/landmarks-collections', async (req, res) => {
    const { patientId } = req.params;
    const collections = await storage.getLandmarksCollectionsByPatient(patientId);
    res.json(collections);
  });
  
  app.post('/api/landmarks-collections', async (req, res) => {
    try {
      const collection: LandmarksCollection = req.body;
      const created = await storage.createLandmarksCollection(collection);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ message: 'Invalid landmarks collection data', error });
    }
  });
  
  app.put('/api/landmarks-collections/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const updates: Partial<LandmarksCollection> = req.body;
      const updated = await storage.updateLandmarksCollection(id, updates);
      
      if (!updated) {
        return res.status(404).json({ message: 'Landmarks collection not found' });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: 'Invalid landmarks collection data', error });
    }
  });
  
  app.delete('/api/landmarks-collections/:id', async (req, res) => {
    const { id } = req.params;
    const deleted = await storage.deleteLandmarksCollection(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Landmarks collection not found' });
    }
    
    res.status(204).send();
  });
  
  // Debug endpoint to check if the server is running
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      websocket: {
        path: '/ws',
        ready: true,
        clientCount: wss ? wss.clients.size : 0
      }
    });
  });
  
  // WebSocket specific health check endpoint
  app.get('/api/websocket-health', (req, res) => {
    const activeCollections = Object.entries(collaborativeCollections).map(([id, clients]) => ({
      id,
      userCount: clients.length,
      users: clients.map(c => ({ 
        id: c.userId, 
        username: c.username,
        readyState: c.ws.readyState
      }))
    }));
    
    res.json({
      status: wss ? 'active' : 'inactive',
      path: '/ws',
      clientCount: wss ? wss.clients.size : 0,
      activeCollections
    });
  });
  
  // Debug endpoint to check image paths
  app.get('/api/debug/image-paths', (req, res) => {
    const publicPath = path.join(process.cwd(), 'public');
    const imagesPath = path.join(publicPath, 'images');
    
    // Check if directories exist
    const publicExists = fs.existsSync(publicPath);
    const imagesExists = fs.existsSync(imagesPath);
    
    // List files in directories if they exist
    const publicFiles: string[] = [];
    const imageFiles: string[] = [];
    
    if (publicExists) {
      try {
        const files = fs.readdirSync(publicPath);
        files.forEach(file => publicFiles.push(file));
      } catch (error) {
        publicFiles.push(`Error reading directory: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    if (imagesExists) {
      try {
        const files = fs.readdirSync(imagesPath);
        files.forEach(file => imageFiles.push(file));
      } catch (error) {
        imageFiles.push(`Error reading directory: ${error instanceof Error ? error.message : String(error)}`);
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
      }
    });
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Create WebSocket server with detailed logging
  console.log('Setting up WebSocket server on path: /ws');
  wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws',
    clientTracking: true 
  });
  
  // Log WebSocket server events
  wss.on('listening', () => {
    console.log('WebSocket server is listening');
  });
  
  wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });
  
  wss.on('connection', (ws, req) => {
    console.log(`WebSocket connection established from ${req.socket.remoteAddress}`);
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Validate message against schema
        const validatedMessage = WebSocketMessageSchema.parse(data);
        
        switch (validatedMessage.type) {
          case 'join_collection': {
            const { collectionId, userId, username } = validatedMessage;
            
            // Initialize collection client list if it doesn't exist
            if (!collaborativeCollections[collectionId]) {
              collaborativeCollections[collectionId] = [];
            }
            
            // Add client to collection
            collaborativeCollections[collectionId].push({
              ws,
              userId,
              username
            });
            
            // Send the current collection data to the new client
            const collection = await storage.getLandmarksCollection(collectionId);
            
            if (collection) {
              const collectionDataMessage: WebSocketMessage = {
                type: 'collection_data',
                collection
              };
              
              ws.send(JSON.stringify(collectionDataMessage));
            }
            
            // Broadcast updated user list to all clients in the collection
            broadcastUsers(collectionId);
            
            console.log(`User ${username} (${userId}) joined collection ${collectionId}`);
            break;
          }
          
          case 'leave_collection': {
            const { collectionId, userId } = validatedMessage;
            
            // Remove client from collection
            if (collaborativeCollections[collectionId]) {
              collaborativeCollections[collectionId] = collaborativeCollections[collectionId]
                .filter(client => client.userId !== userId);
                
              // Clean up empty collections
              if (collaborativeCollections[collectionId].length === 0) {
                delete collaborativeCollections[collectionId];
              } else {
                // Broadcast updated user list
                broadcastUsers(collectionId);
              }
            }
            
            console.log(`User ${userId} left collection ${collectionId}`);
            break;
          }
          
          case 'update_landmark': {
            const { collectionId, userId, username, landmark } = validatedMessage;
            
            // Update the landmark in storage
            const collection = await storage.getLandmarksCollection(collectionId);
            
            if (collection) {
              // Find and update the landmark
              const updatedLandmarks = collection.landmarks.map(l => 
                l.id === landmark.id ? landmark : l
              );
              
              // Update the collection
              const updatedCollection = await storage.updateLandmarksCollection(
                collectionId, 
                { 
                  landmarks: updatedLandmarks,
                  lastModifiedBy: username
                }
              );
              
              // Broadcast the update to all other clients
              broadcastToCollection(collectionId, validatedMessage, ws);
              
              console.log(`User ${username} updated landmark ${landmark.id} in collection ${collectionId}`);
            }
            break;
          }
          
          case 'add_landmark': {
            const { collectionId, userId, username, landmark } = validatedMessage;
            
            // Add the landmark to storage
            const collection = await storage.getLandmarksCollection(collectionId);
            
            if (collection) {
              // Add the new landmark
              const updatedLandmarks = [...collection.landmarks, landmark];
              
              // Update the collection
              const updatedCollection = await storage.updateLandmarksCollection(
                collectionId, 
                { 
                  landmarks: updatedLandmarks,
                  lastModifiedBy: username
                }
              );
              
              // Broadcast the update to all other clients
              broadcastToCollection(collectionId, validatedMessage, ws);
              
              console.log(`User ${username} added landmark ${landmark.id} to collection ${collectionId}`);
            }
            break;
          }
          
          case 'remove_landmark': {
            const { collectionId, userId, username, landmarkId } = validatedMessage;
            
            // Remove the landmark from storage
            const collection = await storage.getLandmarksCollection(collectionId);
            
            if (collection) {
              // Remove the landmark
              const updatedLandmarks = collection.landmarks.filter(l => l.id !== landmarkId);
              
              // Update the collection
              const updatedCollection = await storage.updateLandmarksCollection(
                collectionId, 
                { 
                  landmarks: updatedLandmarks,
                  lastModifiedBy: username
                }
              );
              
              // Broadcast the update to all other clients
              broadcastToCollection(collectionId, validatedMessage, ws);
              
              console.log(`User ${username} removed landmark ${landmarkId} from collection ${collectionId}`);
            }
            break;
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        
        // Send error message back to client
        ws.send(JSON.stringify({
          type: 'error',
          message: error instanceof Error ? error.message : 'Invalid message format'
        }));
      }
    });
    
    ws.on('close', () => {
      // Remove client from all collections
      Object.entries(collaborativeCollections).forEach(([collectionId, clients]) => {
        const client = clients.find(client => client.ws === ws);
        
        if (client) {
          console.log(`User ${client.username} disconnected from collection ${collectionId}`);
          
          // Remove client from collection
          collaborativeCollections[collectionId] = clients.filter(c => c.ws !== ws);
          
          // Clean up empty collections
          if (collaborativeCollections[collectionId].length === 0) {
            delete collaborativeCollections[collectionId];
          } else {
            // Broadcast updated user list
            broadcastUsers(collectionId);
          }
        }
      });
    });
  });

  return httpServer;
}
