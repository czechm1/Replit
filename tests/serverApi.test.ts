import { describe, it, expect, beforeEach, beforeAll, afterAll, vi } from 'vitest';
import { nanoid } from 'nanoid';
import { WebSocketMessage, Landmark, LandmarksCollection } from '../shared/schema';

// Mock fetch
global.fetch = vi.fn();

describe('Server API Endpoints', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /api/landmarks/:id', () => {
    it('fetches landmark collection by ID', async () => {
      const mockId = nanoid();
      const mockLandmarksCollection = {
        id: mockId,
        patientId: 'patient123',
        imageId: 'image123',
        landmarks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Mock fetch to return success response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLandmarksCollection
      });

      const response = await fetch(`/api/landmarks/${mockId}`);
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toEqual(mockLandmarksCollection);
      expect(global.fetch).toHaveBeenCalledWith(`/api/landmarks/${mockId}`);
    });

    it('handles not found error', async () => {
      const mockId = nanoid();

      // Mock fetch to return 404 response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Landmark collection not found' })
      });

      const response = await fetch(`/api/landmarks/${mockId}`);
      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(data.error).toBe('Landmark collection not found');
    });
  });

  describe('POST /api/landmarks', () => {
    it('creates a new landmark collection', async () => {
      const mockLandmarksCollection: LandmarksCollection = {
        id: nanoid(),
        patientId: 'patient123',
        imageId: 'image123',
        landmarks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Mock fetch to return success response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLandmarksCollection
      });

      const response = await fetch('/api/landmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockLandmarksCollection)
      });
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toEqual(mockLandmarksCollection);
      expect(global.fetch).toHaveBeenCalledWith('/api/landmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockLandmarksCollection)
      });
    });
  });

  describe('GET /api/templates', () => {
    it('fetches analysis templates', async () => {
      const mockTemplates = [
        {
          id: 'ricketts',
          name: 'Ricketts Analysis',
          description: 'Comprehensive cephalometric analysis',
          measurements: []
        },
        {
          id: 'steiner',
          name: 'Steiner Analysis',
          description: 'Standard cephalometric analysis',
          measurements: []
        }
      ];

      // Mock fetch to return success response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTemplates
      });

      const response = await fetch('/api/templates');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toEqual(mockTemplates);
      expect(global.fetch).toHaveBeenCalledWith('/api/templates');
    });
  });
});