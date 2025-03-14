import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

// Define the structure of a measurement in the table
interface AnalysisMeasurement {
  id: string;
  name: string;
  mean: number;
  sd: number;
  result: number;
  severity: string;
  polygonalChart?: boolean;
  meaning: string;
  inRange: boolean;
}

interface AnalysisTableProps {
  measurements: AnalysisMeasurement[];
  analysisName: string;
}

const AnalysisTable: React.FC<AnalysisTableProps> = ({ measurements, analysisName }) => {
  const [showExtendedColumns, setShowExtendedColumns] = useState(false);
  
  // Helper function to determine if a value is within range
  const isInRange = (measurement: AnalysisMeasurement): boolean => {
    return measurement.inRange;
  };

  // Calculate the deviation from mean (in standard deviations)
  const calculateDeviation = (measurement: AnalysisMeasurement): number => {
    const deviation = (measurement.result - measurement.mean) / measurement.sd;
    return parseFloat(deviation.toFixed(1));
  };

  // Get deviation class for styling
  const getDeviationClass = (deviation: number): string => {
    if (deviation >= -1 && deviation <= 1) return "bg-green-100 text-green-800";
    if (deviation > 1 && deviation <= 2) return "bg-amber-100 text-amber-800";
    if (deviation < -1 && deviation >= -2) return "bg-amber-100 text-amber-800";
    if (deviation > 2) return "bg-red-100 text-red-800";
    if (deviation < -2) return "bg-red-100 text-red-800";
    return "";
  };
  
  // Get severity text
  const getSeverityText = (deviation: number): string => {
    if (deviation >= -1 && deviation <= 1) return "Normal";
    if (deviation > 1 && deviation <= 2) return "Mild";
    if (deviation < -1 && deviation >= -2) return "Mild";
    if (deviation > 2) return "Severe";
    if (deviation < -2) return "Severe";
    return "";
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium flex items-center text-slate-800">
          <span className="mr-2">{analysisName} Analysis</span>
          <button
            onClick={() => setShowExtendedColumns(!showExtendedColumns)}
            className="text-xs bg-transparent border-none inline-flex items-center"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showExtendedColumns ? 'rotate-180' : ''}`} />
            <span className="ml-1 text-xs text-slate-600">
              {showExtendedColumns ? "Hide Details" : "Show Details"}
            </span>
          </button>
        </h3>
      </div>

      <div className="rounded-md overflow-hidden border border-slate-200">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-2 px-3 font-medium text-slate-700" style={{ minWidth: '140px' }}>Measurement</th>
              {showExtendedColumns && (
                <>
                  <th className="text-center p-2 font-medium text-slate-700 w-12">Mean</th>
                  <th className="text-center p-2 font-medium text-slate-700 w-12">S.D.</th>
                </>
              )}
              <th className="text-center p-2 font-medium text-slate-700 w-12">Result</th>
              <th className="text-center p-2 font-medium text-slate-700 w-12">Dev.</th>
              {showExtendedColumns && (
                <th className="text-center p-2 font-medium text-slate-700">Interpretation</th>
              )}
            </tr>
          </thead>
          <tbody>
            {measurements.map((measurement) => {
              const deviation = calculateDeviation(measurement);
              const deviationClass = getDeviationClass(deviation);
              const severityText = getSeverityText(deviation);
              
              return (
                <tr key={measurement.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-2 px-3 font-medium text-slate-700">
                    <div className="flex items-center">
                      {measurement.name}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3.5 w-3.5 ml-1 text-slate-400" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="max-w-xs text-xs">{measurement.meaning}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                  {showExtendedColumns && (
                    <>
                      <td className="p-2 text-center text-slate-600">{measurement.mean}</td>
                      <td className="p-2 text-center text-slate-600">{measurement.sd}</td>
                    </>
                  )}
                  <td className={`p-2 text-center font-medium ${
                    // Color coding based on if value is in range
                    isInRange(measurement) 
                      ? 'text-slate-700' 
                      : measurement.result > measurement.mean 
                        ? 'text-red-600' 
                        : 'text-blue-600'
                  }`}>
                    {measurement.result.toFixed(1)}
                  </td>
                  <td className="p-2 text-center">
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${deviationClass}`}>
                      {deviation > 0 ? '+' : ''}{deviation}
                    </span>
                  </td>
                  {showExtendedColumns && (
                    <td className="p-2 text-xs text-slate-600">
                      {measurement.meaning}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2">
        <div className="text-xs text-slate-600">Deviation ranges:</div>
        <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Normal (±1 SD)</div>
        <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Mild (±1-2 SD)</div>
        <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Severe ({'>'}±2 SD)</div>
      </div>
    </div>
  );
};

export default AnalysisTable;