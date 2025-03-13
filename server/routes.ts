import express, { type Express, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  LandmarksCollection,
  Landmark,
  WebSocketMessage
} from "@shared/schema";
import { registerDebugRoutes } from "./debug_utils";
import WebSocket, { WebSocketServer } from "ws";

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Register debug routes
  registerDebugRoutes(app);
  
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
      mode: 'single-user'
    });
  });
  
  // Root level health check
  app.get('/healthz', (req, res) => {
    res.send('ok');
  });
  
  // Simple CRUD operations for landmarks - no collaboration tracking
  app.post('/api/landmarks-collections/:collectionId/landmarks', async (req, res) => {
    const { collectionId } = req.params;
    const { landmark, username } = req.body;
    
    if (!landmark) {
      return res.status(400).json({ 
        message: 'Missing required field: landmark' 
      });
    }
    
    try {      
      // Add the landmark to the collection
      const collection = await storage.getLandmarksCollection(collectionId);
      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }
      
      const updatedLandmarks = [...collection.landmarks, landmark];
      const updatedCollection = await storage.updateLandmarksCollection(
        collectionId,
        {
          landmarks: updatedLandmarks,
          lastModifiedBy: username || 'unknown'
        }
      );
      
      res.status(201).json({
        message: 'Landmark added successfully',
        landmark,
        collection: updatedCollection
      });
    } catch (error) {
      console.error('Error adding landmark:', error);
      res.status(500).json({ 
        message: 'Error adding landmark', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  // Update landmark endpoint - simplified
  app.put('/api/landmarks-collections/:collectionId/landmarks/:landmarkId', async (req, res) => {
    const { collectionId, landmarkId } = req.params;
    const { landmark, username } = req.body;
    
    if (!landmark) {
      return res.status(400).json({ 
        message: 'Missing required field: landmark' 
      });
    }
    
    try {
      // Update the landmark
      const collection = await storage.getLandmarksCollection(collectionId);
      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }
      
      const updatedLandmarks = collection.landmarks.map(l => 
        l.id === landmarkId ? landmark : l
      );
      
      const updatedCollection = await storage.updateLandmarksCollection(
        collectionId,
        {
          landmarks: updatedLandmarks,
          lastModifiedBy: username || 'unknown'
        }
      );
      
      res.json({
        message: 'Landmark updated successfully',
        landmark,
        collection: updatedCollection
      });
    } catch (error) {
      console.error('Error updating landmark:', error);
      res.status(500).json({ 
        message: 'Error updating landmark', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  // Delete landmark endpoint - simplified
  app.delete('/api/landmarks-collections/:collectionId/landmarks/:landmarkId', async (req, res) => {
    const { collectionId, landmarkId } = req.params;
    const { username } = req.body;
    
    try {
      // Delete the landmark
      const collection = await storage.getLandmarksCollection(collectionId);
      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }
      
      const updatedLandmarks = collection.landmarks.filter(l => l.id !== landmarkId);
      
      const updatedCollection = await storage.updateLandmarksCollection(
        collectionId,
        {
          landmarks: updatedLandmarks,
          lastModifiedBy: username || 'unknown'
        }
      );
      
      res.json({
        message: 'Landmark deleted successfully',
        collection: updatedCollection
      });
    } catch (error) {
      console.error('Error deleting landmark:', error);
      res.status(500).json({ 
        message: 'Error deleting landmark', 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
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
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active users by collection ID
  interface ActiveUser {
    userId: string;
    username: string;
    socket: WebSocket;
  }
  
  // Map of collection ID to list of active users
  const activeCollections = new Map<string, ActiveUser[]>();
  
  // Set up WebSocket connection handling
  wss.on('connection', (socket: WebSocket) => {
    console.log('WebSocket client connected');
    let userCollectionId: string | null = null;
    let userId: string | null = null;
    let username: string | null = null;
    
    socket.on('message', async (data: string) => {
      try {
        // Parse the message
        const message: WebSocketMessage = JSON.parse(data);
        
        // Handle different message types
        switch (message.type) {
          case 'join_collection':
            userCollectionId = message.collectionId;
            userId = message.userId;
            username = message.username;
            
            // Add user to active collection
            if (!activeCollections.has(userCollectionId)) {
              activeCollections.set(userCollectionId, []);
            }
            
            const activeUsers = activeCollections.get(userCollectionId) || [];
            activeUsers.push({ userId, username, socket });
            activeCollections.set(userCollectionId, activeUsers);
            
            // Notify other users in the collection
            broadcastToCollection(userCollectionId, {
              type: 'user_joined',
              userId,
              username,
              collectionId: userCollectionId,
              timestamp: new Date().toISOString()
            }, socket);
            
            // Send list of active users to the new user
            const userList = activeUsers.map(user => ({
              id: user.userId,
              username: user.username
            }));
            
            socket.send(JSON.stringify({
              type: 'active_users',
              users: userList,
              collectionId: userCollectionId,
              timestamp: new Date().toISOString()
            }));
            break;
            
          case 'add_landmark':
            if (!userCollectionId) break;
            
            // Add the landmark to the database
            const collection = await storage.getLandmarksCollection(message.collectionId);
            if (collection) {
              const updatedLandmarks = [...collection.landmarks, message.landmark];
              await storage.updateLandmarksCollection(
                message.collectionId,
                {
                  landmarks: updatedLandmarks,
                  lastModifiedBy: username || 'unknown'
                }
              );
              
              // Broadcast the new landmark to all users
              broadcastToCollection(message.collectionId, message);
            }
            break;
            
          case 'update_landmark':
            if (!userCollectionId) break;
            
            // Update the landmark in the database
            const updateCollection = await storage.getLandmarksCollection(message.collectionId);
            if (updateCollection) {
              const updatedLandmarks = updateCollection.landmarks.map(l => 
                l.id === message.landmark.id ? message.landmark : l
              );
              
              await storage.updateLandmarksCollection(
                message.collectionId,
                {
                  landmarks: updatedLandmarks,
                  lastModifiedBy: username || 'unknown'
                }
              );
              
              // Broadcast the updated landmark to all users
              broadcastToCollection(message.collectionId, message);
            }
            break;
            
          case 'delete_landmark':
            if (!userCollectionId) break;
            
            // Delete the landmark from the database
            const deleteCollection = await storage.getLandmarksCollection(message.collectionId);
            if (deleteCollection) {
              const updatedLandmarks = deleteCollection.landmarks.filter(l => 
                l.id !== message.landmarkId
              );
              
              await storage.updateLandmarksCollection(
                message.collectionId,
                {
                  landmarks: updatedLandmarks,
                  lastModifiedBy: username || 'unknown'
                }
              );
              
              // Broadcast the deletion to all users
              broadcastToCollection(message.collectionId, message);
            }
            break;
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    socket.on('close', () => {
      // Remove user from active collections
      if (userCollectionId && userId) {
        const users = activeCollections.get(userCollectionId);
        if (users) {
          const updatedUsers = users.filter(u => u.userId !== userId);
          
          if (updatedUsers.length === 0) {
            activeCollections.delete(userCollectionId);
          } else {
            activeCollections.set(userCollectionId, updatedUsers);
            
            // Notify other users that this user has left
            broadcastToCollection(userCollectionId, {
              type: 'user_left',
              userId: userId,
              username: username || 'Unknown user',
              collectionId: userCollectionId,
              timestamp: new Date().toISOString()
            });
          }
        }
      }
      
      console.log('WebSocket client disconnected');
    });
  });
  
  // Function to broadcast a message to all users in a collection
  function broadcastToCollection(
    collectionId: string, 
    message: WebSocketMessage, 
    excludeSocket?: WebSocket
  ) {
    const users = activeCollections.get(collectionId) || [];
    
    users.forEach(user => {
      // Don't send the message back to the sender
      if (excludeSocket && user.socket === excludeSocket) {
        return;
      }
      
      // Only send messages to connected sockets
      if (user.socket.readyState === WebSocket.OPEN) {
        user.socket.send(JSON.stringify(message));
      }
    });
  }
  
  console.log('Starting server with WebSocket support');
  
  return httpServer;
}
