import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  CalendarDays
} from "lucide-react";
import { api } from "@/services/clientStorage";
import { useQuery } from "@tanstack/react-query";

interface PatientInfoBarProps {
  patientId?: string;
  gender?: string;
  age?: string;
  examDate?: string;
}

// Patient info bar with client-side data fetching
const PatientInfoBar: React.FC<PatientInfoBarProps> = ({
  patientId = "p1",
  gender,
  age,
  examDate = new Date().toLocaleDateString()
}) => {
  // Fetch patient data from client storage
  const { data: patientData } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => api.getPatient(patientId),
    // Don't refetch on window focus for this demo app
    refetchOnWindowFocus: false,
  });

  // Use provided props or fall back to fetched data
  const displayName = patientData?.name || "Patient";
  const displayGender = gender || patientData?.gender || "unknown";
  const displayAge = age || (patientData?.age?.toString() || "0");
  const genderDisplay = displayGender === "male" ? "M" : displayGender === "female" ? "F" : "X";

  return (
    <div className="bg-slate-50 py-1.5 px-4 flex items-center justify-between text-xs border-b border-slate-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-slate-700">{displayName}</span>
          <Badge variant="outline" className="px-1.5 py-0.5 text-[10px] bg-slate-100 border-slate-200 text-slate-600">
            {genderDisplay}
          </Badge>
          <span className="text-slate-500">{displayAge} yrs</span>
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
