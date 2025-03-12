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
  Info,
  ChevronUp,
  ChevronDown
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
  
  // Toggle high contrast mode for improved visibility
  const toggleHighContrast = () => {
    setHighContrastMode(prev => !prev);
  };
  
  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onToggleSidebar: () => setShowPanel(prev => !prev),
    onShowHelp: () => setShowKeyboardShortcuts(true),
    onToggleHighContrast: toggleHighContrast,
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
          
          {/* Moved the Expand/Collapse button to be at the bottom of the screen */}
        </div>
      </header>
      
      {/* Patient info - simplified */}
      <PatientInfoBar />
      
      {/* Main content area - simplified layout */}
      <div className="flex-grow flex overflow-hidden">
        {/* Radiograph View - takes most of the space */}
        <div className="flex-grow bg-slate-50 relative">
          <RadiographViewer highContrastMode={highContrastMode} />
          
          {/* Removed the Edit landmarks button as requested */}
        </div>
        
        {/* Controls panel - conditionally rendered */}
        {showPanel && (
          <ControlsSidebar 
            showDrawerPanel={showPanel} 
            onToggleDrawerPanel={() => setShowPanel(prev => !prev)} 
          />
        )}
      </div>
      
      {/* Expand/Collapse button positioned at bottom of screen */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-8 rounded-full px-3 shadow-md"
                onClick={() => setShowPanel(prev => !prev)}
              >
                {showPanel ? 
                  <><ChevronDown className="h-4 w-4 mr-1" /> Collapse</> : 
                  <><ChevronUp className="h-4 w-4 mr-1" /> Expand</>
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showPanel ? 'Collapse Analysis Panel' : 'Expand Analysis Panel'}</p>
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
