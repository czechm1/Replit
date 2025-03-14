import React from 'react';
import { LandmarkPoint } from './types/index';
import { displayLandmarkGroups } from './utils/landmarkGroups';
import { LandmarkTooltip, LandmarkData } from './LandmarkTooltip';
import { getLandmarkDescription } from '../../data/landmarkDescriptions';
import { useIsMobile } from '../../hooks/use-mobile';
import { getLandmarkColor, getAnatomicalRegion } from '../../utils/landmarkUtils';

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
  const isMobile = useIsMobile();

  // Create a landmark data object from a landmark point
  const createLandmarkData = (point: LandmarkPoint): LandmarkData => {
    // Try to get detailed description from our database
    const description = getLandmarkDescription(point.landmark);
    
    if (description) {
      return {
        name: description.name,
        abbreviation: description.abbreviation,
        description: description.description,
        anatomicalRegion: description.anatomicalRegion,
        clinicalSignificance: description.clinicalSignificance,
        confidence: 0.9, // Default to high confidence since our data doesn't include this yet
      };
    }
    
    // Fallback if description not found
    return {
      name: point.landmark,
      abbreviation: point.landmark.substring(0, 2),
      anatomicalRegion: getAnatomicalRegion(point.landmark),
      confidence: 0.9,
    };
  };

  if (!landmarkData) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full">
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
        }).map((point) => {
          const landmarkData = createLandmarkData(point);
          
          return (
            <g key={point.landmark} className="landmark-point">
              <LandmarkTooltip 
                landmark={landmarkData}
                side={isMobile ? "bottom" : "right"}
              >
                <g className="cursor-pointer hover:opacity-80 transition-opacity">
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
                    className="select-none"
                  >
                    {point.landmark}
                  </text>
                  {/* Larger invisible circle for easier hover */}
                  <circle
                    cx={point.coordinates.x}
                    cy={point.coordinates.y}
                    r="15"
                    fill="transparent"
                    className="landmark-hover-area"
                  />
                </g>
              </LandmarkTooltip>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default LandmarkComponent; 