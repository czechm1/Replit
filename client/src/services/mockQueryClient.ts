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
export const mockQueryFn: QueryFunction = async (context) => {
  const { queryKey } = context;
  
  // Handle direct 'landmarksCollection' queries used by the collaborative editing hooks
  if (Array.isArray(queryKey) && queryKey.length === 2 && queryKey[0] === 'landmarksCollection') {
    const collectionId = queryKey[1] as string;
    console.log('Fetching landmarks collection by ID:', collectionId);
    
    let collection = await api.getLandmarksCollection(collectionId);
    
    // If collection doesn't exist, create a new default one
    if (!collection) {
      console.log('Collection not found, creating new collection:', collectionId);
      
      // Extract patientId and imageId from the collection ID format (e.g., 'p1-img1')
      const [patientId, imageId] = collectionId.split('-');
      
      // Create a new collection with default values
      collection = {
        id: collectionId,
        patientId: patientId || 'unknown',
        imageId: imageId || 'unknown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        lastModifiedBy: 'system',
        landmarks: [] // Start with no landmarks
      };
      
      // Save the new collection
      await api.createLandmarksCollection(collection);
    }
    
    return collection;
  }
  
  // Cast queryKey to any to bypass TypeScript readonly constraints
  // This is needed because the QueryKey type is readonly but our extractResourceInfo needs a mutable array
  // Note: This is safe because we're not actually modifying the array
  const queryKeyArray = queryKey as any[];
  
  // Handle regular API paths
  const { resourceType, id, patientId } = extractResourceInfo(queryKeyArray);
  
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
        console.log('Query key not handled by standard paths:', queryKey);
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
        // Create a mock context with required properties for the queryFn
        const mockContext = { 
          queryKey: [url] as const,
          signal: new AbortController().signal,
          meta: undefined
        };
        return { json: async () => mockQueryFn(mockContext) };
        
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