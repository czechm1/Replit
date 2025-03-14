import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import PatientInfoBar from "@/components/layout/PatientInfoBar";
import RadiographViewer from "@/components/radiograph/RadiographViewer";
import ControlsSidebar from "@/components/analysis/ControlsSidebar";
import KeyboardShortcutsModal from "@/components/modals/KeyboardShortcutsModal";
import ExportOptions from "@/components/export/ExportOptions";
import AnalysisTable from "@/components/analysis/AnalysisTable";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  HelpCircle, 
  PanelRight,
  PanelLeftClose,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  X
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { rickettsAnalysisData } from "@/data/analysisData";

const CephalometricAnalysis: React.FC = () => {
  const [location] = useLocation();
  const { toast } = useToast();
  
  // Core state
  const [showPanel, setShowPanel] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  
  // Extract patient ID and image ID from URL if available
  // Format could be like: /analysis/patient-123/image-456
  const [patientId, setPatientId] = useState<string>("demo-patient-1");
  const [imageId, setImageId] = useState<string>("demo-image-1");
  
  useEffect(() => {
    // Parse path to extract patient and image IDs
    const pathParts = location.split('/').filter(Boolean);
    if (pathParts.length >= 3 && pathParts[0] === 'analysis') {
      setPatientId(pathParts[1]);
      setImageId(pathParts[2]);
    }
  }, [location]);
  
  // Patient and analysis data - would come from context or props in a real app
  const patientName = "John Smith";
  const analysisType = "Ricketts";
  
  // Toggle high contrast mode for improved visibility
  const toggleHighContrast = () => {
    setHighContrastMode(prev => !prev);
  };
  
  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onToggleSidebar: () => setShowPanel(prev => !prev),
    onShowHelp: () => setShowKeyboardShortcuts(true),
    onToggleHighContrast: toggleHighContrast,
  });

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header with core actions */}
      <header className="p-3 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary-700">CephaloScan</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Export options dropdown */}
          <ExportOptions 
            patientId={patientName} 
            analysisType={analysisType} 
          />
          
          <Button size="sm" variant="ghost" onClick={() => setShowKeyboardShortcuts(true)}>
            <HelpCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Help</span>
          </Button>
        </div>
      </header>
      
      {/* Patient info bar */}
      <PatientInfoBar 
        patientId={patientId}
        gender="Male"
        age="32"
        examDate={new Date().toLocaleDateString()}
      />
      
      {/* Main content area */}
      <div className="flex-grow flex overflow-hidden">
        {/* Radiograph View */}
        <div className="flex-grow bg-slate-800 relative">
          <RadiographViewer 
            imageUrl="/images/cephalometric.png"
            highContrastMode={highContrastMode}
            patientId={patientId}
            imageId={imageId}
          />
        </div>
        
        {/* Analysis Results Panel */}
        <div className="w-96 border-l border-slate-200 flex flex-col bg-white overflow-auto">
          <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200">
            <h2 className="text-sm font-medium flex items-center">
              <ChevronRight className="h-4 w-4 mr-1" />
              Analysis Results
            </h2>
            <div className="flex items-center space-x-2">
              <button 
                className="text-slate-500 hover:text-slate-700 focus:outline-none"
                onClick={() => toast({
                  title: "AI Assessment",
                  description: "AI analysis is running. Results will be available shortly.",
                })}
              >
                <AlertCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <h3 className="font-medium text-sm">AI Clinical Assessment</h3>
              <ChevronRight className="h-4 w-4 ml-auto text-slate-400" />
            </div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <label htmlFor="rickettsAnalysis" className="text-sm font-medium text-slate-800">
                  Ricketts Analysis 
                </label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Show deviations</span>
                <Switch id="showDeviations" />
              </div>
            </div>
          </div>
          
          <div className="flex-grow overflow-auto p-4">
            {/* Analysis Table */}
            <AnalysisTable 
              measurements={rickettsAnalysisData} 
              analysisName="Ricketts" 
            />
          </div>
        </div>
        
        {/* Controls panel toggle */}
        {!showPanel && (
          <button 
            onClick={() => setShowPanel(true)}
            className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md"
          >
            <PanelRight className="h-5 w-5 text-slate-600" />
          </button>
        )}
        
        {/* Controls panel */}
        {showPanel && (
          <ControlsSidebar 
            showDrawerPanel={showPanel} 
            onToggleDrawerPanel={() => setShowPanel(prev => !prev)} 
          />
        )}
      </div>

      {/* Modals */}
      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
};

export default CephalometricAnalysis;
