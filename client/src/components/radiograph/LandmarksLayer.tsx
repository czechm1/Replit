import React from 'react';
import { useLandmarks } from '../../hooks/useLandmarks';
import LandmarkComponent from './LandmarkComponent';
import { LoadingSpinner } from '../ui/loading-spinner';

interface LandmarksLayerProps {
  opacity: number;
  visibleLandmarkGroups: string[];
  className?: string;
}

/**
 * Component that displays all landmarks
 */
const LandmarksLayer: React.FC<LandmarksLayerProps> = ({
  opacity,
  visibleLandmarkGroups,
  className,
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
        <p className="text-destructive text-sm">Failed to load landmarks</p>
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