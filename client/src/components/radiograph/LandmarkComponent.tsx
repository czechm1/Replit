import React from 'react';
import { getSelectedLandmarkColor, getLandmarkColor, formatLandmarkAbbreviation } from '../../utils/landmarkUtils';

// Define the interface for landmarks
interface Landmark {
  id: string;
  name: string;
  abbreviation: string;
  x: number;
  y: number;
  description?: string;
  confidence?: number;
}

interface LandmarkComponentProps {
  landmark: Landmark;
  isSelected: boolean;
  isDragging: boolean;
  isDragged: boolean;
  isEditMode: boolean;
  onClick?: (id: string) => void;
}

export function LandmarkComponent({
  landmark,
  isSelected,
  isDragging,
  isDragged,
  isEditMode,
  onClick
}: LandmarkComponentProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(landmark.id);
    }
  };

  // Get abbreviated name with consistent formatting
  const abbreviation = landmark.abbreviation || formatLandmarkAbbreviation(landmark.name);
  
  // Always use the enhanced styling from edit mode
  return (
    <div
      onClick={handleClick}
      className={`absolute w-[10px] h-[10px] -translate-x-[5px] -translate-y-[5px] rounded-full 
        ${isEditMode ? 'cursor-move' : 'cursor-pointer'} group
        transition-all duration-150 ease-in-out
        hover:w-[15px] hover:h-[15px] hover:-translate-x-[7.5px] hover:-translate-y-[7.5px] hover:shadow-lg hover:border-2 hover:border-yellow-300
        ${
          isSelected
          ? 'border-[2px] border-white shadow ring-2 ring-blue-300 ring-opacity-50'
          : isDragged
          ? 'border-[2px] border-white shadow-lg'
          : 'border-[1px] border-white'
        } 
        ${isDragging && isDragged ? 'z-50' : 'z-10'}`}
      style={{
        left: landmark.x,
        top: landmark.y,
        backgroundColor: isSelected 
                          ? getSelectedLandmarkColor(landmark.name)
                          : isDragged 
                            ? getSelectedLandmarkColor(landmark.name)
                            : getLandmarkColor(landmark.name),
      }}
    >
      {/* Display landmark abbreviation with improved visibility - positioned right of the center */}
      <div 
        className="absolute whitespace-nowrap text-xs font-bold text-white pointer-events-none select-none"
        style={{ 
          textShadow: '0px 0px 2px rgba(0,0,0,0.8)',
          letterSpacing: '0.02em',
          right: '-10px',  // Position the text to the right of the point
          top: '-14px'     // Position the text slightly above the point
        }}
        title={`${landmark.name} (${abbreviation})`} // Add tooltip showing full name and abbreviation
      >
        {abbreviation}
      </div>

      {/* Landmark label with improved positioning and alignment - positioned ABOVE the landmark point */}
      <div 
        className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                   whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none z-20 shadow-md"
        style={{ 
          textShadow: '0px 0px 1px rgba(0,0,0,0.5)', 
          minWidth: `${landmark.name.length * 4}px` 
        }}
      >
        {landmark.name}
      </div>
    </div>
  );
}