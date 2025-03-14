import React from 'react';
import { useLandmarks } from '../../hooks/useLandmarks';
import { LandmarkComponent } from './LandmarkComponent';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { formatLandmarkAbbreviation } from '../../utils/landmarkUtils';

interface LandmarksLayerProps {
  opacity: number;
  visibleLandmarkGroups: string[];
  className?: string;
  showTooltips?: boolean;
  editMode?: boolean; // Add support for edit mode
}

/**
 * Component that displays all landmarks
 */
const LandmarksLayer: React.FC<LandmarksLayerProps> = ({
  opacity,
  visibleLandmarkGroups,
  className,
  showTooltips = true,
  editMode = false, // Default to false
}) => {
  const { landmarkData, loading, error } = useLandmarks();

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load landmarks. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!landmarkData || landmarkData.points.length === 0) {
    return null;
  }

  // If in edit mode, don't render the visualization layer
  // This prevents conflicts with the editor's interactive landmarks
  if (editMode) {
    return null;
  }

  // Simplified approach - not using complex clustering to avoid duplicate keys
  // Just group landmarks by general area to reduce visual crowding
  const organizeByRegion = () => {
    // Create a map to store unique landmarks by their identifiers
    const uniqueLandmarks = new Map();
    
    // Store each landmark by its unique name
    landmarkData.points.forEach((point) => {
      const key = point.landmark; // Use the landmark name as the unique key
      
      // Only add if we don't already have this landmark
      if (!uniqueLandmarks.has(key)) {
        uniqueLandmarks.set(key, point);
      }
    });
    
    // Convert back to an array of points
    return Array.from(uniqueLandmarks.values());
  };
  
  const organizedLandmarks = organizeByRegion();
  
  return (
    <div className={`absolute inset-0 ${className || ''}`} style={{ opacity }}>
      {organizedLandmarks.map((point, index) => {
        // Calculate staggered offsets based on index
        // This creates a pattern of offsets that helps prevent labels from overlapping
        const row = Math.floor(index / 5); // 5 items per row
        const col = index % 5;
        
        // Calculate offset based on position to create a staggered pattern
        const offsetX = (col - 2) * 8; // -16, -8, 0, 8, 16 pattern
        const offsetY = (row - 2) * 6; // Similar vertical pattern
        
        return (
          <LandmarkComponent
            key={`${point.landmark}-${index}`} // Add index to ensure uniqueness
            landmark={{
              id: point.landmark,
              name: point.landmark,
              abbreviation: formatLandmarkAbbreviation(point.landmark),
              x: point.coordinates.x,
              y: point.coordinates.y,
              confidence: point.confidence
            }}
            isSelected={false}
            isDragging={false}
            isDragged={false}
            isEditMode={false}
            labelOffsets={{ x: offsetX, y: offsetY }}
          />
        );
      })}
    </div>
  );
};

export default LandmarksLayer;