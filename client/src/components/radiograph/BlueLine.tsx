import React, { useState, useEffect } from 'react';
import { TracingLine, TracingLinesResponse } from './types/tracingLine';

interface BlueLineProps {
  pathId: string;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  className?: string;
}

/**
 * Component that renders a specific tracing line path by its ID
 * 
 * @example
 * <BlueLine pathId="maxilla" />
 * <BlueLine pathId="mandible" color="#ff0000" strokeWidth={1.5} />
 */
const BlueLine: React.FC<BlueLineProps> = ({
  pathId,
  color = "#0000ff", // Default to blue
  strokeWidth,
  opacity = 100,
  className,
}) => {
  const [tracingLine, setTracingLine] = useState<TracingLine | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTracingLine = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/tracing-lines');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tracing lines: ${response.status} ${response.statusText}`);
        }
        
        const data: TracingLinesResponse = await response.json();
        
        if (data.status === 'success' && Array.isArray(data.data)) {
          const foundLine = data.data.find(line => line.id === pathId);
          if (foundLine) {
            setTracingLine(foundLine);
          } else {
            throw new Error(`Tracing line with id '${pathId}' not found`);
          }
        } else {
          throw new Error('Invalid tracing lines data format');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error('Error fetching tracing line:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracingLine();
  }, [pathId]);

  if (loading) {
    return <path d="M0,0" stroke="transparent" />;
  }

  if (error || !tracingLine) {
    console.error('Error loading tracing line:', error);
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
          d={tracingLine.pathData}
          stroke={color || tracingLine.color}
          strokeWidth={strokeWidth || tracingLine.strokeWidth}
          strokeDasharray={tracingLine.strokeDasharray || undefined}
          fill="none"
          style={{ opacity: opacity / 100 }}
          className="blue-line"
          aria-label={tracingLine.name}
          transform={tracingLine.transform}
        />
      </svg>
    );
  }

  // Otherwise return just the path for use within an existing SVG
  return (
    <path
      d={tracingLine.pathData}
      stroke={color || tracingLine.color}
      strokeWidth={strokeWidth || tracingLine.strokeWidth}
      strokeDasharray={tracingLine.strokeDasharray || undefined}
      fill="none"
      style={{ opacity: opacity / 100 }}
      className={`blue-line ${className || ''}`}
      aria-label={tracingLine.name}
      transform={tracingLine.transform}
    />
  );
};

export default BlueLine; 