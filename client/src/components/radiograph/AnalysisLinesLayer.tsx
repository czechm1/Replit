import React from 'react';
import { useAnalysisLines } from '../../hooks/useAnalysisLines';
import AnalysisLineComponent from './AnalysisLineComponent';
import { LoadingSpinner } from '../ui/loading-spinner';

interface AnalysisLinesLayerProps {
  opacity: number;
  className?: string;
}

/**
 * Component that displays all analysis lines
 */
const AnalysisLinesLayer: React.FC<AnalysisLinesLayerProps> = ({
  opacity,
  className,
}) => {
  const { analysisLines, loading, error } = useAnalysisLines();

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
        <p className="text-destructive text-sm">Failed to load analysis lines</p>
      </div>
    );
  }

  if (analysisLines.length === 0) {
    return null;
  }

  return (
    <svg
      className={`w-full h-full ${className || ''}`}
      preserveAspectRatio="xMidYMid meet"
      aria-label="Analysis lines layer"
      xmlns="http://www.w3.org/2000/svg"
    >
      {analysisLines.map((analysisLine) => (
        <AnalysisLineComponent
          key={analysisLine.id}
          analysisLine={analysisLine}
          opacity={opacity}
        />
      ))}
    </svg>
  );
};

export default AnalysisLinesLayer; 