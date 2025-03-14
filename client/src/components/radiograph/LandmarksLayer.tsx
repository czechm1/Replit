import React, { useState, useEffect } from 'react';
import { useLandmarks } from '../../hooks/useLandmarks';
import { LandmarkComponent } from './LandmarkComponent';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, InfoIcon } from 'lucide-react';
import { formatLandmarkAbbreviation, getLandmarkType, getLabelOffset } from '../../utils/landmarkUtils';

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
  // State for confidence threshold
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7); // Default 70% confidence
  const [showConfidenceInfo, setShowConfidenceInfo] = useState(false);
  
  const { landmarkData, loading, error } = useLandmarks();
  
  // Effect to set random confidence values for mock data (since our mock data doesn't have confidence values)
  useEffect(() => {
    // This effect only runs once on component mount
    if (landmarkData && landmarkData.points) {
      // This is just for demonstration purposes
      landmarkData.points.forEach(point => {
        if (point.confidence === undefined) {
          // Assign random confidence between 0.5 and 1.0
          point.confidence = 0.5 + Math.random() * 0.5;
        }
      });
    }
  }, [landmarkData]);

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
    
    // Strong, clear offsets that avoid label overlapping
    const standardOffsets = [
      { x: 20, y: -20 },  // Top-right
      { x: -20, y: -20 }, // Top-left
      { x: 24, y: 0 },    // Right
      { x: -24, y: 0 },   // Left
      { x: 20, y: 20 },   // Bottom-right
      { x: -20, y: 20 },  // Bottom-left
      { x: 0, y: -24 },   // Top
      { x: 0, y: 24 }     // Bottom
    ];
    
    // First, sort points by Y position to create a more predictable distribution
    // This helps group nearby points with different offset patterns
    const sortedPoints = [...points].sort((a, b) => 
      a.coordinates.y - b.coordinates.y
    );
    
    // Process points and add positioning metadata
    sortedPoints.forEach((point: LandmarkPoint, index: number) => {
      // Use anatomically-aware label positioning
      // This positions labels based on the landmark type (dental, skeletal, soft tissue)
      const typeBasedOffset = getLabelOffset(point.landmark);
      
      // Fall back to strategic pattern for any landmarks without type-specific positioning
      if (!typeBasedOffset.x && !typeBasedOffset.y) {
        const offsetIndex = (index * 2) % standardOffsets.length;
        const offset = standardOffsets[offsetIndex];
        
        offsetsByPosition.push({
          point,
          offset: offset
        });
      } else {
        // Use the type-based offset for better anatomical context
        offsetsByPosition.push({
          point,
          offset: typeBasedOffset
        });
      }
    });
    
    return offsetsByPosition;
  };
  
  const optimizedLandmarks = organizeAndPositionLandmarks();
  
  return (
    <div className={`absolute inset-0 ${className || ''}`} style={{ opacity }}>
      {/* Confidence threshold controls */}
      <div className="absolute top-4 right-4 z-50 bg-black/80 rounded-md p-2 shadow-lg border border-white/30 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-white font-medium">Label Confidence: {Math.round(confidenceThreshold * 100)}%</span>
          <button 
            className="text-white/80 hover:text-white"
            onClick={() => setShowConfidenceInfo(!showConfidenceInfo)}
          >
            <InfoIcon size={14} />
          </button>
        </div>
        
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05"
          value={confidenceThreshold}
          onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
          className="w-full"
        />
        
        {showConfidenceInfo && (
          <div className="text-xs text-white/80 mt-1 max-w-[200px]">
            Only landmarks with confidence above threshold will show labels. 
            All points remain visible.
          </div>
        )}
      </div>
      
      {/* Landmarks */}
      {optimizedLandmarks.map((item: OffsetPosition, index: number) => {
        const point = item.point;
        const offset = item.offset;
        const confidence = point.confidence || 0;
        
        // Determine if this landmark should have a visible label
        const showLabel = confidence >= confidenceThreshold;
        
        return (
          <LandmarkComponent
            key={`${point.landmark}-${index}`}
            landmark={{
              id: point.landmark,
              name: point.landmark,
              abbreviation: formatLandmarkAbbreviation(point.landmark),
              x: point.coordinates.x,
              y: point.coordinates.y,
              confidence: confidence
            }}
            isSelected={false}
            isDragging={false}
            isDragged={false}
            isEditMode={false}
            labelOffsets={showLabel ? { x: offset.x, y: offset.y } : { x: 0, y: 0 }}
            // Pass additional props to control label visibility
            hideLabel={!showLabel}
          />
        );
      })}
    </div>
  );
};

export default LandmarksLayer;