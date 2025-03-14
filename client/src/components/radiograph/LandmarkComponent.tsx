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
  hideLabel?: boolean; // New prop to control label visibility based on confidence
}

export function LandmarkComponent({
  landmark,
  isSelected,
  isDragging,
  isDragged,
  isEditMode,
  onClick,
  labelOffsets = { x: 0, y: 0 },
  hideLabel = false
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
  
  // Border styling
  const borderWidth = isSelected ? 1.5 : 1;
  
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
          : 'border-[1px] z-10'
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
        opacity: isSelected ? 1 : (isHovered ? 0.9 : 0.6), // Standard opacity with no confidence scaling
        filter: isSelected ? 'none' : (isHovered ? 'saturate(95%)' : 'saturate(75%)'), // More desaturation in idle state
        borderColor: 'white',
        borderWidth: `${borderWidth}px`,
        borderStyle: 'solid' // Simple border style with no confidence indicators
      }}
    >
      {/* Abbreviation label with ultra high contrast yellow - no background */}
      {!hideLabel && (
        <div 
          className={`absolute whitespace-nowrap text-[11px] font-black pointer-events-none select-none
                     transition-all duration-200 ease-in-out`}
          style={{ 
            color: '#FFFF00', // Ultra high contrast yellow
            // No text shadow as requested
            letterSpacing: '0.05em',
            left: `${labelOffsets.x || 0}px`,
            top: `${labelOffsets.y || 0}px`,
            minWidth: '14px',
            textAlign: 'center',
            transform: isSelected ? 'scale(1.25)' : 'scale(1)',
            zIndex: isSelected ? 30 : 20,
          }}
          title={`${landmark.name} (${abbreviation})`}
        >
          {abbreviation}
        </div>
      )}

      {/* Full name label with no background - show only when hovered */}
      {(isSelected || isHovered) && (
        <div 
          className={`absolute whitespace-nowrap text-xs font-black
                    pointer-events-none z-40 transition-opacity duration-300 opacity-100`}
          style={{ 
            color: '#FFFF00', // Ultra high contrast yellow
            // No text shadow as requested
            minWidth: `${landmark.name.length * 4}px`,
            top: `${-35}px`,
            left: `0px`,
            transform: `translateX(-50%)`,
            letterSpacing: '0.03em',
          }}
        >
          {landmark.name}
        </div>
      )}
    </div>
  );
}