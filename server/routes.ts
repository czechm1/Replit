import express, { type Express, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  LandmarksCollection,
  Landmark
} from "@shared/schema";

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

// Tracking active users (simplified without WebSockets)
type ActiveUser = {
  userId: string;
  username: string;
  lastActive: Date;
};

// Track active collections and their users
type ActiveCollections = {
  [collectionId: string]: ActiveUser[];
};

const activeCollections: ActiveCollections = {};

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
      collaborationMode: 'http-poll'
    });
  });
  
  // Active users endpoint (replaces WebSocket functionality)
  app.get('/api/active-users/:collectionId', (req, res) => {
    const { collectionId } = req.params;
    const users = activeCollections[collectionId] || [];
    
    // Clean up stale users (inactive for more than 5 minutes)
    const now = new Date();
    const filteredUsers = users.filter(user => {
      const timeDiff = now.getTime() - user.lastActive.getTime();
      return timeDiff < 5 * 60 * 1000; // 5 minutes
    });
    
    activeCollections[collectionId] = filteredUsers;
    
    res.json({
      collectionId,
      userCount: filteredUsers.length,
      users: filteredUsers.map(u => ({ 
        id: u.userId, 
        username: u.username
      }))
    });
  });
  
  // Join collection endpoint
  app.post('/api/join-collection/:collectionId', (req, res) => {
    const { collectionId } = req.params;
    const { userId, username } = req.body;
    
    if (!userId || !username) {
      return res.status(400).json({ message: 'Missing required fields: userId and username' });
    }
    
    // Initialize collection if it doesn't exist
    if (!activeCollections[collectionId]) {
      activeCollections[collectionId] = [];
    }
    
    // Update or add user to the collection
    const existingUserIndex = activeCollections[collectionId].findIndex(u => u.userId === userId);
    if (existingUserIndex >= 0) {
      activeCollections[collectionId][existingUserIndex].lastActive = new Date();
    } else {
      activeCollections[collectionId].push({
        userId,
        username,
        lastActive: new Date()
      });
    }
    
    res.json({
      message: 'Joined collection successfully',
      userCount: activeCollections[collectionId].length
    });
  });
  
  // Leave collection endpoint
  app.post('/api/leave-collection/:collectionId', (req, res) => {
    const { collectionId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'Missing required field: userId' });
    }
    
    if (activeCollections[collectionId]) {
      activeCollections[collectionId] = activeCollections[collectionId].filter(u => u.userId !== userId);
      
      // Clean up empty collections
      if (activeCollections[collectionId].length === 0) {
        delete activeCollections[collectionId];
      }
    }
    
    res.json({ message: 'Left collection successfully' });
  });
  
  // Add landmark endpoint (replacing WebSocket)
  app.post('/api/landmarks-collections/:collectionId/landmarks', async (req, res) => {
    const { collectionId } = req.params;
    const { landmark, userId, username } = req.body;
    
    if (!landmark || !userId || !username) {
      return res.status(400).json({ 
        message: 'Missing required fields: landmark, userId, username' 
      });
    }
    
    try {
      // Update or add user active status
      if (!activeCollections[collectionId]) {
        activeCollections[collectionId] = [];
      }
      
      const existingUserIndex = activeCollections[collectionId].findIndex(u => u.userId === userId);
      if (existingUserIndex >= 0) {
        activeCollections[collectionId][existingUserIndex].lastActive = new Date();
      } else {
        activeCollections[collectionId].push({
          userId,
          username,
          lastActive: new Date()
        });
      }
      
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
          lastModifiedBy: username
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
  
  // Update landmark endpoint (replacing WebSocket)
  app.put('/api/landmarks-collections/:collectionId/landmarks/:landmarkId', async (req, res) => {
    const { collectionId, landmarkId } = req.params;
    const { landmark, userId, username } = req.body;
    
    if (!landmark || !userId || !username) {
      return res.status(400).json({ 
        message: 'Missing required fields: landmark, userId, username' 
      });
    }
    
    try {
      // Update user active status
      if (!activeCollections[collectionId]) {
        activeCollections[collectionId] = [];
      }
      
      const existingUserIndex = activeCollections[collectionId].findIndex(u => u.userId === userId);
      if (existingUserIndex >= 0) {
        activeCollections[collectionId][existingUserIndex].lastActive = new Date();
      } else {
        activeCollections[collectionId].push({
          userId,
          username,
          lastActive: new Date()
        });
      }
      
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
          lastModifiedBy: username
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
  
  // Delete landmark endpoint (replacing WebSocket)
  app.delete('/api/landmarks-collections/:collectionId/landmarks/:landmarkId', async (req, res) => {
    const { collectionId, landmarkId } = req.params;
    const { userId, username } = req.body;
    
    if (!userId || !username) {
      return res.status(400).json({ 
        message: 'Missing required fields: userId, username' 
      });
    }
    
    try {
      // Update user active status
      if (!activeCollections[collectionId]) {
        activeCollections[collectionId] = [];
      }
      
      const existingUserIndex = activeCollections[collectionId].findIndex(u => u.userId === userId);
      if (existingUserIndex >= 0) {
        activeCollections[collectionId][existingUserIndex].lastActive = new Date();
      } else {
        activeCollections[collectionId].push({
          userId,
          username,
          lastActive: new Date()
        });
      }
      
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
          lastModifiedBy: username
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

  // Create and return HTTP server (without WebSocket)
  const httpServer = createServer(app);
  console.log('Starting server without WebSockets - using HTTP polling instead');
  
  return httpServer;
}
