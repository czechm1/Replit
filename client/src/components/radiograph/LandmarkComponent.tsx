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
  
  // Calculate border based on confidence
  const confidenceValue = landmark.confidence !== undefined ? landmark.confidence : 1;
  const borderWidth = isSelected ? 1.5 : 1;
  const borderOpacity = confidenceValue * 100; // Scale to percentage
  
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
        opacity: isSelected ? 1 : (isHovered ? 0.9 : Math.max(0.4, confidenceValue * 0.8)), // Opacity based on confidence
        filter: isSelected ? 'none' : (isHovered ? 'saturate(95%)' : 'saturate(75%)'), // More desaturation in idle state
        borderColor: 'white',
        borderWidth: `${borderWidth}px`,
        borderStyle: hideLabel ? 
          (confidenceValue > 0.8 ? 'solid' : confidenceValue > 0.5 ? 'dashed' : 'dotted') : 
          'solid'  // Visual indicator for confidence
      }}
    >
      {/* Abbreviation label with high contrast black background - conditionally displayed based on confidence */}
      {!hideLabel && (
        <div 
          className={`absolute whitespace-nowrap text-[10px] font-bold pointer-events-none select-none
                     bg-black py-0.5 px-1 rounded-sm border border-white/30 transition-all duration-200 ease-in-out`}
          style={{ 
            color: '#ffffff', // Bright white text
            letterSpacing: '0.03em',
            left: `${labelOffsets.x || 0}px`,
            top: `${labelOffsets.y || 0}px`,
            minWidth: '14px',
            textAlign: 'center',
            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
            zIndex: isSelected ? 30 : 20,
          }}
          title={`${landmark.name} (${abbreviation})`}
        >
          {abbreviation}
          {landmark.confidence !== undefined && (
            <span className="ml-1 opacity-60 text-[8px]">
              {Math.round(landmark.confidence * 100)}%
            </span>
          )}
        </div>
      )}

      {/* Full name label with strong contrast background - show only when hovered regardless of confidence */}
      {(isSelected || isHovered) && (
        <div 
          className={`absolute whitespace-nowrap text-xs font-medium
                    pointer-events-none z-40 transition-opacity duration-300 bg-black border border-white/50
                    px-2 py-1 rounded-md shadow-md opacity-100`}
          style={{ 
            color: '#ffffff',
            minWidth: `${landmark.name.length * 4}px`,
            top: `${-40}px`,
            left: `0px`,
            transform: `translateX(-50%)`,
          }}
        >
          <div className="flex flex-col">
            <span>{landmark.name}</span>
            {landmark.confidence !== undefined && (
              <span className="text-[9px] text-white/70">
                Confidence: {Math.round(landmark.confidence * 100)}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}