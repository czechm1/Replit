import React, { useState, useEffect } from 'react';
import { AnalysisLine, AnalysisLinesResponse } from './types/analysisLine';

interface RedLineProps {
  pathId: string;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  className?: string;
}

/**
 * Component that renders a specific analysis line path by its ID
 * 
 * @example
 * <RedLine pathId="NaPog" />
 * <RedLine pathId="PoOr" color="#ff5500" strokeWidth={1.5} />
 */
const RedLine: React.FC<RedLineProps> = ({
  pathId,
  color = "#ff0000", // Default to red
  strokeWidth,
  opacity = 100,
  className,
}) => {
  const [analysisLine, setAnalysisLine] = useState<AnalysisLine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAnalysisLine = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/analysis-lines');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch analysis lines: ${response.status} ${response.statusText}`);
        }
        
        const data: AnalysisLinesResponse = await response.json();
        
        if (data.status === 'success' && Array.isArray(data.data)) {
          const foundLine = data.data.find(line => line.id === pathId);
          if (foundLine) {
            setAnalysisLine(foundLine);
          } else {
            throw new Error(`Analysis line with id '${pathId}' not found`);
          }
        } else {
          throw new Error('Invalid analysis lines data format');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error fetching analysis line:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisLine();
  }, [pathId]);

  if (loading) {
    return <path d="M0,0" stroke="transparent" />;
  }

  if (error || !analysisLine) {
    console.error('Error loading analysis line:', error);
    return null;
  }

  // If used standalone, wrap in SVG
  if (className?.includes('standalone')) {
    return (
      <svg
        className={`w-full h-full ${className.replace('standalone', '')}`}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={analysisLine.pathData}
          stroke={color || analysisLine.color}
          strokeWidth={strokeWidth || analysisLine.strokeWidth}
          strokeDasharray={analysisLine.strokeDasharray || undefined}
          fill="none"
          style={{ opacity: opacity / 100 }}
          className="red-line"
          aria-label={analysisLine.name}
          transform={analysisLine.transform}
        />
      </svg>
    );
  }

  // Otherwise return just the path for use within an existing SVG
  return (
    <path
      d={analysisLine.pathData}
      stroke={color || analysisLine.color}
      strokeWidth={strokeWidth || analysisLine.strokeWidth}
      strokeDasharray={analysisLine.strokeDasharray || undefined}
      fill="none"
      style={{ opacity: opacity / 100 }}
      className={`red-line ${className || ''}`}
      aria-label={analysisLine.name}
      transform={analysisLine.transform}
    />
  );
};

export default RedLine; 