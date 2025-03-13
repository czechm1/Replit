import express, { type Express, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { 
  LandmarksCollection,
  Landmark,
  WebSocketMessage,
  WebSocketMessageSchema
} from "@shared/schema";
import { registerDebugRoutes } from "./debug_utils";

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
  
  // Direct test route for static HTML page
  app.get('/test', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/test.html'));
  });
  
  // Serve our custom index.html directly
  app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
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
  
  // Create WebSocket server on a different path to avoid conflicts with Vite HMR
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Map to track active connections and their collections
  interface ActiveUser {
    userId: string;
    username: string;
    socket: WebSocket;
  }
  
  // Map collection IDs to active users
  const collectionUsers = new Map<string, ActiveUser[]>();
  
  wss.on('connection', (socket: WebSocket) => {
    console.log('WebSocket client connected');
    let userCollectionId: string | null = null;
    let userId: string | null = null;
    
    socket.on('message', (message: string) => {
      try {
        const parsedMessage = JSON.parse(message);
        const result = WebSocketMessageSchema.safeParse(parsedMessage);
        
        if (!result.success) {
          console.error('Invalid WebSocket message format:', result.error);
          socket.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
          return;
        }
        
        const validatedMessage = result.data;
        
        switch (validatedMessage.type) {
          case 'join_collection': {
            const { collectionId, userId: newUserId, username } = validatedMessage;
            userCollectionId = collectionId;
            userId = newUserId;
            
            // Add user to collection
            const users = collectionUsers.get(collectionId) || [];
            collectionUsers.set(collectionId, [
              ...users.filter(u => u.userId !== newUserId),
              { userId: newUserId, username, socket }
            ]);
            
            // Notify all users in the collection
            const usersInCollection = collectionUsers.get(collectionId) || [];
            const usersInfo = usersInCollection.map(u => ({ id: u.userId, username: u.username }));
            
            // Broadcast current users to all clients in the collection
            broadcastToCollection(collectionId, {
              type: 'users_in_collection',
              collectionId,
              users: usersInfo
            });
            
            // Send collection data to the new user
            (async () => {
              const collection = await storage.getLandmarksCollection(collectionId);
              if (collection) {
                socket.send(JSON.stringify({
                  type: 'collection_data',
                  collection
                }));
              }
            })();
            
            break;
          }
          
          case 'leave_collection': {
            const { collectionId, userId: leavingUserId } = validatedMessage;
            
            // Remove user from collection
            const users = collectionUsers.get(collectionId) || [];
            collectionUsers.set(
              collectionId, 
              users.filter(u => u.userId !== leavingUserId)
            );
            
            // Notify remaining users
            const updatedUsers = collectionUsers.get(collectionId) || [];
            broadcastToCollection(collectionId, {
              type: 'users_in_collection',
              collectionId,
              users: updatedUsers.map(u => ({ id: u.userId, username: u.username }))
            });
            
            break;
          }
          
          case 'update_landmark': {
            const { collectionId, landmark, userId: senderId, username } = validatedMessage;
            
            // Update landmark in storage
            (async () => {
              const collection = await storage.getLandmarksCollection(collectionId);
              if (!collection) return;
              
              const updatedLandmarks = collection.landmarks.map(l => 
                l.id === landmark.id ? landmark : l
              );
              
              await storage.updateLandmarksCollection(
                collectionId,
                {
                  landmarks: updatedLandmarks,
                  lastModifiedBy: username
                }
              );
              
              // Broadcast to all other users in the collection
              broadcastToCollection(collectionId, validatedMessage, senderId);
            })();
            
            break;
          }
          
          case 'add_landmark': {
            const { collectionId, landmark, userId: senderId, username } = validatedMessage;
            
            // Add landmark to storage
            (async () => {
              const collection = await storage.getLandmarksCollection(collectionId);
              if (!collection) return;
              
              const updatedLandmarks = [...collection.landmarks, landmark];
              
              await storage.updateLandmarksCollection(
                collectionId,
                {
                  landmarks: updatedLandmarks,
                  lastModifiedBy: username
                }
              );
              
              // Broadcast to all other users in the collection
              broadcastToCollection(collectionId, validatedMessage, senderId);
            })();
            
            break;
          }
          
          case 'remove_landmark': {
            const { collectionId, landmarkId, userId: senderId, username } = validatedMessage;
            
            // Remove landmark from storage
            (async () => {
              const collection = await storage.getLandmarksCollection(collectionId);
              if (!collection) return;
              
              const updatedLandmarks = collection.landmarks.filter(l => l.id !== landmarkId);
              
              await storage.updateLandmarksCollection(
                collectionId,
                {
                  landmarks: updatedLandmarks,
                  lastModifiedBy: username
                }
              );
              
              // Broadcast to all other users in the collection
              broadcastToCollection(collectionId, validatedMessage, senderId);
            })();
            
            break;
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        socket.send(JSON.stringify({
          type: 'error',
          message: 'Failed to process message'
        }));
      }
    });
    
    socket.on('close', () => {
      console.log('WebSocket client disconnected');
      
      // Remove user from all collections
      if (userCollectionId && userId) {
        const users = collectionUsers.get(userCollectionId) || [];
        collectionUsers.set(
          userCollectionId, 
          users.filter(u => u.userId !== userId)
        );
        
        // Notify remaining users
        const updatedUsers = collectionUsers.get(userCollectionId) || [];
        broadcastToCollection(userCollectionId, {
          type: 'users_in_collection',
          collectionId: userCollectionId,
          users: updatedUsers.map(u => ({ id: u.userId, username: u.username }))
        });
      }
    });
    
    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
  
  // Helper function to broadcast messages to all clients in a collection
  function broadcastToCollection(
    collectionId: string, 
    message: WebSocketMessage, 
    excludeUserId?: string
  ) {
    const users = collectionUsers.get(collectionId) || [];
    const messageStr = JSON.stringify(message);
    
    users.forEach(user => {
      // Skip the sender if excludeUserId is provided
      if (excludeUserId && user.userId === excludeUserId) return;
      
      // Only send to clients that are connected
      if (user.socket.readyState === WebSocket.OPEN) {
        user.socket.send(messageStr);
      }
    });
  }
  
  console.log('Starting server with WebSocket support');
  
  return httpServer;
}
