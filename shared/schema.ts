import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Landmark definition for cephalometric points
export const LandmarkSchema = z.object({
  id: z.string(),
  name: z.string(),
  abbreviation: z.string(),
  x: z.number(),
  y: z.number(),
  description: z.string().optional(),
  confidence: z.number().optional(), // For AI-detected landmarks
});

export type Landmark = z.infer<typeof LandmarkSchema>;

// Landmarks collection
export const LandmarksCollectionSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  imageId: z.string(),
  landmarks: z.array(LandmarkSchema),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  createdBy: z.string().optional(), // User who created the collection
  lastModifiedBy: z.string().optional(), // User who last modified the collection
});

export type LandmarksCollection = z.infer<typeof LandmarksCollectionSchema>;

// Cephalometric measurement
export const MeasurementSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  unit: z.string().optional(),
  normalRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
  interpretation: z.string().optional(),
});

export type Measurement = z.infer<typeof MeasurementSchema>;

// Analysis template (for different methodologies like Ricketts, Steiner, etc.)
export const AnalysisTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  measurements: z.array(z.object({
    id: z.string(),
    name: z.string(),
    landmarks: z.array(z.string()), // IDs of landmarks involved
    formula: z.string().optional(), // How to calculate from landmarks
    unit: z.string().optional(), // Degrees, mm, etc.
    normalRange: z.object({
      min: z.number(),
      max: z.number(),
    }),
  })),
});

export type AnalysisTemplate = z.infer<typeof AnalysisTemplateSchema>;

// WebSocket message types for real-time collaboration
export const WebSocketMessageSchema = z.discriminatedUnion("type", [
  // Client connecting to a specific collection
  z.object({
    type: z.literal("join_collection"),
    collectionId: z.string(),
    userId: z.string(),
    username: z.string(),
  }),
  
  // Client leaving a collection
  z.object({
    type: z.literal("leave_collection"),
    collectionId: z.string(),
    userId: z.string(),
  }),
  
  // Client updating a landmark position
  z.object({
    type: z.literal("update_landmark"),
    collectionId: z.string(),
    userId: z.string(),
    username: z.string(),
    landmark: LandmarkSchema,
  }),
  
  // Client adding a new landmark
  z.object({
    type: z.literal("add_landmark"),
    collectionId: z.string(),
    userId: z.string(),
    username: z.string(),
    landmark: LandmarkSchema,
  }),
  
  // Client removing a landmark
  z.object({
    type: z.literal("remove_landmark"),
    collectionId: z.string(),
    userId: z.string(),
    username: z.string(),
    landmarkId: z.string(),
  }),
  
  // Server broadcasting current users in a collection
  z.object({
    type: z.literal("users_in_collection"),
    collectionId: z.string(),
    users: z.array(z.object({
      id: z.string(),
      username: z.string(),
    })),
  }),
  
  // Server broadcasting collection data
  z.object({
    type: z.literal("collection_data"),
    collection: LandmarksCollectionSchema,
  }),
  
  // Server broadcasting an error message
  z.object({
    type: z.literal("error"),
    message: z.string(),
  })
]);

export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;
