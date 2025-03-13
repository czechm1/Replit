import React from 'react';
import { useTracingLines } from '../../hooks/useTracingLines';
import TracingLineComponent from './TracingLineComponent';
import { LoadingSpinner } from '../ui/loading-spinner';

interface TracingLinesLayerProps {
  opacity: number;
  className?: string;
}

/**
 * Component that displays all tracing lines
 */
const TracingLinesLayer: React.FC<TracingLinesLayerProps> = ({
  opacity,
  className,
}) => {
  const { tracingLines, loading, error } = useTracingLines();

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-destructive text-sm">Failed to load tracing lines</p>
      </div>
    );
  }

  if (tracingLines.length === 0) {
    return null;
  }

  return (
    <svg
      className={`w-full h-full ${className || ''}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label="Tracing lines layer"
      xmlns="http://www.w3.org/2000/svg"
    >
      {tracingLines.map((tracingLine) => (
        <TracingLineComponent
          key={tracingLine.id}
          tracingLine={tracingLine}
          opacity={opacity}
        />
      ))}
    </svg>
  );
};

export default TracingLinesLayer; 