import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
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
  Users,
  PanelRight
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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
    
    // Let users know about the collaborative feature
    toast({
      title: "Collaborative Mode Available",
      description: "You can now edit landmarks together with other users in real-time!",
      duration: 5000
    });
  }, [location, toast]);
  
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
          <Badge variant="outline" className="ml-2 bg-blue-50">
            <Users className="h-3 w-3 mr-1 text-blue-500" />
            Collaborative Mode
          </Badge>
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
      
      {/* Sidebar toggle icon positioned at right edge */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-10 w-10 rounded-full shadow-md"
                onClick={() => setShowPanel(prev => !prev)}
              >
                <PanelRight className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{showPanel ? 'Collapse Sidebar' : 'Expand Sidebar'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
