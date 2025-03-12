import React, { useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import PatientInfoBar from "@/components/layout/PatientInfoBar";
import WorkflowTabs from "@/components/layout/WorkflowTabs";
import RadiographViewer from "@/components/radiograph/RadiographViewer";
import ControlsSidebar from "@/components/analysis/ControlsSidebar";
import KeyboardShortcutsModal from "@/components/modals/KeyboardShortcutsModal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const CephalometricAnalysis: React.FC = () => {
  // State for UI controls
  const [activeTab, setActiveTab] = useState("analysis");
  const [workflowTab, setWorkflowTab] = useState("analysis");
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("analysis");
  const [showDrawerPanel, setShowDrawerPanel] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);

  // Setup keyboard shortcuts
  useKeyboardShortcuts({
    onToggleHighContrast: () => setHighContrastMode(prev => !prev),
    onToggleSidebar: () => setShowDrawerPanel(prev => !prev),
    onShowHelp: () => setShowKeyboardShortcuts(true),
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* App Header */}
      <AppHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onShowKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
        onToggleHighContrast={() => setHighContrastMode(prev => !prev)}
      />
      
      {/* Patient Info Bar */}
      <PatientInfoBar />
      
      {/* Main Content */}
      <div className="flex-grow flex overflow-hidden">
        {/* Workflow Tabs */}
        <WorkflowTabs 
          activeTab={workflowTab} 
          onTabChange={setWorkflowTab} 
        />
        
        {/* Content Area with Radiograph and Controls */}
        <div className="flex flex-col flex-grow bg-slate-50 overflow-hidden">
          {/* Content Tabs */}
          <div className="px-4 pt-3 pb-0 bg-white border-b border-slate-200">
            <Tabs defaultValue="analysis" value={activeAnalysisTab} onValueChange={setActiveAnalysisTab}>
              <TabsList className="border-b-0">
                <TabsTrigger value="digitization">Digitization</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="fx">FX</TabsTrigger>
                <TabsTrigger value="soft-tissue">Soft-Tissue</TabsTrigger>
                <TabsTrigger value="occlusogram">Occlusogram</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Main Content Area */}
          <div className="flex flex-grow overflow-hidden">
            {/* Radiograph View */}
            <RadiographViewer highContrastMode={highContrastMode} />
            
            {/* Controls Sidebar - conditionally rendered */}
            {showDrawerPanel && (
              <ControlsSidebar 
                showDrawerPanel={showDrawerPanel} 
                onToggleDrawerPanel={() => setShowDrawerPanel(prev => !prev)} 
              />
            )}
          </div>
        </div>
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
