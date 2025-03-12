import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

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
          {/* Filter button removed as it's managed by parent component */}
          
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
                  <th className="text-center p-2 font-medium text-slate-700">Severity</th>
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
                  {measurement.result}
                </td>
                {showExtendedColumns && (
                  <>
                    <td className="p-2 text-center text-slate-600">{measurement.severity}</td>
                    <td className="p-2 text-center">
                      {measurement.polygonalChart && (
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isInRange(measurement) ? 'bg-green-500' : 'bg-red-500'} rounded-full`} 
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <HelpCircle className="h-4 w-4 text-slate-400" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">{measurement.meaning}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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