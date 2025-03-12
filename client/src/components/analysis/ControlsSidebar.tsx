import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  FileText,
  Sliders,
  StethoscopeIcon,
  Eye,
  Save,
  Filter
} from "lucide-react";
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
  const [aiInsightsCollapsed, setAiInsightsCollapsed] = useState(false);
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

  // AI-generated clinical insights
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

  // Count invalid measurements
  const invalidCount = rickettsAnalysisData.filter(m => !m.inRange).length;
  
  return (
    <div 
      ref={sidebarRef}
      className="resizable-panel bg-white border-l border-slate-200 flex flex-col overflow-hidden shadow-md"
      style={{ width: `${width}px` }}
    >
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
        
        <div className="flex items-center gap-1">
          <Button 
            variant={aiInsightsCollapsed ? "ghost" : "secondary"}
            size="sm"
            className="text-xs h-7 gap-1"
            onClick={() => setAiInsightsCollapsed(!aiInsightsCollapsed)}
          >
            <Brain className="h-3.5 w-3.5" />
            {aiInsightsCollapsed ? "Show AI" : "Hide AI"}
          </Button>
        </div>
      </div>
      
      {/* AI Insights Panel - Collapsible */}
      {!aiInsightsCollapsed && (
        <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Brain className="h-4 w-4 text-amber-600 mr-1.5" />
              <h4 className="text-sm font-medium text-amber-800">AI Clinical Insights</h4>
            </div>
          </div>
          
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
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Only Invalid</span>
            <Switch 
              checked={showOnlyInvalid}
              onCheckedChange={setShowOnlyInvalid}
              className="h-4 w-8 data-[state=checked]:bg-primary-600"
            />
            <Badge variant="outline" className="ml-1 text-xs bg-amber-50 text-amber-700">
              {invalidCount} Issues
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Analysis Table */}
      <div className="flex-grow overflow-auto">
        <div className="p-3 space-y-4">
          <AnalysisTable 
            measurements={showOnlyInvalid 
              ? rickettsAnalysisData.filter(m => !m.inRange)
              : rickettsAnalysisData
            } 
            analysisName={analysisSelected}
          />
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              <Save className="h-3 w-3" />
              Save
            </Button>
            <Button variant="default" size="sm" className="h-7 text-xs gap-1">
              <FileText className="h-3.5 w-3.5 mr-1" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsSidebar;
