import React from 'react';
import { useLandmarks } from '../../hooks/useLandmarks';
import LandmarkComponent from './LandmarkComponent';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface LandmarksLayerProps {
  opacity: number;
  visibleLandmarkGroups: string[];
  className?: string;
  showTooltips?: boolean;
}

/**
 * Component that displays all landmarks
 */
const LandmarksLayer: React.FC<LandmarksLayerProps> = ({
  opacity,
  visibleLandmarkGroups,
  className,
  showTooltips = true,
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

  return (
    <LandmarkComponent
      landmarkData={landmarkData}
      opacity={opacity}
      visibleLandmarkGroups={visibleLandmarkGroups}
    />
  );
};

export default LandmarksLayer; 