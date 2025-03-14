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

  return (
    <div className={`absolute inset-0 ${className || ''}`} style={{ opacity }}>
      {landmarkData.points.map((point) => (
        <LandmarkComponent
          key={point.landmark}
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
        />
      ))}
    </div>
  );
};

export default LandmarksLayer;