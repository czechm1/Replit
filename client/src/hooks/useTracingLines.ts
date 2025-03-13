import { useState, useEffect } from 'react';
import { TracingLine, TracingLinesResponse } from '../components/radiograph/types/tracingLine';

interface UseTracingLinesResult {
  tracingLines: TracingLine[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage tracing lines data
 */
export function useTracingLines(): UseTracingLinesResult {
  const [tracingLines, setTracingLines] = useState<TracingLine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTracingLines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tracing-lines');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch tracing lines: ${response.status} ${response.statusText}`);
      }
      
      const data: TracingLinesResponse = await response.json();
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        setTracingLines(data.data);
      } else {
        throw new Error('Invalid tracing lines data format');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error fetching tracing lines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracingLines();
  }, []);

  return {
    tracingLines,
    loading,
    error,
    refetch: fetchTracingLines
  };
} 