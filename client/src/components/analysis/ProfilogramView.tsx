import React from "react";
import { Button } from "@/components/ui/button";

const ProfilogramView: React.FC = () => {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span className="text-sm text-slate-700 mt-1">Standard</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-slate-700 mt-1">Patient</span>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mb-4">
        <div className="text-center">
          <h3 className="font-medium text-slate-800 mb-2">Profilogram Measurements</h3>
          <p className="text-sm text-slate-600">
            The profilogram shows a comparison between the patient's profile and the standard values.
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-700 font-medium">SNA</span>
            <span className="text-sm text-slate-700">82° (±2°)</span>
            <span className="text-sm text-secondary-600 font-medium">83.5°</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-700 font-medium">SNB</span>
            <span className="text-sm text-slate-700">80° (±2°)</span>
            <span className="text-sm text-secondary-600 font-medium">79.8°</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-700 font-medium">ANB</span>
            <span className="text-sm text-slate-700">2° (±2°)</span>
            <span className="text-sm text-secondary-600 font-medium">3.7°</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-700 font-medium">Convexity</span>
            <span className="text-sm text-slate-700">0mm (±2mm)</span>
            <span className="text-sm text-accent-600 font-medium">4.2mm</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-700 font-medium">Lower face height</span>
            <span className="text-sm text-slate-700">55% (±2%)</span>
            <span className="text-sm text-secondary-600 font-medium">56.2%</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 mt-4">
        <Button variant="outline" className="flex-1 py-2 px-4 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md">
          Export Results
        </Button>
        <Button variant="outline" className="flex-1 py-2 px-4 text-sm bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-md">
          Save Setup
        </Button>
      </div>
    </div>
  );
};

export default ProfilogramView;
