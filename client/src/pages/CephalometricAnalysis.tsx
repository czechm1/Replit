import React, { useState } from "react";
import PatientInfoBar from "@/components/layout/PatientInfoBar";
import RadiographViewer from "@/components/radiograph/RadiographViewer";
import ControlsSidebar from "@/components/analysis/ControlsSidebar";
import KeyboardShortcutsModal from "@/components/modals/KeyboardShortcutsModal";
import ExportOptions from "@/components/export/ExportOptions";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Button } from "@/components/ui/button";
import { 
  BarChartBig, 
  HelpCircle, 
  Edit3
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CephalometricAnalysis: React.FC = () => {
  // Core state - simplified to only what's necessary
  const [showPanel, setShowPanel] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  
  // Patient and analysis data - would come from context or props in a real app
  const patientName = "John Smith";
  const analysisType = "Ricketts";
  
  // We're no longer managing modals here as they're now handled in the ExportOptions component
  
  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onToggleSidebar: () => setShowPanel(prev => !prev),
    onShowHelp: () => setShowKeyboardShortcuts(true),
    onToggleHighContrast: () => {}, // Keep for keyboard shortcut handling but no longer used
    // Print shortcut is not implemented at this level anymore
  });

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Simplified header with core actions */}
      <header className="p-3 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary-700">CephaloScan</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Replace the basic report button with our dropdown menu */}
          <ExportOptions 
            patientId={patientName} 
            analysisType={analysisType} 
          />
          
          <Button size="sm" variant="ghost" onClick={() => setShowKeyboardShortcuts(true)}>
            <HelpCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Help</span>
          </Button>
          
          <Button 
            size="sm" 
            variant={showPanel ? "default" : "outline"}
            onClick={() => setShowPanel(prev => !prev)}
          >
            <BarChartBig className="h-4 w-4 mr-1" />
            <span className="text-sm">Analyze</span>
          </Button>
        </div>
      </header>
      
      {/* Patient info - simplified */}
      <PatientInfoBar />
      
      {/* Main content area - simplified layout */}
      <div className="flex-grow flex overflow-hidden">
        {/* Radiograph View - takes most of the space */}
        <div className="flex-grow bg-slate-50 relative">
          <RadiographViewer highContrastMode={false} />
          
          {/* Edit landmarks button in top-right corner */}
          <div className="absolute top-4 right-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="secondary" className="shadow-md">
                    <Edit3 className="h-4 w-4 mr-1" />
                    <span className="text-sm">Edit Landmarks</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit landmarks position</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Controls panel - conditionally rendered */}
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
