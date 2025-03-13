import React from 'react';
import { useMeasurements } from '../../hooks/useMeasurements';
import MeasurementComponent from './MeasurementComponent';
import { LoadingSpinner } from '../ui/loading-spinner';

interface MeasurementsLayerProps {
  opacity: number;
  visibleMeasurementGroups: string[];
  className?: string;
}

/**
 * Component that displays all cephalometric measurements
 */
const MeasurementsLayer: React.FC<MeasurementsLayerProps> = ({
  opacity,
  visibleMeasurementGroups,
  className,
}) => {
  const { measurementData, loading, error } = useMeasurements();

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
        <p className="text-destructive text-sm">Failed to load measurements</p>
      </div>
    );
  }

  if (!measurementData || measurementData.measurements.length === 0) {
    return null;
  }

  return (
    <MeasurementComponent
      measurementData={measurementData}
      opacity={opacity}
      visibleMeasurementGroups={visibleMeasurementGroups}
    />
  );
};

export default MeasurementsLayer; 