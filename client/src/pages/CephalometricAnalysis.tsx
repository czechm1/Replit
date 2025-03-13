import React, { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import PatientInfoBar from "@/components/layout/PatientInfoBar";
import RadiographViewer from "@/components/radiograph/RadiographViewer";
import ControlsSidebar from "@/components/analysis/ControlsSidebar";
import KeyboardShortcutsModal from "@/components/modals/KeyboardShortcutsModal";
import ExportOptions from "@/components/export/ExportOptions";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  PanelRight,
  PanelLeftClose,
  X,
  Split
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { api } from "@/services/clientStorage";
import { useQuery } from "@tanstack/react-query";

const CephalometricAnalysis: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Core state
  const [showPanel, setShowPanel] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  
  // Get patient ID from route params
  const [, params] = useRoute('/cephalometric/:patientId');
  const [patientId, setPatientId] = useState<string>("p1");
  const [imageId, setImageId] = useState<string>("img1");
  
  useEffect(() => {
    // Update from route params if available
    if (params && params.patientId) {
      setPatientId(params.patientId);
    }
  }, [params]);
  
  // Fetch patient and image data from client storage
  const { data: patientData } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => api.getPatient(patientId),
  });
  
  const { data: analysisTemplates } = useQuery({
    queryKey: ['analysisTemplates'],
    queryFn: () => api.getAnalysisTemplates(),
  });
  
  // Patient and analysis data
  const patientName = patientData?.name || "Patient";
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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setLocation(`/comparison/${patientId}`)}
                >
                  <Split className="h-4 w-4 mr-1" />
                  <span className="text-sm">Compare Images</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compare with other images</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
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
        <div className="flex-grow bg-slate-50 relative">
          <RadiographViewer 
            highContrastMode={highContrastMode}
            patientId={patientId}
            imageId={imageId}
          />
        </div>
        
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
