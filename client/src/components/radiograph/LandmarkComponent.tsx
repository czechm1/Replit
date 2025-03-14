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
      {/* Always visible abbreviation label - clean white text */}
      <div 
        className={`absolute whitespace-nowrap text-[10px] font-semibold pointer-events-none select-none
                   transition-all duration-200 ease-in-out`}
        style={{ 
          color: '#ffffff', // Clean white for best visibility
          textShadow: '0px 0px 4px rgba(0,0,0,0.9)', // Strong black shadow for contrast
          letterSpacing: '0.025em',
          left: `${labelOffsets.x || 0}px`,
          top: `${labelOffsets.y || 0}px`,
          minWidth: '12px',
          textAlign: 'center',
          transform: isSelected ? 'scale(1.15)' : 'scale(1)',
          zIndex: isSelected ? 30 : 20,
          // Black outline for maximum visibility
          WebkitTextStroke: isSelected ? '0.5px black' : '0.4px black'
        }}
        title={`${landmark.name} (${abbreviation})`}
      >
        {abbreviation}
      </div>

      {/* Full name label - minimalistic popup with subtle background, shows on hover or when selected */}
      <div 
        className={`absolute whitespace-nowrap text-xs
                   pointer-events-none z-40 transition-opacity duration-300
                   ${isSelected || isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.7)',
          textShadow: '0px 0px 1px rgba(0,0,0,1)', 
          minWidth: `${landmark.name.length * 4}px`,
          top: `${-30}px`,
          left: `0px`,
          transform: `translateX(-50%)`,
          fontWeight: 'medium',
          padding: '2px 5px',
          borderRadius: '3px',
          // Simple clean background
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        {landmark.name}
      </div>
    </div>
  );
}