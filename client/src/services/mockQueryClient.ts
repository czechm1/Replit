import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { api } from "./clientStorage";

// Helper function to extract resource type and ID from a query key
const extractResourceInfo = (queryKey: unknown[]): { 
  resourceType: string; 
  id?: string;
  patientId?: string;
} => {
  const path = queryKey[0] as string;
  
  // Extract path components
  const pathComponents = path.split('/').filter(Boolean);
  if (pathComponents.length < 2 || pathComponents[0] !== 'api') {
    return { resourceType: '' };
  }
  
  const resourceType = pathComponents[1];
  
  // Extract IDs where applicable
  if (resourceType === 'landmarks-collections') {
    // Handle collection ID
    if (pathComponents.length >= 3) {
      return { resourceType, id: pathComponents[2] };
    }
    // Handle patient collections
    if (pathComponents.length >= 4 && pathComponents[2] === 'patients') {
      return { resourceType: 'patient-landmarks-collections', patientId: pathComponents[3] };
    }
    return { resourceType };
  }
  
  if (resourceType === 'analysis-templates' && pathComponents.length >= 3) {
    return { resourceType, id: pathComponents[2] };
  }
  
  return { resourceType };
};

// Mock query function that uses clientStorage instead of fetch
export const mockQueryFn: QueryFunction = async ({ queryKey }) => {
  const { resourceType, id, patientId } = extractResourceInfo(queryKey);
  
  try {
    switch (resourceType) {
      case 'landmarks-collections':
        if (id) {
          return await api.getLandmarksCollection(id);
        } else {
          // Return all collections if no specific ID is requested
          return [];
        }
      
      case 'patient-landmarks-collections':
        if (patientId) {
          return await api.getLandmarksCollectionsByPatient(patientId);
        }
        return [];
      
      case 'analysis-templates':
        if (id) {
          return await api.getAnalysisTemplate(id);
        } else {
          return await api.getAnalysisTemplates();
        }
        
      case 'patients':
        if (id) {
          return api.getPatient(id);
        } else {
          return api.getPatients();
        }
        
      case 'health':
        return { status: 'ok', timestamp: new Date().toISOString() };
        
      default:
        console.warn(`Unhandled resource type in mockQueryFn: ${resourceType}`);
        return null;
    }
  } catch (error) {
    console.error(`Error in mockQueryFn for ${resourceType}:`, error);
    throw error;
  }
};

// Mock apiRequest function that uses clientStorage instead of fetch
export async function mockApiRequest(
  methodOrUrl: string,
  urlOrOptions?: string | RequestInit,
  data?: unknown | undefined,
): Promise<any> {
  // Parse the request details
  let method: string = 'GET';
  let url: string;
  
  if (typeof urlOrOptions === 'string') {
    method = methodOrUrl;
    url = urlOrOptions;
  } else {
    url = methodOrUrl;
    if (urlOrOptions) {
      method = urlOrOptions.method || 'GET';
    }
  }
  
  // Extract resource information from URL
  const { resourceType, id } = extractResourceInfo([url]);
  
  try {
    // Handle different HTTP methods and resources
    switch (method.toUpperCase()) {
      case 'GET':
        return { json: async () => mockQueryFn({ queryKey: [url] }) };
        
      case 'POST':
        if (resourceType === 'landmarks-collections') {
          if (id && url.includes('landmarks')) {
            // Add landmark
            const result = await api.addLandmark(id, data as any, 'user');
            return { json: async () => result };
          } else {
            // Create collection
            const result = await api.createLandmarksCollection(data as any);
            return { json: async () => result };
          }
        }
        break;
        
      case 'PUT':
        if (resourceType === 'landmarks-collections') {
          if (id && url.includes('landmarks')) {
            // Extract landmark ID from URL
            const parts = url.split('/');
            const landmarkId = parts[parts.length - 1];
            
            // Update landmark
            const result = await api.updateLandmark(id, landmarkId, data as any, 'user');
            return { json: async () => result };
          } else if (id) {
            // Update collection
            const result = await api.updateLandmarksCollection(id, data as any);
            return { json: async () => result };
          }
        }
        break;
        
      case 'DELETE':
        if (resourceType === 'landmarks-collections') {
          if (id && url.includes('landmarks')) {
            // Extract landmark ID from URL
            const parts = url.split('/');
            const landmarkId = parts[parts.length - 1];
            
            // Delete landmark
            const result = await api.deleteLandmark(id, landmarkId, 'user');
            return { json: async () => result };
          } else if (id) {
            // Delete collection
            const result = await api.deleteLandmarksCollection(id);
            return { json: async () => result };
          }
        }
        break;
        
      default:
        console.warn(`Unhandled method in mockApiRequest: ${method}`);
    }
    
    return { 
      json: async () => ({ success: true }),
      ok: true,
      status: 200
    };
  } catch (error) {
    console.error(`Error in mockApiRequest for ${method} ${url}:`, error);
    throw error;
  }
}

// Create a query client that uses the mock functions
export const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: mockQueryFn,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});