import { useState, useEffect } from 'react';
import { LandmarkPoint } from '../components/radiograph/types/index';

interface LandmarkResponse {
  status: string;
  data: {
    points: LandmarkPoint[];
    box: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  };
  message?: string;
}

interface UseLandmarksResult {
  landmarkData: {
    points: LandmarkPoint[];
    box: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  } | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage landmarks data
 */
export function useLandmarks(): UseLandmarksResult {
  const [landmarkData, setLandmarkData] = useState<UseLandmarksResult['landmarkData']>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLandmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/landmarks');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch landmarks: ${response.status} ${response.statusText}`);
      }
      
      const data: LandmarkResponse = await response.json();
      
      if (data.status === 'success' && data.data) {
        setLandmarkData(data.data);
      } else {
        throw new Error('Invalid landmarks data format');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error fetching landmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandmarks();
  }, []);

  return {
    landmarkData,
    loading,
    error,
    refetch: fetchLandmarks
  };
} 