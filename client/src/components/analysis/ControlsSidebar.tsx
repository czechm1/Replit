import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Sliders,
  StethoscopeIcon,
  Eye,
  ChevronRight,
  ChevronDown,
  PanelRight,
  PanelLeft,
  AlertCircle
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AnalysisTable from "./AnalysisTable";
import { Switch } from "@/components/ui/switch";
import { rickettsAnalysisData } from "@/data/analysisData";
import "@/styles/ResizableSidebar.css";

interface ControlsSidebarProps {
  showDrawerPanel: boolean;
  onToggleDrawerPanel: () => void;
}

const ControlsSidebar: React.FC<ControlsSidebarProps> = ({ 
  showDrawerPanel, 
  onToggleDrawerPanel 
}) => {
  const [analysisSelected, setAnalysisSelected] = useState("Ricketts");
  const [showOnlyInvalid, setShowOnlyInvalid] = useState(false);
  const [width, setWidth] = useState(350);
  const [isResizing, setIsResizing] = useState(false);
  const [aiInsightsCollapsed, setAiInsightsCollapsed] = useState(true); // Collapsed by default
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // Set up resize functionality
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const viewport = document.documentElement.clientWidth;
      // Moving from right to left, so subtract from viewport width
      const newWidth = Math.max(320, Math.min(600, viewport - e.clientX));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    const resizeHandle = resizeHandleRef.current;
    if (resizeHandle) {
      resizeHandle.addEventListener('mousedown', handleMouseDown);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // AI-generated clinical assessment
  const aiInsights = [
    {
      id: "skeletal_class",
      title: "Class II Skeletal Pattern",
      description: "Patient presents with a Class II skeletal relationship (ANB 4.2°) due to a slightly retruded mandible rather than maxillary protrusion.",
      confidence: 92,
      severity: "moderate",
      icon: <StethoscopeIcon className="h-5 w-5" />
    },
    {
      id: "growth_pattern",
      title: "Vertical Growth Pattern",
      description: "Normal vertical growth trend with balanced facial proportions indicated by FMA within normal range.",
      confidence: 88,
      severity: "low",
      icon: <Sliders className="h-5 w-5" />
    },
    {
      id: "dental_relationship",
      title: "Dental Compensation",
      description: "Increased overjet (5.2mm) with moderate dental compensation for skeletal discrepancy.",
      confidence: 95,
      severity: "moderate",
      icon: <Eye className="h-5 w-5" />
    }
  ];
  
  return (
    <div className="relative">
      {/* Pull tab - always visible regardless of panel state */}
      <div className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-20 ${showDrawerPanel ? 'hidden' : 'block'}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="default" 
                size="sm"
                onClick={onToggleDrawerPanel}
                className="h-28 w-8 rounded-l-md rounded-r-none bg-white shadow-lg text-slate-600 hover:bg-slate-50 border border-r-0 border-slate-200 flex flex-col justify-center items-center gap-2"
              >
                <PanelLeft className="h-4 w-4" />
                <div className="rotate-90 text-xs font-medium whitespace-nowrap">Open Panel</div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Show Analysis Panel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Main panel and close button - only visible when panel is shown */}
      <div 
        ref={sidebarRef}
        className={`resizable-panel bg-white border-l border-slate-200 flex flex-col overflow-hidden shadow-md transition-all duration-300 ease-in-out ${showDrawerPanel ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ width: `${width}px` }}
      >
        {/* Close Panel Button */}
        <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={onToggleDrawerPanel}
                  className="h-8 w-8 rounded-l-md rounded-r-none border-r-0 border-slate-200 bg-white shadow-md text-slate-600"
                >
                  <PanelRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Hide Panel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {/* Resize handle */}
        <div 
          ref={resizeHandleRef}
          className={`resize-handle ${isResizing ? 'active' : ''}`}
        ></div>
        
        {/* Header */}
        <div className="p-3 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
            <h3 className="font-medium text-slate-800">Analysis Results</h3>
          </div>
        </div>
        
        {/* AI Assessment Panel - Collapsible */}
        <div 
          className="border-b border-slate-200 cursor-pointer transition-colors hover:bg-slate-50"
          onClick={() => setAiInsightsCollapsed(!aiInsightsCollapsed)}
        >
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-4 w-4 text-amber-600 mr-2" />
              <h4 className="text-sm font-medium text-amber-800">AI Clinical Assessment</h4>
            </div>
            <div>
              {aiInsightsCollapsed ? (
                <ChevronRight className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </div>
          </div>
        </div>
        
        {/* AI Assessment Content */}
        {!aiInsightsCollapsed && (
          <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200">
            <div className="space-y-2">
              {aiInsights.map((insight, index) => (
                <div 
                  key={insight.id}
                  className="p-2 rounded-md border bg-white border-amber-200 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-amber-100">
                      {insight.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{insight.title}</div>
                      <p className="text-xs text-slate-600 mt-0.5">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Analysis controls */}
        <div className="p-3 border-b border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <select 
              className="text-xs p-1 border border-slate-200 rounded bg-slate-50"
              value={analysisSelected}
              onChange={(e) => setAnalysisSelected(e.target.value)}
            >
              <option value="Ricketts">Ricketts Analysis</option>
              <option value="Steiner">Steiner Analysis</option>
              <option value="McNamara">McNamara Analysis</option>
              <option value="Downs">Downs Analysis</option>
            </select>
            
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-100 rounded-md">
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span className="text-xs font-medium text-red-700">Only Invalid</span>
              </div>
              <Switch 
                checked={showOnlyInvalid}
                onCheckedChange={setShowOnlyInvalid}
                className="h-4 w-8 data-[state=checked]:bg-red-500"
              />
            </div>
          </div>
        </div>
        
        {/* Analysis Table */}
        <div className="flex-grow overflow-auto">
          <div className="p-3 pb-6 space-y-4">
            <AnalysisTable 
              measurements={showOnlyInvalid 
                ? rickettsAnalysisData.filter(m => !m.inRange)
                : rickettsAnalysisData
              } 
              analysisName={analysisSelected}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsSidebar;
