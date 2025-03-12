import React from "react";
import { Progress } from "@/components/ui/progress";

interface ChartMeasurement {
  id: string;
  name: string;
  mean: number;
  standardDeviation: number;
  result: number;
  severity: number;
  description: string;
}

const ChartView: React.FC = () => {
  const measurements: ChartMeasurement[] = [
    {
      id: "fma",
      name: "FMA",
      mean: 25,
      standardDeviation: 4.0,
      result: 26.62,
      severity: 0, // Normal
      description: "Normodivergent facial pattern"
    },
    {
      id: "fmia",
      name: "FMIA",
      mean: 65,
      standardDeviation: 5.0,
      result: 68.86,
      severity: 0, // Normal
      description: "Normal lower incisor inclination relative to upper facial plane"
    },
    {
      id: "impa",
      name: "IMPA",
      mean: 90,
      standardDeviation: 3.5,
      result: 84.51,
      severity: -1, // -1 SD
      description: "Retroclined lower incisor"
    }
  ];

  // Helper function to get the severity scale percentage
  const getSeverityPercentage = (measurement: ChartMeasurement) => {
    if (measurement.severity === 0) return 60; // Normal
    if (measurement.severity < 0) return 45; // Below normal
    return 75; // Above normal
  };

  // Helper function to get the severity text
  const getSeverityText = (measurement: ChartMeasurement) => {
    if (measurement.severity === 0) return "Normal";
    if (measurement.severity === -1) return "-1SD";
    if (measurement.severity === -2) return "-2SD";
    if (measurement.severity === 1) return "+1SD";
    if (measurement.severity === 2) return "+2SD";
    return "Severe";
  };

  // Helper function to get the severity text color
  const getSeverityTextClass = (measurement: ChartMeasurement) => {
    if (measurement.severity === 0) return "text-slate-500";
    return "text-accent-600";
  };

  // Helper function to get the severity bar color
  const getSeverityBarColor = (measurement: ChartMeasurement) => {
    if (measurement.severity === 0) return "bg-secondary-500";
    return "bg-accent-500";
  };

  return (
    <div className="px-4 py-3">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left font-medium text-primary-600 pb-2">&nbsp;</th>
            <th className="text-left font-medium text-slate-700 pb-2">Mean</th>
            <th className="text-left font-medium text-slate-700 pb-2">S.D.</th>
            <th className="text-left font-medium text-slate-700 pb-2">Result</th>
            <th className="text-left font-medium text-slate-700 pb-2">Severity</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((measurement) => (
            <tr key={measurement.id} className="border-b border-slate-100">
              <td className="py-3 text-primary-600">{measurement.name}</td>
              <td>{measurement.mean}</td>
              <td>{measurement.standardDeviation}</td>
              <td className={measurement.severity === 0 ? "text-secondary-600 font-medium" : "text-accent-600 font-medium"}>
                {measurement.result.toFixed(2)}
              </td>
              <td>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-20 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getSeverityBarColor(measurement)} rounded-full`} 
                      style={{ width: `${getSeverityPercentage(measurement)}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs ${getSeverityTextClass(measurement)}`}>
                    {getSeverityText(measurement)}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-5 space-y-1">
        <h4 className="font-medium text-slate-800">Meaning</h4>
        {measurements.map((measurement) => (
          <p key={`desc-${measurement.id}`} className="text-sm text-slate-600">
            <span className={measurement.severity === 0 ? "font-medium text-secondary-600" : "font-medium text-accent-600"}>
              {measurement.description}
            </span>
            {measurement.id === "fma" && " - The patient's facial growth pattern is within normal limits."}
            {measurement.id === "fmia" && " - Lower incisors are properly angled relative to the upper facial plane."}
            {measurement.id === "impa" && " - Lower incisors are tilted slightly backwards, which may affect the facial profile."}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ChartView;
