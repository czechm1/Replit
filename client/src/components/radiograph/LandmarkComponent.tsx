import React, { useState, useEffect } from 'react';
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
  labelOffsets?: { x?: number; y?: number };
}

export function LandmarkComponent({
  landmark,
  isSelected,
  isDragging,
  isDragged,
  isEditMode,
  onClick,
  labelOffsets = { x: 0, y: 0 }
}: LandmarkComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetailedLabel, setShowDetailedLabel] = useState(false);
  
  // Add delay to showing detailed label to prevent cluttering on quick mouseovers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      timer = setTimeout(() => {
        setShowDetailedLabel(true);
      }, 500); // Show detailed label after 500ms of hover
    } else {
      setShowDetailedLabel(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isHovered]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(landmark.id);
    }
  };

  // Get abbreviated name with consistent formatting
  const abbreviation = landmark.abbreviation || formatLandmarkAbbreviation(landmark.name);
  
  // Calculate size based on state
  const pointSize = isSelected ? 10 : (isHovered ? 12 : 6); // Even smaller default size (6px)
  const pointOffset = pointSize / 2;
  
  // Always use the enhanced styling from edit mode
  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`absolute rounded-full 
        ${isEditMode ? 'cursor-move' : 'cursor-pointer'} group
        transition-all duration-150 ease-in-out shadow-sm
        ${
          isSelected
          ? 'border-[1.5px] border-white shadow-md ring-1 ring-blue-400 ring-opacity-70 z-30'
          : isDragged
          ? 'border-[1.5px] border-white shadow-lg z-20'
          : 'border-[1px] border-white/70 z-10'
        }`}
      style={{
        left: landmark.x,
        top: landmark.y,
        width: `${pointSize}px`,
        height: `${pointSize}px`,
        transform: `translate(-${pointOffset}px, -${pointOffset}px)`,
        backgroundColor: isSelected 
                          ? getSelectedLandmarkColor(landmark.name)
                          : isDragged 
                            ? getSelectedLandmarkColor(landmark.name)
                            : getLandmarkColor(landmark.name),
        boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.2)',
        opacity: isSelected ? 1 : (isHovered ? 0.9 : 0.6), // Even more reduced opacity (0.6) for idle state
        filter: isSelected ? 'none' : (isHovered ? 'saturate(95%)' : 'saturate(75%)') // More desaturation in idle state
      }}
    >
      {/* Smaller abbreviation label that shows on hover or when selected */}
      <div 
        className={`absolute whitespace-nowrap text-[10px] font-medium pointer-events-none select-none px-1 py-0.5 rounded
                   transition-all duration-200 ease-in-out
                   ${isSelected || isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.75)',
          textShadow: '0px 0px 1px rgba(0,0,0,1)',
          letterSpacing: '0.02em',
          right: `${-10 + (labelOffsets.x || 0)}px`,
          bottom: `${-14 + (labelOffsets.y || 0)}px`,
          minWidth: '16px',
          textAlign: 'center',
          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
          zIndex: isSelected ? 30 : 20
        }}
        title={`${landmark.name} (${abbreviation})`}
      >
        {abbreviation}
      </div>

      {/* Full name label - only shows after hovering for a while or when selected */}
      {(showDetailedLabel || isSelected) && (
        <div 
          className="absolute left-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                    whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none z-40 shadow-md"
          style={{ 
            textShadow: '0px 0px 1px rgba(0,0,0,0.5)', 
            minWidth: `${landmark.name.length * 4}px`,
            top: `${-32 + (labelOffsets.y ? labelOffsets.y/2 : 0)}px`,
            left: `${(labelOffsets.x ? labelOffsets.x/2 : 0)}px`,
            transform: `translateX(-50%)`,
            opacity: showDetailedLabel || isSelected ? 1 : 0
          }}
        >
          {landmark.name}
        </div>
      )}
    </div>
  );
}