import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  CalendarDays
} from "lucide-react";

interface PatientInfoBarProps {
  patientId?: string;
  gender?: string;
  age?: string;
  examDate?: string;
}

// Extremely simplified patient info bar
const PatientInfoBar: React.FC<PatientInfoBarProps> = ({
  patientId = "11IRVSH5T",
  gender = "M",
  age = "25",
  examDate = "2025-01-30"
}) => {
  return (
    <div className="bg-slate-50 py-1.5 px-4 flex items-center justify-between text-xs border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">John Smith</span>
          <Badge variant="outline" className="px-1.5 py-0.5 text-[10px] bg-slate-100 border-slate-200 text-slate-600">
            {gender}
          </Badge>
          <span className="text-slate-500">{age} yrs</span>
        </div>
        <Badge variant="secondary" className="px-1.5 py-0.5 text-[10px]">
          ID: {patientId}
        </Badge>
      </div>
      
      <div className="flex items-center gap-1.5 text-slate-500">
        <CalendarDays className="h-3.5 w-3.5" />
        <span>{examDate}</span>
      </div>
    </div>
  );
};

export default PatientInfoBar;
