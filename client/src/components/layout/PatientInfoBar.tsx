import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

interface PatientInfoBarProps {
  patientId?: string;
  gender?: string;
  age?: string;
  months?: number;
  certificationCode?: string;
  examDate?: string;
}

const PatientInfoBar: React.FC<PatientInfoBarProps> = ({
  patientId = "11IRVSH5T",
  gender = "Male",
  age = "25",
  months = 0,
  certificationCode = "T09S0PP",
  examDate = "2025-01-30"
}) => {
  return (
    <div className="bg-white border-b border-slate-200 py-2 px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-slate-600 text-sm">, ({patientId})</span>
            <span className="ml-2 px-2 py-0.5 text-xs rounded-md bg-slate-100 text-slate-600">{gender}</span>
            <span className="ml-2 text-sm text-slate-600">{age} years, {months} months</span>
          </div>
          <div className="flex items-center px-2 py-0.5 rounded-md bg-secondary-100 text-secondary-700 text-xs font-medium">
            <Check className="h-4 w-4 mr-1" />
            <span>{certificationCode}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-slate-600">{examDate}</div>
          <Button variant="ghost" size="sm" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoBar;
