import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ScrollText,
  FileBarChart,
  ArrowLeftRight,
  Zap,
  Printer,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  SlidersHorizontal,
  PanelRightClose
} from "lucide-react";
import ChartView from "./ChartView";
import ProfilogramView from "./ProfilogramView";
import LineAnalysisView from "./LineAnalysisView";
import { useAnalysisView } from "@/hooks/useAnalysisView";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

interface ControlsSidebarProps {
  showDrawerPanel: boolean;
  onToggleDrawerPanel: () => void;
}

// Completely rethought Analysis Results Panel with minimal controls
const ControlsSidebar: React.FC<ControlsSidebarProps> = ({ 
  showDrawerPanel, 
  onToggleDrawerPanel 
}) => {
  const { analysisView, setAnalysisView } = useAnalysisView();
  const [showSettings, setShowSettings] = useState(false);
  const [analysisType, setAnalysisType] = useState("Ricketts");
  
  // Essential analytics data
  const patientMetrics = {
    sna: 82.3,
    snb: 78.1,
    anb: 4.2,
    fma: 25.7,
    impa: 92.4,
    fmia: 62.0,
    ul_to_line: 3.4,
    ll_to_line: 2.1,
    interincisal: 126.8,
    overjet: 3.2,
    overbite: 2.4
  };

  const analyses = [
    { id: "ricketts", name: "Ricketts" },
    { id: "steiner", name: "Steiner" },
    { id: "downs", name: "Downs" },
    { id: "mcnamara", name: "McNamara" }
  ];

  // Get severity level for metrics
  const getSeverityClass = (value: number, min: number, max: number) => {
    if (value < min || value > max) {
      return value < min - 2 || value > max + 2 
        ? "text-red-600" 
        : "text-amber-600";
    }
    return "text-emerald-600";
  };

  // Calculate a value's position in the normal range (0-100%)
  const getNormalizedValue = (value: number, min: number, max: number) => {
    if (value < min) return 0;
    if (value > max) return 100;
    return ((value - min) / (max - min)) * 100;
  };
  
  return (
    <div className="bg-white border-l border-slate-200 w-[350px] flex flex-col overflow-hidden shadow-md">
      {/* Header - analysis name and view toggle */}
      <div className="p-3 flex justify-between items-center border-b border-slate-200">
        <div className="flex items-center">
          <h3 className="font-medium text-sm text-slate-800">{analysisType} Analysis</h3>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={() => setShowSettings(!showSettings)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={onToggleDrawerPanel}
          >
            <PanelRightClose className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      {/* View switcher with icons */}
      <div className="bg-slate-50 p-2 border-b border-slate-200">
        <div className="flex justify-between">
          <Button 
            variant={analysisView === 'line' ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setAnalysisView('line')}
            className="h-8 text-xs flex-1"
          >
            <ScrollText className="h-3.5 w-3.5 mr-1.5" />
            Measurements
          </Button>
          <Button 
            variant={analysisView === 'profilogram' ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setAnalysisView('profilogram')}
            className="h-8 text-xs flex-1"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 mr-1.5" />
            Profile
          </Button>
          <Button 
            variant={analysisView === 'chart' ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setAnalysisView('chart')}
            className="h-8 text-xs flex-1"
          >
            <FileBarChart className="h-3.5 w-3.5 mr-1.5" />
            Chart
          </Button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-grow overflow-auto">
        {/* Analysis views */}
        {analysisView === 'line' && (
          <div className="p-3">
            <div className="space-y-4">
              {/* Analysis metrics with visual indicators */}
              <div className="space-y-2.5">
                {Object.entries(patientMetrics).map(([key, value], index) => {
                  // Define normal ranges (simplified for demo)
                  const min = key === 'anb' ? 0 : key === 'overjet' ? 1 : 60;
                  const max = key === 'anb' ? 4 : key === 'overjet' ? 4 : 130;
                  const normalizedValue = getNormalizedValue(value, min, max);
                  const severityClass = getSeverityClass(value, min, max);
                  
                  return (
                    <div key={key} className="flex items-center">
                      <div className="w-24 text-xs text-slate-600 capitalize">{key.replace(/_/g, ' ')}</div>
                      <div className="flex-grow mx-2">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                          <div className="absolute inset-0 flex">
                            <div className="h-full bg-slate-200" style={{width: `${min/max*100}%`}}></div>
                            <div className="h-full bg-emerald-100" style={{width: `${(max-min)/max*100}%`}}></div>
                            <div className="h-full bg-slate-200" style={{width: `${(200-max)/max*100}%`}}></div>
                          </div>
                          <div 
                            className={`h-full w-1.5 bg-current absolute ${severityClass}`} 
                            style={{left: `calc(${normalizedValue}% - 0.75px)`}}
                          ></div>
                        </div>
                      </div>
                      <div className={`w-12 text-right text-xs font-mono ${severityClass}`}>{value.toFixed(1)}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className="py-1 px-2 bg-slate-50 rounded text-xs text-slate-500 italic">
                Values outside normal range are highlighted
              </div>
              
              {/* Quick actions */}
              <div className="flex justify-between pt-1">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  AI Analysis
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Printer className="h-3 w-3 mr-1" />
                  Print Report
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {analysisView === 'chart' && (
          <div className="p-0">
            <ChartView />
          </div>
        )}
        
        {analysisView === 'profilogram' && (
          <div className="p-0">
            <ProfilogramView />
          </div>
        )}
      </div>
      
      {/* Settings drawer - appears when settings button is clicked */}
      {showSettings && (
        <div className="absolute top-12 right-0 w-64 bg-white shadow-lg rounded-l-lg border border-slate-200 p-3 z-10">
          <div className="text-sm font-medium mb-2">Analysis Settings</div>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Analysis Type</label>
              <select 
                className="w-full p-1.5 border border-slate-200 rounded text-slate-800"
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
              >
                {analyses.map(analysis => (
                  <option key={analysis.id} value={analysis.name}>{analysis.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-slate-500 mb-1">Display Options</label>
              <div className="space-y-1">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1.5" defaultChecked />
                  <span>Show normal ranges</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1.5" defaultChecked />
                  <span>Highlight abnormal values</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1.5" defaultChecked />
                  <span>Include AI recommendations</span>
                </label>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => setShowSettings(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      
      {/* Pull tab - for collapsing/expanding */}
      <div className="absolute top-1/2 -left-5 transform -translate-y-1/2">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onToggleDrawerPanel}
          className="h-12 w-5 rounded-l-md rounded-r-none flex items-center justify-center shadow-md border border-r-0 border-slate-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ControlsSidebar;
