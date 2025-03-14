import React from 'react';
import { MeasurementPoint } from '../../hooks/useMeasurements';

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
  // Group measurements by their group
  const skeletalMeasurements = measurements.filter(m => m.group === 'skeletal' && visibleMeasurementGroups.includes(m.group));
  const dentalMeasurements = measurements.filter(m => m.group === 'dental' && visibleMeasurementGroups.includes(m.group));
  const softTissueMeasurements = measurements.filter(m => m.group === 'soft-tissue' && visibleMeasurementGroups.includes(m.group));

  // Helper function to get color based on measurement normality
  const getMeasurementColor = (measurement: MeasurementPoint): string => {
    if (measurement.isNormal) {
      return 'var(--iconOnHighlightGreen, #4dbd78)'; // Normal values - using Vivera green
    }
    return 'var(--backgroundDestructive, #d43f58)'; // Abnormal values - using Vivera destructive
  };

  // Sort measurements by ID (numeric)
  const sortById = (a: MeasurementPoint, b: MeasurementPoint) => {
    return parseInt(a.id) - parseInt(b.id);
  };

  // If no measurement groups are visible or opacity is 0, don't render the legend
  if (visibleMeasurementGroups.length === 0 || opacity === 0) {
    return null;
  }

  return (
    <div className="vivera-measurement-legend">
      <div 
        className="vivera-legend-panel"
        style={{ opacity: opacity / 100 }}
      >
        <div className="vivera-legend-header">
          <h2 className="vivera-legend-title">Measurements</h2>
        </div>
        
        <div className="vivera-legend-scroll-container">
          {/* Skeletal measurements */}
          {skeletalMeasurements.length > 0 && (
            <div className="vivera-legend-group">
              <h3 className="vivera-legend-group-name">SKELETAL</h3>
              <ul className="vivera-legend-items">
                {skeletalMeasurements.sort(sortById).map(measurement => (
                  <li key={measurement.id} className="vivera-legend-item">
                    <span className="vivera-legend-item-badge" style={{ backgroundColor: getMeasurementColor(measurement) }}>
                      {measurement.id}
                    </span>
                    <span className="vivera-legend-item-name">{measurement.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dental measurements */}
          {dentalMeasurements.length > 0 && (
            <div className="vivera-legend-group">
              <h3 className="vivera-legend-group-name">DENTAL</h3>
              <ul className="vivera-legend-items">
                {dentalMeasurements.sort(sortById).map(measurement => (
                  <li key={measurement.id} className="vivera-legend-item">
                    <span className="vivera-legend-item-badge" style={{ backgroundColor: getMeasurementColor(measurement) }}>
                      {measurement.id}
                    </span>
                    <span className="vivera-legend-item-name">{measurement.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Soft-tissue measurements */}
          {softTissueMeasurements.length > 0 && (
            <div className="vivera-legend-group">
              <h3 className="vivera-legend-group-name">SOFT-TISSUE</h3>
              <ul className="vivera-legend-items">
                {softTissueMeasurements.sort(sortById).map(measurement => (
                  <li key={measurement.id} className="vivera-legend-item">
                    <span className="vivera-legend-item-badge" style={{ backgroundColor: getMeasurementColor(measurement) }}>
                      {measurement.id}
                    </span>
                    <span className="vivera-legend-item-name">{measurement.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="vivera-legend-key">
            <div className="vivera-legend-key-item">
              <span className="vivera-legend-key-dot" style={{ backgroundColor: 'var(--iconOnHighlightGreen, #4dbd78)' }}></span>
              <span className="vivera-legend-key-label">Normal value</span>
            </div>
            <div className="vivera-legend-key-item">
              <span className="vivera-legend-key-dot" style={{ backgroundColor: 'var(--backgroundDestructive, #d43f58)' }}></span>
              <span className="vivera-legend-key-label">Abnormal value</span>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          /* Vivera UI Kit Styles for Measurement Legend */
          .vivera-measurement-legend {
            font-family: Roboto, Arial, sans-serif;
            position: relative;
          }
          
          .vivera-legend-panel {
            position: fixed;
            background-color: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 6px;
            border: 1px solid var(--borderSubtle, rgba(0, 0, 0, 0.085));
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
            z-index: 50;
            max-width: 75vw;
            padding-bottom: var(--sp02, 8px);
          }
          
          .vivera-legend-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--sp02, 8px) var(--sp03, 12px);
            border-bottom: 1px solid var(--borderSubtle, rgba(0, 0, 0, 0.085));
            background-color: rgba(255, 255, 255, 0.4);
          }
          
          .vivera-legend-title {
            margin: 0;
            font: var(--tpHeading01, 500 14px/20px Roboto, Arial, sans-serif);
            color: var(--textPrimary, rgba(0, 0, 0, 0.930));
          }
          
          .vivera-legend-scroll-container {
            padding: var(--sp03, 12px);
            overflow-y: auto;
            overflow-x: hidden;
            max-height: calc(80vh - 50px); /* 80% viewport minus header height */
            scrollbar-width: thin;
            scrollbar-color: var(--borderAccent, rgba(0, 0, 0, 0.228)) transparent;
          }
          
          /* Scrollbar styling for WebKit browsers */
          .vivera-legend-scroll-container::-webkit-scrollbar {
            width: 6px;
          }
          
          .vivera-legend-scroll-container::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .vivera-legend-scroll-container::-webkit-scrollbar-thumb {
            background-color: var(--borderAccent, rgba(0, 0, 0, 0.228));
            border-radius: 3px;
          }
          
          .vivera-legend-scroll-container::-webkit-scrollbar-thumb:hover {
            background-color: var(--gray45, #8e8e8e);
          }
          
          .vivera-legend-group {
            margin-bottom: var(--sp03, 12px);
          }
          
          .vivera-legend-group:last-child {
            margin-bottom: 0;
          }
          
          .vivera-legend-group-name {
            font: var(--tpBody01, 400 14px/20px Roboto, Arial, sans-serif);
            color: var(--textPrimary, rgba(0, 0, 0, 0.930));
            font-weight: 600;
            margin: 0 0 var(--sp01, 4px) 0;
            font-size: 12px;
          }
          
          .vivera-legend-items {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .vivera-legend-item {
            display: flex;
            align-items: center;
            margin-bottom: var(--sp01, 4px);
            font-size: 12px;
          }
          
          .vivera-legend-item-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            margin-right: var(--sp02, 8px);
            color: var(--textOnColorPrimary, #ffffff);
            font-weight: bold;
            font-size: 10px;
            flex-shrink: 0;
          }
          
          .vivera-legend-item-name {
            color: var(--textSecondary, rgba(0, 0, 0, 0.630));
            flex-grow: 1;
          }
          
          .vivera-legend-key {
            margin-top: var(--sp02, 8px);
            padding-top: var(--sp02, 8px);
            border-top: 1px solid var(--borderSubtle, rgba(0, 0, 0, 0.085));
          }
          
          .vivera-legend-key-item {
            display: flex;
            align-items: center;
            margin-bottom: var(--sp01, 4px);
            font-size: 11px;
          }
          
          .vivera-legend-key-dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: var(--sp02, 8px);
            flex-shrink: 0;
          }
          
          .vivera-legend-key-label {
            color: var(--textSecondary, rgba(0, 0, 0, 0.630));
          }
        `}
      </style>
    </div>
  );
};

export default MeasurementLegend; 