import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  LineChart, 
  FlaskConical, 
  Users, 
  FileText, 
  RotateCcw, 
  SlidersHorizontal, 
  Eye 
} from "lucide-react";

interface WorkflowTab {
  id: string;
  icon: React.ReactNode;
  label: string;
}

interface WorkflowTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const WorkflowTabs: React.FC<WorkflowTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: WorkflowTab[] = [
    { id: "digitize", icon: <Pencil className="h-5 w-5" />, label: "Digitize" },
    { id: "analysis", icon: <LineChart className="h-5 w-5" />, label: "Analysis" },
    { id: "soft-tissue", icon: <FlaskConical className="h-5 w-5" />, label: "Soft-Tissue" },
    { id: "occlusogram", icon: <Users className="h-5 w-5" />, label: "Occluso." },
    { id: "assessment", icon: <FileText className="h-5 w-5" />, label: "Assess" },
    { id: "treatment", icon: <RotateCcw className="h-5 w-5" />, label: "Treatment" },
    { id: "superimpose", icon: <SlidersHorizontal className="h-5 w-5" />, label: "Superimpose" },
    { id: "view", icon: <Eye className="h-5 w-5" />, label: "View" }
  ];

  return (
    <div className="hidden sm:flex flex-col bg-white border-r border-slate-200 py-2 w-[70px] items-center overflow-y-auto">
      <div className="space-y-3 w-full">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`flex flex-col items-center justify-center w-full px-2 py-2 text-xs 
              ${activeTab === tab.id 
                ? "bg-primary-50 text-primary-600" 
                : "text-slate-500 hover:text-primary-600 hover:bg-primary-50"
              }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon}
            <span className="mt-1">{tab.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default WorkflowTabs;
