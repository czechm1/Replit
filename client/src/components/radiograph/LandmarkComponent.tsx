import React from 'react';
import { Landmark } from '../../../shared/schema';
import { getSelectedLandmarkColor } from './utils/colors';

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
                            : landmark.color || '#3b82f6',
      }}
    >
      {/* Display landmark abbreviation for better visibility */}
      {landmark.abbreviation && (
        <div className="absolute whitespace-nowrap text-xs font-bold text-white -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pointer-events-none select-none">
          {landmark.abbreviation}
        </div>
      )}

      {/* Landmark label */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap bg-black/75 text-white text-xs px-2 py-0.5 rounded pointer-events-none">
        {landmark.name}
      </div>
    </div>
  );
}