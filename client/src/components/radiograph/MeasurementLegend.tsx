import React, { useState, useCallback } from 'react';
import { MeasurementPoint } from '../../hooks/useMeasurements';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MeasurementLegendProps {
  measurements: MeasurementPoint[];
  opacity: number;
  visibleMeasurementGroups: string[];
}

const MeasurementLegend: React.FC<MeasurementLegendProps> = ({
  measurements,
  opacity,
  visibleMeasurementGroups,
}) => {
  // Initialize with collapsed state to false
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  
  // Group measurements by their group
  const skeletalMeasurements = measurements.filter(m => m.group === 'skeletal' && visibleMeasurementGroups.includes(m.group));
  const dentalMeasurements = measurements.filter(m => m.group === 'dental' && visibleMeasurementGroups.includes(m.group));
  const softTissueMeasurements = measurements.filter(m => m.group === 'soft-tissue' && visibleMeasurementGroups.includes(m.group));

  // Helper function to get color based on measurement normality
  const getMeasurementColor = (measurement: MeasurementPoint): string => {
    if (measurement.isNormal) {
      return '#22c55e'; // green for normal values
    }
    return '#ef4444'; // red for abnormal values
  };

  // Sort measurements by ID (numeric)
  const sortById = (a: MeasurementPoint, b: MeasurementPoint) => {
    return parseInt(a.id) - parseInt(b.id);
  };

  // If no measurement groups are visible or opacity is 0, don't render the legend
  if (visibleMeasurementGroups.length === 0 || opacity === 0) {
    return null;
  }

  // Toggle collapsed state
  const handleToggleCollapsed = useCallback(() => {
    setIsCollapsed(prevState => !prevState);
  }, []);

  return (
    <div 
      className={`absolute top-2 left-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 text-white shadow-lg text-[10px] border border-gray-700 z-50 ${isCollapsed ? 'w-[160px]' : 'w-[180px] max-h-[70vh] overflow-y-auto'}`}
      style={{ opacity: opacity / 100 }}
    >
      <div className="mb-1 pb-1 border-b border-gray-600 flex justify-between items-center">
        <h2 className="text-white font-bold text-[10px] uppercase tracking-wider">Measurements</h2>
        <button 
          onClick={handleToggleCollapsed}
          className="text-gray-400 hover:text-white focus:outline-none p-1 rounded hover:bg-gray-700"
          aria-label={isCollapsed ? "Expand" : "Collapse"}
          type="button"
        >
          {isCollapsed ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronUp className="h-3 w-3" />
          )}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="legend-content">
          {/* Skeletal measurements */}
          {skeletalMeasurements.length > 0 && (
            <div className="mb-1.5">
              <h3 className="text-green-400 font-bold text-[9px] mb-0.5 uppercase tracking-wider">SKELETAL</h3>
              <ul className="space-y-0.5 pl-1">
                {skeletalMeasurements.sort(sortById).map(measurement => (
                  <li key={measurement.id} className="flex items-center text-[8px]">
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full mr-1 text-white font-bold text-[7px]" style={{ backgroundColor: getMeasurementColor(measurement) }}>
                      {measurement.id}
                    </span>
                    <span className="text-gray-200 truncate">{measurement.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dental measurements */}
          {dentalMeasurements.length > 0 && (
            <div className="mb-1.5">
              <h3 className="text-green-400 font-bold text-[9px] mb-0.5 uppercase tracking-wider">DENTAL</h3>
              <ul className="space-y-0.5 pl-1">
                {dentalMeasurements.sort(sortById).map(measurement => (
                  <li key={measurement.id} className="flex items-center text-[8px]">
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full mr-1 text-white font-bold text-[7px]" style={{ backgroundColor: getMeasurementColor(measurement) }}>
                      {measurement.id}
                    </span>
                    <span className="text-gray-200 truncate">{measurement.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Soft-tissue measurements */}
          {softTissueMeasurements.length > 0 && (
            <div>
              <h3 className="text-green-400 font-bold text-[9px] mb-0.5 uppercase tracking-wider">SOFT-TISSUE</h3>
              <ul className="space-y-0.5 pl-1">
                {softTissueMeasurements.sort(sortById).map(measurement => (
                  <li key={measurement.id} className="flex items-center text-[8px]">
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full mr-1 text-white font-bold text-[7px]" style={{ backgroundColor: getMeasurementColor(measurement) }}>
                      {measurement.id}
                    </span>
                    <span className="text-gray-200 truncate">{measurement.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-1.5 pt-1 border-t border-gray-600 text-[7px] text-gray-400">
            <div className="flex items-center mb-0.5">
              <span className="inline-block w-2 h-2 rounded-full mr-1 bg-green-500"></span>
              <span>Normal value</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full mr-1 bg-red-500"></span>
              <span>Abnormal value</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementLegend; 