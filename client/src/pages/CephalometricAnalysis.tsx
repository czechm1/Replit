import React, { useState, useEffect } from "react";
import PatientInfoBar from "@/components/layout/PatientInfoBar";
import RadiographViewer from "@/components/radiograph/RadiographViewer";
import ControlsSidebar from "@/components/analysis/ControlsSidebar";
import KeyboardShortcutsModal from "@/components/modals/KeyboardShortcutsModal";
import TutorialButton from "@/components/tutorial/TutorialButton";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTutorial } from "@/context/TutorialContext";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Menu, Eye, Settings, HelpCircle, FileImage, Save } from "lucide-react";

const CephalometricAnalysis: React.FC = () => {
  // Core state - simplified to only what's necessary
  const [showPanel, setShowPanel] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [analysisMode, setAnalysisMode] = useState("analysis");
  const { trackInteraction } = useTutorial();

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onToggleHighContrast: () => setHighContrastMode(prev => !prev),
    onToggleSidebar: () => setShowPanel(prev => !prev),
    onShowHelp: () => setShowKeyboardShortcuts(true),
  });

  // Track component interactions for the tutorial
  const handlePanelToggle = () => {
    trackInteraction('toggle-panel-btn');
    setShowPanel(prev => !prev);
  };

  const handleViewChange = (value: string) => {
    trackInteraction('view-switcher');
    setAnalysisMode(value);
  };

  const handleContrastToggle = () => {
    trackInteraction('radiograph-controls');
    setHighContrastMode(prev => !prev);
  };

  // When the component mounts, show any view-triggered tutorials
  useEffect(() => {
    // Wait for DOM to be fully loaded
    const timer = setTimeout(() => {
      trackInteraction('welcome');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Simplified header with core actions */}
      <header className="p-3 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary-700">CephaloScan</span>
          <Tabs 
            value={analysisMode} 
            onValueChange={handleViewChange} 
            className="ml-6"
            id="view-switcher"
          >
            <TabsList>
              <TabsTrigger value="digitization">Digitize</TabsTrigger>
              <TabsTrigger value="analysis">Analyze</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleContrastToggle}
            id="radiograph-controls"
          >
            <Eye className="h-4 w-4 mr-1" />
            <span className="text-sm">Contrast</span>
          </Button>
          
          {/* Replace the old help button with the TutorialButton */}
          <TutorialButton />
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setShowKeyboardShortcuts(true)}
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            <span className="text-sm">Shortcuts</span>
          </Button>
          
          <Button size="sm" variant="outline">
            <Save className="h-4 w-4 mr-1" />
            <span className="text-sm">Save</span>
          </Button>
          
          <Button 
            id="toggle-panel-btn"
            size="sm" 
            variant="ghost" 
            onClick={handlePanelToggle}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      {/* Patient info - simplified */}
      <PatientInfoBar />
      
      {/* Main content area - simplified layout */}
      <div className="flex-grow flex overflow-hidden">
        {/* Radiograph View - takes most of the space */}
        <div className="flex-grow bg-slate-50 relative">
          <RadiographViewer highContrastMode={highContrastMode} />
        </div>
        
        {/* Controls panel - conditionally rendered */}
        {showPanel && (
          <ControlsSidebar 
            showDrawerPanel={showPanel} 
            onToggleDrawerPanel={handlePanelToggle} 
          />
        )}
      </div>
      
      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />
    </div>
  );
};

export default CephalometricAnalysis;
