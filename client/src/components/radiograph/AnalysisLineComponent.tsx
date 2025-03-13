import React from 'react';
import { AnalysisLine } from './types/analysisLine';

interface AnalysisLineComponentProps {
  analysisLine: AnalysisLine;
  opacity: number;
  className?: string;
}

/**
 * Component that renders a SVG path for analysis lines
 */
const AnalysisLineComponent: React.FC<AnalysisLineComponentProps> = ({
  analysisLine,
  opacity,
  className,
}) => {
  return (
    <path
      d={analysisLine.pathData}
      stroke={analysisLine.color}
      strokeWidth={analysisLine.strokeWidth}
      strokeDasharray={analysisLine.strokeDasharray || undefined}
      fill="none"
      style={{ opacity: opacity / 100 }}
      className={`analysis-line ${className || ''}`}
      aria-label={analysisLine.name}
      transform={analysisLine.transform}
    />
  );
};

export default AnalysisLineComponent; 