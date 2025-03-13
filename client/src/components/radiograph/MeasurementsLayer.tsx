import React from 'react';
import { useMeasurements } from '../../hooks/useMeasurements';
import MeasurementComponent from './MeasurementComponent';
import MeasurementLegend from './MeasurementLegend';
import { LoadingSpinner } from '../ui/loading-spinner';

interface MeasurementsLayerProps {
  opacity: number;
  visibleMeasurementGroups: string[];
  className?: string;
  showLegend?: boolean;
}

/**
 * Component that displays all cephalometric measurements
 */
const MeasurementsLayer: React.FC<MeasurementsLayerProps> = ({
  opacity,
  visibleMeasurementGroups,
  className,
  showLegend = true,
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
    <>
      <MeasurementComponent
        measurementData={measurementData}
        opacity={opacity}
        visibleMeasurementGroups={visibleMeasurementGroups}
      />
      
      {showLegend && (
        <MeasurementLegend
          measurements={measurementData.measurements}
          opacity={opacity}
          visibleMeasurementGroups={visibleMeasurementGroups}
        />
      )}
    </>
  );
};

export default MeasurementsLayer; 