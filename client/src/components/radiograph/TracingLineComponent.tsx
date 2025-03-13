import React from 'react';
import { TracingLine } from './types/tracingLine';

interface TracingLineComponentProps {
  tracingLine: TracingLine;
  opacity: number;
  className?: string;
}

/**
 * Component that renders a SVG path for tracing lines
 */
const TracingLineComponent: React.FC<TracingLineComponentProps> = ({
  tracingLine,
  opacity,
  className,
}) => {
  return (
    <path
      d={tracingLine.pathData}
      stroke={tracingLine.color}
      strokeWidth={tracingLine.strokeWidth}
      strokeDasharray={tracingLine.strokeDasharray || undefined}
      fill="none"
      style={{ opacity: opacity / 100 }}
      className={`tracing-line ${className || ''}`}
      aria-label={tracingLine.name}
      transform={tracingLine.transform}
    />
  );
};

export default TracingLineComponent; 