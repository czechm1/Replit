import React from 'react';
import { MeasurementPoint } from '../../hooks/useMeasurements';

interface MeasurementComponentProps {
  measurementData: {
    measurements: MeasurementPoint[];
    box: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  } | null;
  opacity: number;
  visibleMeasurementGroups: string[];
}

const MeasurementComponent: React.FC<MeasurementComponentProps> = ({
  measurementData,
  opacity,
  visibleMeasurementGroups,
}) => {
  const getMeasurementColor = (measurement: MeasurementPoint): string => {
    if (measurement.isNormal) {
      return '#22c55e'; // green for normal values
    }
    return '#ef4444'; // red for abnormal values
  };

  const getSeverityMarker = (severity: string): string => {
    return severity;
  };

  if (!measurementData) return null;

  return (
    <svg
      className="absolute top-[-200px] left-[105px]"
      viewBox={`${measurementData.box.left} ${measurementData.box.top} ${
        measurementData.box.right - measurementData.box.left
      } ${measurementData.box.bottom - measurementData.box.top}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ opacity: opacity / 100, width: '742.7632px', height: '1007px' }}
    >
      {/* Draw measurement points */}
      {measurementData.measurements
        .filter(measurement => visibleMeasurementGroups.includes(measurement.group))
        .map((measurement) => (
          <g key={measurement.id}>
            {/* Measurement ID circle */}
            <circle
              cx={measurement.coordinates.x - 15}
              cy={measurement.coordinates.y}
              r="10"
              fill={getMeasurementColor(measurement)}
              stroke="#ffffff"
              strokeWidth="0.8"
              filter="drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.5))"
            />
            
            {/* Measurement ID text */}
            <text
              x={measurement.coordinates.x - 15}
              y={measurement.coordinates.y + 3}
              fontSize="10"
              fontWeight="bold"
              fill="#ffffff"
              textAnchor="middle"
              className="select-none pointer-events-none"
            >
              {measurement.id}
            </text>
            
            {/* Measurement value */}
            <text
              x={measurement.coordinates.x}
              y={measurement.coordinates.y + 3}
              fontSize="12"
              fontWeight="bold"
              fill={getMeasurementColor(measurement)}
              className="select-none pointer-events-none"
              filter="drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.7))"
            >
              {measurement.value} {getSeverityMarker(measurement.severity)}
            </text>
          </g>
        ))}
    </svg>
  );
};

export default MeasurementComponent; 