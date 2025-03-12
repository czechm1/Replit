import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  BarChart3, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import ChartView from "./ChartView";
import ProfilogramView from "./ProfilogramView";
import LineAnalysisView from "./LineAnalysisView";
import { useAnalysisView } from "@/hooks/useAnalysisView";
import { motion } from "framer-motion";

interface ControlsSidebarProps {
  showDrawerPanel: boolean;
  onToggleDrawerPanel: () => void;
}

// Ultra-minimalist Analysis Panel
const ControlsSidebar: React.FC<ControlsSidebarProps> = ({ 
  showDrawerPanel, 
  onToggleDrawerPanel 
}) => {
  const { analysisView, setAnalysisView } = useAnalysisView();
  const [expanded, setExpanded] = useState(true);
  
  // Essential analytics data - only the most critical values
  const criticalFindings = [
    { 
      name: "ANB", 
      value: 4.2, 
      norm: "2° ± 2°",
      status: "high",
      inference: "Class II skeletal pattern"
    },
    { 
      name: "Overjet", 
      value: 5.2, 
      norm: "2.5mm ± 1.5mm",
      status: "high",
      inference: "Increased horizontal projection"
    }
  ];

  // Clinical summary for quick assessment
  const clinicalSummary = "Class II skeletal pattern with retrognathic mandible and compensated dentition";
  
  return (
    <motion.div 
      className="bg-white border-l border-slate-200 flex flex-col overflow-hidden shadow-md"
      initial={{ width: 300 }}
      animate={{ width: expanded ? 300 : 50 }}
      transition={{ duration: 0.2 }}
    >
      {/* Minimal toggle button */}
      <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-10">
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-6 w-6 rounded-full shadow-md p-0"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>
    
      {/* Ultra-compact minimized state */}
      {!expanded && (
        <div className="flex flex-col items-center py-4 gap-8">
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 rounded-full ${analysisView === 'line' ? 'bg-primary-100 text-primary-600' : 'text-slate-400'}`}
            onClick={() => setAnalysisView('line')}
          >
            <Layers className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 rounded-full ${analysisView === 'chart' ? 'bg-primary-100 text-primary-600' : 'text-slate-400'}`}
            onClick={() => setAnalysisView('chart')}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
        </div>
      )}
      
      {/* Simplified expanded state */}
      {expanded && (
        <>
          {/* Ultra-minimal header with critical findings */}
          <div className="p-2.5 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex items-center"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></div>
                <h3 className="text-xs font-medium text-slate-700 uppercase tracking-wide">Analysis</h3>
              </motion.div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" size="sm" className="h-5 text-[10px] bg-slate-50 border-slate-200 px-1.5">
                  Ricketts
                </Badge>
                <div className="text-xs font-mono text-slate-500">25y/M</div>
              </div>
            </div>
            
            {/* Clinical summary - one-line key insight */}
            <div className="bg-amber-50 border border-amber-100 rounded-md p-2 mb-1.5 flex items-start gap-1.5">
              <Brain className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                {clinicalSummary}
              </div>
            </div>
          </div>
          
          {/* Ultra-minimal tab switcher */}
          <div className="flex px-1 pt-2 border-b border-slate-200">
            {['line', 'chart', 'profilogram'].map((view) => (
              <Button 
                key={view}
                variant="ghost"
                size="sm"
                onClick={() => setAnalysisView(view)}
                className={`h-8 flex-1 rounded-none border-b-2 transition-colors ${
                  analysisView === view 
                    ? 'border-primary-600 text-primary-600' 
                    : 'border-transparent text-slate-400'
                }`}
              >
                {view === 'line' && <Layers className="h-4 w-4" />}
                {view === 'chart' && <BarChart3 className="h-4 w-4" />}
                {view === 'profilogram' && <ArrowRight className="h-4 w-4" />}
              </Button>
            ))}
          </div>
          
          {/* Content view */}
          <div className="flex-grow overflow-auto">
            {analysisView === 'line' && (
              <div className="p-2.5">
                {/* Priority findings only */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-medium text-slate-500">CRITICAL FINDINGS</div>
                  </div>
                  
                  <div className="space-y-1.5">
                    {criticalFindings.map((metric) => (
                      <div 
                        key={metric.name}
                        className="bg-slate-50 rounded p-2 border-l-2 border-amber-400"
                      >
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{metric.name}</span>
                          <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
                            {metric.value}°
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500 flex justify-between mt-0.5">
                          <span>Norm: {metric.norm}</span>
                          <span className="text-amber-700">{metric.inference}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Simplified analysis view */}
                <div className="mt-4">
                  <LineAnalysisView />
                </div>
              </div>
            )}
            
            {analysisView === 'chart' && <ChartView />}
            {analysisView === 'profilogram' && <ProfilogramView />}
          </div>
          
          {/* Minimal footer with action buttons */}
          <div className="p-2 border-t border-slate-100 flex justify-between">
            <span className="text-[10px] text-slate-400">Analyzed: Today</span>
            <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={onToggleDrawerPanel}>
              Close
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ControlsSidebar;
