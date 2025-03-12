import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

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

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-slate-800">{analysisName} Analysis</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowExtendedColumns(!showExtendedColumns)}
            className="text-xs"
          >
            {showExtendedColumns ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Collapse Columns
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Expand Columns
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b">
              <th className="text-left p-2 font-medium text-slate-700">Measurement</th>
              <th className="text-center p-2 font-medium text-slate-700">Mean</th>
              <th className="text-center p-2 font-medium text-slate-700">S.D.</th>
              <th className="text-center p-2 font-medium text-slate-700">Result</th>
              {showExtendedColumns && (
                <>
                  <th className="text-center p-2 font-medium text-slate-700">Chart</th>
                  <th className="text-center p-2 font-medium text-slate-700">Meaning</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {measurements.map((measurement) => (
              <tr key={measurement.id} className="border-b">
                <td className="p-2 font-medium text-slate-700">{measurement.name}</td>
                <td className="p-2 text-center text-slate-600">{measurement.mean}</td>
                <td className="p-2 text-center text-slate-600">{measurement.sd}</td>
                <td className={`p-2 text-center font-medium ${isInRange(measurement) ? 'text-green-600' : 'text-red-600'}`}>
                  {!showExtendedColumns ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="cursor-help">{measurement.result}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-xs">{measurement.meaning}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    measurement.result
                  )}
                </td>
                {showExtendedColumns && (
                  <>
                    <td className="p-2 text-center">
                      {measurement.polygonalChart && (
                        <div className="flex items-center">
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isInRange(measurement) ? 'bg-green-500' : 'bg-red-500'} rounded-full`} 
                              style={{ width: `${isInRange(measurement) ? '100%' : '60%'}` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs font-medium text-slate-500">
                            {measurement.severity}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-left">
                      <p className="text-xs text-slate-600">{measurement.meaning}</p>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisTable;