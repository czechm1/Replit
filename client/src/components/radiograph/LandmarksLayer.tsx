import React from 'react';
import { useLandmarks } from '../../hooks/useLandmarks';
import { LandmarkComponent } from './LandmarkComponent';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { formatLandmarkAbbreviation, getLandmarkType } from '../../utils/landmarkUtils';

interface LandmarksLayerProps {
  opacity: number;
  visibleLandmarkGroups: string[];
  className?: string;
  showTooltips?: boolean;
  editMode?: boolean; // Add support for edit mode
}

interface LandmarkPoint {
  landmark: string;
  coordinates: {
    x: number;
    y: number;
  };
  confidence?: number;
}

interface OffsetPosition {
  point: LandmarkPoint;
  offset: {
    x: number;
    y: number;
  };
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

  // Simple, effective approach for landmark positioning
  const organizeAndPositionLandmarks = () => {
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
    
    // Convert to array of points
    const points = Array.from(uniqueLandmarks.values());
    
    // Use a simpler, more predictable offset system
    const offsetsByPosition: OffsetPosition[] = [];
    
    // Predefined offsets for different scenarios
    const standardOffsets = [
      { x: 10, y: -15 },  // Above left
      { x: -10, y: -15 }, // Above right
      { x: 15, y: 5 },    // Right center
      { x: -15, y: 5 },   // Left center
      { x: 10, y: 15 },   // Below left
      { x: -10, y: 15 }   // Below right
    ];
    
    // Process points and add positioning metadata
    points.forEach((point: LandmarkPoint, index: number) => {
      // Simple, predictable pattern - use point index modulo to cycle through offset patterns
      const offsetIndex = index % standardOffsets.length;
      const offset = standardOffsets[offsetIndex];
      
      // Add the point with standard offset
      offsetsByPosition.push({
        point,
        offset: offset
      });
    });
    
    return offsetsByPosition;
  };
  
  const optimizedLandmarks = organizeAndPositionLandmarks();
  
  return (
    <div className={`absolute inset-0 ${className || ''}`} style={{ opacity }}>
      {optimizedLandmarks.map((item: OffsetPosition, index: number) => {
        const point = item.point;
        const offset = item.offset;
        
        return (
          <LandmarkComponent
            key={`${point.landmark}-${index}`}
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
            labelOffsets={{ x: offset.x, y: offset.y }}
          />
        );
      })}
    </div>
  );
};

export default LandmarksLayer;