import React from 'react';
import { LandmarkPoint } from './types/index';
import { displayLandmarkGroups } from './utils/landmarkGroups';

interface LandmarkComponentProps {
  landmarkData: {
    points: LandmarkPoint[];
    box: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  } | null;
  opacity: number;
  visibleLandmarkGroups: string[];
}

const LandmarkComponent: React.FC<LandmarkComponentProps> = ({
  landmarkData,
  opacity,
  visibleLandmarkGroups,
}) => {
  const getLandmarkColor = (landmark: string): string => {
    if (
      landmark.toLowerCase().includes('dental') ||
      landmark.includes('1') ||
      landmark.includes('6')
    ) {
      return '#22c55e'; // green for dental
    }
    return '#ef4444'; // red for skeletal
  };

  if (!landmarkData) return null;

  return (
    <svg
      className="absolute top-[55px] left-[145px] w-full h-full"
      viewBox={`${landmarkData.box.left} ${landmarkData.box.top} ${
        landmarkData.box.right - landmarkData.box.left
      } ${landmarkData.box.bottom - landmarkData.box.top}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ opacity: opacity / 100 }}
    >
      {/* Draw landmark points */}
      {displayLandmarkGroups(landmarkData.points, {
        selectedGroups: visibleLandmarkGroups as ['skeletal', 'dental'],
      }).map((point) => (
        <g key={point.landmark}>
          <circle
            cx={point.coordinates.x}
            cy={point.coordinates.y}
            r="5"
            fill={getLandmarkColor(point.landmark)}
            stroke="#ffffff"
            strokeWidth="1"
          />
          <text
            x={point.coordinates.x + 10}
            y={point.coordinates.y}
            fontSize="14"
            fontWeight="bold"
            fill="#ECE156"
            className="select-none pointer-events-none"
          >
            {point.landmark}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default LandmarkComponent; 