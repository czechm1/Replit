import { 
  LandmarksCollection,
  User,
  InsertUser,
  AnalysisTemplate,
  Landmark
} from "@shared/schema";
import { nanoid } from "nanoid";
import { detectLandmarks } from "./autoDetectionService";

// Local storage keys
const STORAGE_KEYS = {
  USERS: "webceph_users",
  LANDMARKS_COLLECTIONS: "webceph_landmarks_collections",
  ANALYSIS_TEMPLATES: "webceph_analysis_templates"
};

// Sample patients for demo purposes
const SAMPLE_PATIENTS = [
  { id: "p1", name: "John Smith", age: 14, gender: "male" },
  { id: "p2", name: "Emma Johnson", age: 12, gender: "female" },
  { id: "p3", name: "Michael Williams", age: 16, gender: "male" },
  { id: "p4", name: "Sophia Davis", age: 13, gender: "female" }
];

// Sample image data
const SAMPLE_IMAGES = [
  { 
    id: "img1", 
    patientId: "p1", 
    url: "/images/ceph1.jpg", 
    type: "cephalometric", 
    date: "2025-01-15",
    description: "Pre-treatment lateral cephalogram"
  },
  { 
    id: "img2", 
    patientId: "p1", 
    url: "/images/ceph2.jpg", 
    type: "cephalometric", 
    date: "2025-03-10",
    description: "Mid-treatment lateral cephalogram"
  },
  { 
    id: "img3", 
    patientId: "p2", 
    url: "/images/ceph3.jpg", 
    type: "cephalometric", 
    date: "2025-02-05",
    description: "Pre-treatment lateral cephalogram"
  },
  { 
    id: "img4", 
    patientId: "p3", 
    url: "/images/ceph4.jpg", 
    type: "cephalometric", 
    date: "2025-02-20",
    description: "Pre-treatment lateral cephalogram"
  },
  { 
    id: "img5", 
    patientId: "p4", 
    url: "/images/ceph5.jpg", 
    type: "cephalometric", 
    date: "2025-01-25",
    description: "Pre-treatment lateral cephalogram"
  }
];

// Default sample images using the actual images in the public directory
const DEFAULT_IMAGES = [
  { patientId: "p1", imageId: "img1", url: "/images/ceph1.jpg" },
  { patientId: "p1", imageId: "img2", url: "/images/ceph2.jpg" },
  { patientId: "p2", imageId: "img3", url: "/images/ceph3.jpg" },
  { patientId: "p3", imageId: "img4", url: "/images/ceph4.jpg" },
  { patientId: "p4", imageId: "img5", url: "/images/ceph5.jpg" }
];

// Define analysis templates
const DEFAULT_ANALYSIS_TEMPLATES: AnalysisTemplate[] = [
  {
    id: "ricketts",
    name: "Ricketts Analysis",
    description: "Comprehensive cephalometric analysis developed by Dr. Robert Ricketts",
    measurements: [
      { 
        id: "facial-axis", 
        name: "Facial Axis", 
        landmarks: ["Ba", "Gn", "Na", "Pt"],
        normalRange: { min: 86.5, max: 93.5 },
        formula: "angle(Ba-Na, Pt-Gn)"
      },
      { 
        id: "facial-angle", 
        name: "Facial Angle", 
        landmarks: ["Po", "Or", "Na", "Pg"],
        normalRange: { min: 84, max: 90 }
      },
      { 
        id: "mandibular-plane", 
        name: "Mandibular Plane", 
        landmarks: ["Go", "Me", "Po", "Or"],
        normalRange: { min: 22, max: 30 }
      },
      { 
        id: "lower-face-height", 
        name: "Lower Face Height", 
        landmarks: ["ANS", "Xi", "Pm"],
        normalRange: { min: 43, max: 51 }
      },
      { 
        id: "mandibular-arc", 
        name: "Mandibular Arc", 
        landmarks: ["Dc", "Xi", "Pm"],
        normalRange: { min: 22, max: 30 }
      },
      { 
        id: "convexity", 
        name: "Convexity", 
        landmarks: ["Na", "Po", "A"],
        normalRange: { min: 0, max: 4 },
        unit: "mm"
      }
    ]
  },
  {
    id: "steiner",
    name: "Steiner Analysis",
    description: "Cephalometric analysis developed by Dr. Cecil Steiner",
    measurements: [
      { 
        id: "sna", 
        name: "SNA", 
        landmarks: ["S", "N", "A"],
        normalRange: { min: 80, max: 84 }
      },
      { 
        id: "snb", 
        name: "SNB", 
        landmarks: ["S", "N", "B"],
        normalRange: { min: 78, max: 82 }
      },
      { 
        id: "anb", 
        name: "ANB", 
        landmarks: ["A", "N", "B"],
        normalRange: { min: 0, max: 4 }
      },
      { 
        id: "sn-mandibular-plane", 
        name: "SN-Mandibular Plane", 
        landmarks: ["S", "N", "Go", "Gn"],
        normalRange: { min: 28, max: 36 }
      },
      { 
        id: "u1-na-angle", 
        name: "U1-NA Angle", 
        landmarks: ["U1A", "U1E", "N", "A"],
        normalRange: { min: 18, max: 26 }
      },
      { 
        id: "l1-nb-angle", 
        name: "L1-NB Angle", 
        landmarks: ["L1A", "L1E", "N", "B"],
        normalRange: { min: 21, max: 29 }
      },
      { 
        id: "u1-na-mm", 
        name: "U1-NA (mm)", 
        landmarks: ["U1E", "N", "A"],
        normalRange: { min: 2, max: 6 },
        unit: "mm"
      },
      { 
        id: "l1-nb-mm", 
        name: "L1-NB (mm)", 
        landmarks: ["L1E", "N", "B"],
        normalRange: { min: 2, max: 6 },
        unit: "mm"
      }
    ]
  },
  {
    id: "downs",
    name: "Downs Analysis",
    description: "Cephalometric analysis developed by Dr. William Downs",
    measurements: [
      { 
        id: "facial-angle", 
        name: "Facial Angle", 
        landmarks: ["Po", "Or", "Na", "Pg"],
        normalRange: { min: 84.2, max: 91.4 }
      },
      { 
        id: "angle-of-convexity", 
        name: "Angle of Convexity", 
        landmarks: ["N", "A", "Po"],
        normalRange: { min: -5, max: 5 }
      },
      { 
        id: "a-b-plane", 
        name: "A-B Plane", 
        landmarks: ["A", "B", "N", "Po"],
        normalRange: { min: -8.3, max: -0.9 }
      },
      { 
        id: "mandibular-plane", 
        name: "Mandibular Plane", 
        landmarks: ["Go", "Gn", "Po", "Or"],
        normalRange: { min: 18.7, max: 25.1 }
      },
      { 
        id: "y-axis", 
        name: "Y-Axis", 
        landmarks: ["S", "Gn", "Po", "Or"],
        normalRange: { min: 55.6, max: 63.2 }
      }
    ]
  }
];

// ClientStorage class replaces the backend storage with client-side functionality
class ClientStorage {
  private users: Map<number, User>;
  private landmarksCollections: Map<string, LandmarksCollection>;
  private analysisTemplates: Map<string, AnalysisTemplate>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.landmarksCollections = new Map();
    this.analysisTemplates = new Map();
    this.currentId = 1;
    
    // Initialize with default data
    this.loadFromLocalStorage();
    this.initializeTemplates();
    
    // If no landmarks collections exist, create some sample ones
    if (this.landmarksCollections.size === 0) {
      this.createSampleLandmarksCollections();
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    this.saveToLocalStorage();
    return user;
  }

  // Landmark operations
  async getLandmarksCollection(id: string): Promise<LandmarksCollection | undefined> {
    return this.landmarksCollections.get(id);
  }

  async getLandmarksCollectionsByPatient(patientId: string): Promise<LandmarksCollection[]> {
    const collections: LandmarksCollection[] = [];
    for (const collection of this.landmarksCollections.values()) {
      if (collection.patientId === patientId) {
        collections.push(collection);
      }
    }
    return collections;
  }

  async createLandmarksCollection(collection: LandmarksCollection): Promise<LandmarksCollection> {
    // Ensure the collection has an ID
    if (!collection.id) {
      collection.id = nanoid();
    }
    
    // Set creation and modification timestamps if not provided
    if (!collection.createdAt) {
      collection.createdAt = new Date().toISOString();
    }
    if (!collection.updatedAt) {
      collection.updatedAt = new Date().toISOString();
    }
    
    this.landmarksCollections.set(collection.id, collection);
    this.saveToLocalStorage();
    return collection;
  }

  async updateLandmarksCollection(
    id: string,
    updates: Partial<LandmarksCollection>
  ): Promise<LandmarksCollection | undefined> {
    const collection = this.landmarksCollections.get(id);
    if (!collection) return undefined;

    // Update the collection with new values
    const updatedCollection = {
      ...collection,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.landmarksCollections.set(id, updatedCollection);
    this.saveToLocalStorage();
    return updatedCollection;
  }

  async deleteLandmarksCollection(id: string): Promise<boolean> {
    const result = this.landmarksCollections.delete(id);
    if (result) {
      this.saveToLocalStorage();
    }
    return result;
  }

  // Analysis template operations
  async getAnalysisTemplates(): Promise<AnalysisTemplate[]> {
    return Array.from(this.analysisTemplates.values());
  }

  async getAnalysisTemplate(id: string): Promise<AnalysisTemplate | undefined> {
    return this.analysisTemplates.get(id);
  }

  // Save data to local storage
  private saveToLocalStorage(): void {
    try {
      // Convert maps to arrays for storage
      const users = Array.from(this.users.values());
      const landmarksCollections = Array.from(this.landmarksCollections.values());
      const analysisTemplates = Array.from(this.analysisTemplates.values());
      
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.LANDMARKS_COLLECTIONS, JSON.stringify(landmarksCollections));
      localStorage.setItem(STORAGE_KEYS.ANALYSIS_TEMPLATES, JSON.stringify(analysisTemplates));
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  }

  // Load data from local storage
  private loadFromLocalStorage(): void {
    try {
      // Load users
      const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
      if (usersJson) {
        const users = JSON.parse(usersJson) as User[];
        users.forEach(user => {
          this.users.set(user.id, user);
          if (user.id >= this.currentId) {
            this.currentId = user.id + 1;
          }
        });
      }
      
      // Load landmarks collections
      const collectionsJson = localStorage.getItem(STORAGE_KEYS.LANDMARKS_COLLECTIONS);
      if (collectionsJson) {
        const collections = JSON.parse(collectionsJson) as LandmarksCollection[];
        collections.forEach(collection => {
          this.landmarksCollections.set(collection.id, collection);
        });
      }
      
      // Load analysis templates
      const templatesJson = localStorage.getItem(STORAGE_KEYS.ANALYSIS_TEMPLATES);
      if (templatesJson) {
        const templates = JSON.parse(templatesJson) as AnalysisTemplate[];
        templates.forEach(template => {
          this.analysisTemplates.set(template.id, template);
        });
      }
    } catch (error) {
      console.error("Error loading from local storage:", error);
    }
  }

  // Initialize the analysis templates if they don't exist
  private initializeTemplates(): void {
    if (this.analysisTemplates.size === 0) {
      DEFAULT_ANALYSIS_TEMPLATES.forEach(template => {
        this.analysisTemplates.set(template.id, template);
      });
      this.saveToLocalStorage();
    }
  }

  // Create sample landmarks collections for demo purposes
  private createSampleLandmarksCollections(): void {
    // Create a landmarks collection for each sample image
    DEFAULT_IMAGES.forEach(({ patientId, imageId, url }) => {
      // Use the autoDetectionService to generate landmarks
      const collection = detectLandmarks(1000, 1000, patientId, imageId);
      
      // Store the collection
      this.landmarksCollections.set(collection.id, collection);
    });
    
    this.saveToLocalStorage();
  }

  // Get patient information for demo
  getPatients() {
    return SAMPLE_PATIENTS;
  }

  // Get image information for demo
  getImages() {
    return DEFAULT_IMAGES.map(img => ({
      ...img,
      type: "cephalometric",
      date: new Date().toISOString(),
      description: "Lateral cephalogram"
    }));
  }

  // Get a specific patient's information
  getPatient(patientId: string) {
    return SAMPLE_PATIENTS.find(p => p.id === patientId);
  }

  // Get a specific image's information
  getImage(imageId: string) {
    return DEFAULT_IMAGES.find(img => img.imageId === imageId);
  }
}

// Create singleton instance
export const clientStorage = new ClientStorage();

// Export fake API functions that mimic the backend API calls but use client storage
export const api = {
  // Landmark collections
  async getLandmarksCollection(id: string): Promise<LandmarksCollection | undefined> {
    return clientStorage.getLandmarksCollection(id);
  },
  
  async getLandmarksCollectionsByPatient(patientId: string): Promise<LandmarksCollection[]> {
    return clientStorage.getLandmarksCollectionsByPatient(patientId);
  },
  
  async createLandmarksCollection(collection: LandmarksCollection): Promise<LandmarksCollection> {
    return clientStorage.createLandmarksCollection(collection);
  },
  
  async updateLandmarksCollection(
    id: string,
    updates: Partial<LandmarksCollection>
  ): Promise<LandmarksCollection | undefined> {
    return clientStorage.updateLandmarksCollection(id, updates);
  },
  
  async deleteLandmarksCollection(id: string): Promise<boolean> {
    return clientStorage.deleteLandmarksCollection(id);
  },
  
  // Landmark operations
  async addLandmark(
    collectionId: string,
    landmark: Landmark,
    username: string = "user"
  ): Promise<{landmark: Landmark, collection: LandmarksCollection | undefined}> {
    const collection = await clientStorage.getLandmarksCollection(collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }
    
    const updatedLandmarks = [...collection.landmarks, landmark];
    const updatedCollection = await clientStorage.updateLandmarksCollection(
      collectionId,
      {
        landmarks: updatedLandmarks,
        lastModifiedBy: username
      }
    );
    
    return { landmark, collection: updatedCollection };
  },
  
  async updateLandmark(
    collectionId: string,
    landmarkId: string,
    landmark: Landmark,
    username: string = "user"
  ): Promise<{landmark: Landmark, collection: LandmarksCollection | undefined}> {
    const collection = await clientStorage.getLandmarksCollection(collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }
    
    const updatedLandmarks = collection.landmarks.map(l => 
      l.id === landmarkId ? landmark : l
    );
    
    const updatedCollection = await clientStorage.updateLandmarksCollection(
      collectionId,
      {
        landmarks: updatedLandmarks,
        lastModifiedBy: username
      }
    );
    
    return { landmark, collection: updatedCollection };
  },
  
  async deleteLandmark(
    collectionId: string,
    landmarkId: string,
    username: string = "user"
  ): Promise<{collection: LandmarksCollection | undefined}> {
    const collection = await clientStorage.getLandmarksCollection(collectionId);
    if (!collection) {
      throw new Error("Collection not found");
    }
    
    const updatedLandmarks = collection.landmarks.filter(l => l.id !== landmarkId);
    
    const updatedCollection = await clientStorage.updateLandmarksCollection(
      collectionId,
      {
        landmarks: updatedLandmarks,
        lastModifiedBy: username
      }
    );
    
    return { collection: updatedCollection };
  },
  
  // Analysis templates
  async getAnalysisTemplates(): Promise<AnalysisTemplate[]> {
    return clientStorage.getAnalysisTemplates();
  },
  
  async getAnalysisTemplate(id: string): Promise<AnalysisTemplate | undefined> {
    return clientStorage.getAnalysisTemplate(id);
  },
  
  // Patient information
  getPatients() {
    return clientStorage.getPatients();
  },
  
  getPatient(patientId: string) {
    return clientStorage.getPatient(patientId);
  },
  
  // Image information
  getImages() {
    return clientStorage.getImages();
  },
  
  getImage(imageId: string) {
    return clientStorage.getImage(imageId);
  },
  
  // Auto-detection service
  detectLandmarks(
    imageWidth: number,
    imageHeight: number,
    patientId: string,
    imageId: string = "default"
  ): LandmarksCollection {
    return detectLandmarks(imageWidth, imageHeight, patientId, imageId);
  }
};