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
