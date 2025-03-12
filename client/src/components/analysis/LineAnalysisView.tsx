import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MeasurementLine {
  id: string;
  name: string;
  value: number;
  normalRange: string;
  status: "normal" | "high" | "low";
}

const LineAnalysisView: React.FC = () => {
  const measurements: MeasurementLine[] = [
    {
      id: "sna",
      name: "SNA",
      value: 83.5,
      normalRange: "82° ± 2°",
      status: "normal"
    },
    {
      id: "snb",
      name: "SNB",
      value: 79.8,
      normalRange: "80° ± 2°",
      status: "normal"
    },
    {
      id: "anb",
      name: "ANB",
      value: 3.7,
      normalRange: "2° ± 2°",
      status: "normal"
    },
    {
      id: "fma",
      name: "FMA",
      value: 26.6,
      normalRange: "25° ± 4°",
      status: "normal"
    },
    {
      id: "fmia",
      name: "FMIA",
      value: 68.8,
      normalRange: "65° ± 5°",
      status: "normal"
    },
    {
      id: "impa",
      name: "IMPA",
      value: 84.5,
      normalRange: "90° ± 3.5°",
      status: "low"
    }
  ];

  return (
    <div className="px-4 py-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-slate-800">Line Analysis Results</h3>
        <Badge variant="outline" className="bg-primary-50 text-primary-700">Tweed Analysis</Badge>
      </div>
      
      <div className="space-y-4">
        {measurements.map((measurement) => (
          <div key={measurement.id} className="bg-slate-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">{measurement.name}</span>
              <Badge variant={measurement.status === "normal" ? "secondary" : "accent"}>
                {measurement.value}°
              </Badge>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-slate-600">
              <span>Normal range: {measurement.normalRange}</span>
              <span className={
                measurement.status === "normal" 
                  ? "text-secondary-600" 
                  : measurement.status === "high" 
                    ? "text-amber-600" 
                    : "text-accent-600"
              }>
                {measurement.status === "normal" 
                  ? "Within normal range" 
                  : measurement.status === "high" 
                    ? "Above normal" 
                    : "Below normal"}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 space-y-3">
        <h4 className="font-medium text-slate-800">Interpretation</h4>
        <p className="text-sm text-slate-600">
          The analysis shows a <span className="font-medium text-secondary-600">Class I skeletal pattern</span> with 
          a <span className="font-medium text-secondary-600">normodivergent facial profile</span>. The mandibular incisors 
          are <span className="font-medium text-accent-600">slightly retroclined</span> relative to the mandibular plane.
        </p>
        
        <Button className="w-full mt-4 px-4 py-2 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 text-sm font-medium rounded-md transition-colors">
          Generate Detailed Report
        </Button>
      </div>
    </div>
  );
};

export default LineAnalysisView;
