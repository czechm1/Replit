import { 
  users, 
  type User, 
  type InsertUser, 
  type LandmarksCollection, 
  type AnalysisTemplate 
} from "@shared/schema";

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
  private landmarksCollections: Map<string, LandmarksCollection>;
  private analysisTemplates: Map<string, AnalysisTemplate>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.landmarksCollections = new Map();
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
  
  // Landmarks methods
  async getLandmarksCollection(id: string): Promise<LandmarksCollection | undefined> {
    return this.landmarksCollections.get(id);
  }
  
  async getLandmarksCollectionsByPatient(patientId: string): Promise<LandmarksCollection[]> {
    return Array.from(this.landmarksCollections.values())
      .filter(collection => collection.patientId === patientId);
  }
  
  async createLandmarksCollection(collection: LandmarksCollection): Promise<LandmarksCollection> {
    this.landmarksCollections.set(collection.id, collection);
    return collection;
  }
  
  async updateLandmarksCollection(
    id: string, 
    updates: Partial<LandmarksCollection>
  ): Promise<LandmarksCollection | undefined> {
    const collection = this.landmarksCollections.get(id);
    
    if (!collection) {
      return undefined;
    }
    
    const updatedCollection = {
      ...collection,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.landmarksCollections.set(id, updatedCollection);
    return updatedCollection;
  }
  
  async deleteLandmarksCollection(id: string): Promise<boolean> {
    return this.landmarksCollections.delete(id);
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
