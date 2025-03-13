import { useState, useEffect } from 'react';
import { AnalysisLine, AnalysisLinesResponse } from '../components/radiograph/types/analysisLine';

interface UseAnalysisLinesResult {
  analysisLines: AnalysisLine[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage analysis lines data
 */
export function useAnalysisLines(): UseAnalysisLinesResult {
  const [analysisLines, setAnalysisLines] = useState<AnalysisLine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalysisLines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/analysis-lines');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analysis lines: ${response.status} ${response.statusText}`);
      }
      
      const data: AnalysisLinesResponse = await response.json();
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        setAnalysisLines(data.data);
      } else {
        throw new Error('Invalid analysis lines data format');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error fetching analysis lines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysisLines();
  }, []);

  return {
    analysisLines,
    loading,
    error,
    refetch: fetchAnalysisLines
  };
} 