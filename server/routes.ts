import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
