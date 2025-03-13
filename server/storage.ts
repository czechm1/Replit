import { 
  users, 
  type User, 
  type InsertUser, 
  type AnalysisTemplate 
} from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { Landmark, LandmarksCollection } from '../client/src/components/radiograph/types/landmark';

// In-memory cache of landmarks collections
let landmarksCollectionsCache: LandmarksCollection[] | null = null;

// Helper functions to read/write landmarks JSON file
async function readLandmarksJson(): Promise<{
  status: string;
  box: { left: number; right: number; top: number; bottom: number };
  message: string;
  collections: LandmarksCollection[];
}> {
  try {
    const filePath = path.join(__dirname, 'mock', 'landmarks.json');
    const fileData = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading landmarks JSON:', error);
    return {
      status: 'error',
      box: { left: 0, right: 0, top: 0, bottom: 0 },
      message: 'Failed to read landmarks data',
      collections: []
    };
  }
}

async function writeLandmarksJson(data: {
  status: string;
  box: { left: number; right: number; top: number; bottom: number };
  message: string;
  collections: LandmarksCollection[];
}): Promise<void> {
  try {
    const filePath = path.join(__dirname, 'mock', 'landmarks.json');
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing landmarks JSON:', error);
    throw new Error('Failed to write landmarks data');
  }
}

// Helper function to get all landmarks collections
async function getAllLandmarksCollections(): Promise<LandmarksCollection[]> {
  if (landmarksCollectionsCache) {
    return landmarksCollectionsCache;
  }
  
  const data = await readLandmarksJson();
  landmarksCollectionsCache = data.collections;
  return data.collections;
}

// Helper function to save all landmarks collections
async function saveAllLandmarksCollections(collections: LandmarksCollection[]): Promise<void> {
  const data = await readLandmarksJson();
  data.collections = collections;
  landmarksCollectionsCache = collections;
  await writeLandmarksJson(data);
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Landmark operations
  getLandmarksCollection(id: string): Promise<LandmarksCollection | undefined>;
  getLandmarksCollectionsByPatient(patientId: string): Promise<LandmarksCollection[]>;
  createLandmarksCollection(collection: LandmarksCollection): Promise<LandmarksCollection>;
  updateLandmarksCollection(id: string, collection: Partial<LandmarksCollection>): Promise<LandmarksCollection | undefined>;
  deleteLandmarksCollection(id: string): Promise<boolean>;
  
  // Analysis template operations
  getAnalysisTemplates(): Promise<AnalysisTemplate[]>;
  getAnalysisTemplate(id: string): Promise<AnalysisTemplate | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analysisTemplates: Map<string, AnalysisTemplate>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.analysisTemplates = new Map();
    this.currentId = 1;
    
    // Initialize with some default analysis templates
    this.initializeTemplates();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Landmarks methods - these now use the JSON file
  async getLandmarksCollection(id: string): Promise<LandmarksCollection | undefined> {
    const collections = await getAllLandmarksCollections();
    return collections.find(collection => collection.id === id);
  }
  
  async getLandmarksCollectionsByPatient(patientId: string): Promise<LandmarksCollection[]> {
    const collections = await getAllLandmarksCollections();
    return collections.filter(collection => collection.patientId === patientId);
  }
  
  async createLandmarksCollection(collection: LandmarksCollection): Promise<LandmarksCollection> {
    const collections = await getAllLandmarksCollections();
    collections.push(collection);
    await saveAllLandmarksCollections(collections);
    return collection;
  }
  
  async updateLandmarksCollection(
    id: string, 
    updates: Partial<LandmarksCollection>
  ): Promise<LandmarksCollection | undefined> {
    const collections = await getAllLandmarksCollections();
    const index = collections.findIndex(c => c.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    const updatedCollection = {
      ...collections[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    collections[index] = updatedCollection;
    await saveAllLandmarksCollections(collections);
    return updatedCollection;
  }
  
  async deleteLandmarksCollection(id: string): Promise<boolean> {
    const collections = await getAllLandmarksCollections();
    const index = collections.findIndex(c => c.id === id);
    
    if (index === -1) {
      return false;
    }
    
    collections.splice(index, 1);
    await saveAllLandmarksCollections(collections);
    return true;
  }
  
  // Analysis template methods
  async getAnalysisTemplates(): Promise<AnalysisTemplate[]> {
    return Array.from(this.analysisTemplates.values());
  }
  
  async getAnalysisTemplate(id: string): Promise<AnalysisTemplate | undefined> {
    return this.analysisTemplates.get(id);
  }
  
  // Helper method to initialize default templates
  private initializeTemplates() {
    const rickettsTemplate: AnalysisTemplate = {
      id: 'ricketts',
      name: 'Ricketts Analysis',
      description: 'Comprehensive cephalometric analysis developed by Dr. Robert Ricketts',
      measurements: [
        {
          id: 'facial-axis',
          name: 'Facial Axis',
          landmarks: ['pt', 'gn', 'ba', 'na'],
          unit: 'degrees',
          normalRange: { min: 88, max: 92 }
        },
        {
          id: 'facial-depth',
          name: 'Facial Depth',
          landmarks: ['po', 'or', 'na', 'pg'],
          unit: 'degrees',
          normalRange: { min: 85, max: 91 }
        },
        {
          id: 'mandibular-plane',
          name: 'Mandibular Plane',
          landmarks: ['po', 'or', 'go', 'me'],
          unit: 'degrees',
          normalRange: { min: 21, max: 29 }
        }
      ]
    };
    
    const steinerTemplate: AnalysisTemplate = {
      id: 'steiner',
      name: 'Steiner Analysis',
      description: 'Cephalometric analysis method developed by Dr. Cecil Steiner',
      measurements: [
        {
          id: 'sna',
          name: 'SNA',
          landmarks: ['s', 'na', 'a'],
          unit: 'degrees',
          normalRange: { min: 80, max: 84 }
        },
        {
          id: 'snb',
          name: 'SNB',
          landmarks: ['s', 'na', 'b'],
          unit: 'degrees',
          normalRange: { min: 78, max: 82 }
        },
        {
          id: 'anb',
          name: 'ANB',
          landmarks: ['a', 'na', 'b'],
          unit: 'degrees',
          normalRange: { min: 2, max: 4 }
        }
      ]
    };
    
    this.analysisTemplates.set(rickettsTemplate.id, rickettsTemplate);
    this.analysisTemplates.set(steinerTemplate.id, steinerTemplate);
  }
}

export const storage = new MemStorage();

// Landmarks collections API - these now use the JSON file
export async function getLandmarksCollection(id: string): Promise<LandmarksCollection | null> {
  const collections = await getAllLandmarksCollections();
  const collection = collections.find(c => c.id === id);
  return collection || null;
}

export async function getLandmarksCollectionsByPatient(patientId: string): Promise<LandmarksCollection[]> {
  const collections = await getAllLandmarksCollections();
  return collections.filter(c => c.patientId === patientId);
}

export async function createLandmarksCollection(collection: Omit<LandmarksCollection, 'id' | 'createdAt' | 'updatedAt'>): Promise<LandmarksCollection> {
  const now = new Date().toISOString();
  const newCollection: LandmarksCollection = {
    ...collection,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    landmarks: collection.landmarks || []
  };
  
  const collections = await getAllLandmarksCollections();
  collections.push(newCollection);
  await saveAllLandmarksCollections(collections);
  
  return newCollection;
}

export async function updateLandmarksCollection(
  id: string,
  updates: Partial<LandmarksCollection>
): Promise<LandmarksCollection | null> {
  const collections = await getAllLandmarksCollections();
  const index = collections.findIndex(c => c.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedCollection = {
    ...collections[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  collections[index] = updatedCollection;
  await saveAllLandmarksCollections(collections);
  
  return updatedCollection;
}

export async function deleteLandmarksCollection(id: string): Promise<boolean> {
  const collections = await getAllLandmarksCollections();
  const index = collections.findIndex(c => c.id === id);
  
  if (index === -1) {
    return false;
  }
  
  collections.splice(index, 1);
  await saveAllLandmarksCollections(collections);
  
  return true;
}

export async function addLandmark(
  collectionId: string,
  landmark: Omit<Landmark, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LandmarksCollection | null> {
  const collections = await getAllLandmarksCollections();
  const collectionIndex = collections.findIndex(c => c.id === collectionId);
  
  if (collectionIndex === -1) {
    return null;
  }
  
  const now = new Date().toISOString();
  const newLandmark: Landmark = {
    ...landmark,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  };
  
  collections[collectionIndex].landmarks.push(newLandmark);
  collections[collectionIndex].updatedAt = now;
  
  await saveAllLandmarksCollections(collections);
  
  return collections[collectionIndex];
}

export async function updateLandmark(
  collectionId: string,
  landmarkId: string,
  updates: Partial<Omit<Landmark, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<LandmarksCollection | null> {
  const collections = await getAllLandmarksCollections();
  const collectionIndex = collections.findIndex(c => c.id === collectionId);
  
  if (collectionIndex === -1) {
    return null;
  }
  
  const landmarkIndex = collections[collectionIndex].landmarks.findIndex(l => l.id === landmarkId);
  
  if (landmarkIndex === -1) {
    return null;
  }
  
  const now = new Date().toISOString();
  collections[collectionIndex].landmarks[landmarkIndex] = {
    ...collections[collectionIndex].landmarks[landmarkIndex],
    ...updates,
    updatedAt: now
  };
  
  collections[collectionIndex].updatedAt = now;
  
  await saveAllLandmarksCollections(collections);
  
  return collections[collectionIndex];
}

export async function deleteLandmark(
  collectionId: string,
  landmarkId: string
): Promise<LandmarksCollection | null> {
  const collections = await getAllLandmarksCollections();
  const collectionIndex = collections.findIndex(c => c.id === collectionId);
  
  if (collectionIndex === -1) {
    return null;
  }
  
  const landmarkIndex = collections[collectionIndex].landmarks.findIndex(l => l.id === landmarkId);
  
  if (landmarkIndex === -1) {
    return null;
  }
  
  collections[collectionIndex].landmarks.splice(landmarkIndex, 1);
  collections[collectionIndex].updatedAt = new Date().toISOString();
  
  await saveAllLandmarksCollections(collections);
  
  return collections[collectionIndex];
}
