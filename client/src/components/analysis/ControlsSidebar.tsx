import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  FileBarChart, 
  Layers, 
  Zap, 
  Eye, 
  PanelRightClose,
  RotateCw, 
  Share2,
  StethoscopeIcon,
  AlertCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  FileText
} from "lucide-react";
import ChartView from "./ChartView";
import ProfilogramView from "./ProfilogramView";
import LineAnalysisView from "./LineAnalysisView";
import AnalysisTable from "./AnalysisTable";
import { useAnalysisView } from "@/hooks/useAnalysisView";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ControlsSidebarProps {
  showDrawerPanel: boolean;
  onToggleDrawerPanel: () => void;
}

// Radically reimagined Analysis Results Panel with AI insights integration
const ControlsSidebar: React.FC<ControlsSidebarProps> = ({ 
  showDrawerPanel, 
  onToggleDrawerPanel 
}) => {
  const { analysisView, setAnalysisView } = useAnalysisView();
  const [aiInsightsExpanded, setAiInsightsExpanded] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);
  const [analysisSelected, setAnalysisSelected] = useState("Ricketts");
  const [expanded, setExpanded] = useState(true);

  // Cycle through AI insights automatically to draw attention
  useEffect(() => {
    if (aiInsightsExpanded) return; // Don't cycle when expanded
    
    const interval = setInterval(() => {
      setActiveInsight(prev => (prev + 1) % aiInsights.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [aiInsightsExpanded]);
  
  // Essential analytics data with clinical significance
  const patientMetrics = [
    { 
      id: "sna", 
      name: "SNA Angle", 
      value: 82.3, 
      norm: "82° ± 2°",
      status: "normal",
      significance: "Normal maxillary position",
      landmark: ["sella", "nasion", "A point"],
      category: "skeletal"
    },
    { 
      id: "snb", 
      name: "SNB Angle", 
      value: 78.1, 
      norm: "80° ± 2°",
      status: "low",
      significance: "Slightly retruded mandible",
      landmark: ["sella", "nasion", "B point"],
      category: "skeletal"
    },
    { 
      id: "anb", 
      name: "ANB Differential", 
      value: 4.2, 
      norm: "2° ± 2°",
      status: "high",
      significance: "Class II skeletal pattern",
      landmark: ["A point", "nasion", "B point"],
      category: "skeletal"
    },
    { 
      id: "fma", 
      name: "FMA", 
      value: 25.7, 
      norm: "25° ± 3°",
      status: "normal",
      significance: "Average mandibular plane angle",
      landmark: ["frankfurt", "mandibular plane"],
      category: "growth"
    },
    { 
      id: "overjet", 
      name: "Overjet", 
      value: 5.2, 
      norm: "2.5mm ± 1.5mm",
      status: "high",
      significance: "Increased overjet - protrusion",
      landmark: ["upper incisor", "lower incisor"],
      category: "dental"
    }
  ];

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
      icon: <RotateCw className="h-5 w-5" />
    },
    {
      id: "dental_relationship",
      title: "Dental Compensation",
      description: "Increased overjet (5.2mm) with moderate dental compensation for skeletal discrepancy.",
      confidence: 95,
      severity: "moderate",
      icon: <AlertCircle className="h-5 w-5" />
    }
  ];

  // Get color coding for metric status
  const getStatusColor = (status: string) => {
    switch(status) {
      case "high": return "text-amber-500 bg-amber-50 border-amber-200";
      case "low": return "text-blue-500 bg-blue-50 border-blue-200";
      case "normal": return "text-emerald-500 bg-emerald-50 border-emerald-200";
      default: return "text-slate-500 bg-slate-50 border-slate-200";
    }
  };
  
  return (
    <motion.div 
      className="bg-white border-l border-slate-200 flex flex-col overflow-hidden shadow-md"
      initial={{ width: 350 }}
      animate={{ width: expanded ? 350 : 60 }}
      transition={{ duration: 0.3 }}
    >
      {/* Collapsed state */}
      {!expanded && (
        <div className="p-3 flex flex-col items-center space-y-5">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 rounded-full bg-slate-100"
            onClick={() => setExpanded(true)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="flex flex-col space-y-4">
            <Button 
              variant="ghost" 
              size="icon"
              className={`h-10 w-10 rounded-full ${analysisView === 'line' ? 'bg-primary-100 text-primary-600' : 'text-slate-400'}`}
              onClick={() => setAnalysisView('line')}
            >
              <Layers className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className={`h-10 w-10 rounded-full ${analysisView === 'profilogram' ? 'bg-primary-100 text-primary-600' : 'text-slate-400'}`}
              onClick={() => setAnalysisView('profilogram')}
            >
              <Share2 className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              className={`h-10 w-10 rounded-full ${analysisView === 'chart' ? 'bg-primary-100 text-primary-600' : 'text-slate-400'}`}
              onClick={() => setAnalysisView('chart')}
            >
              <FileBarChart className="h-5 w-5" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 mt-auto"
            onClick={() => {
              setExpanded(true);
              setAiInsightsExpanded(true);
            }}
          >
            <Brain className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Expanded state */}
      {expanded && (
        <>
          {/* Header with AI insights toggle */}
          <div className="p-3 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
              <h3 className="font-medium text-slate-800">Analysis Results</h3>
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant={aiInsightsExpanded ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-7 gap-1"
                onClick={() => setAiInsightsExpanded(!aiInsightsExpanded)}
              >
                <Brain className="h-3.5 w-3.5" />
                {aiInsightsExpanded ? "Hide AI" : "AI Insights"}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={() => setExpanded(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* AI Insights Panel - Spotlight feature */}
          {aiInsightsExpanded ? (
            <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100/30 border-b border-amber-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Brain className="h-4 w-4 text-amber-600 mr-1.5" />
                  <h4 className="text-sm font-medium text-amber-800">AI Clinical Insights</h4>
                </div>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 bg-white text-amber-600 border-amber-200">
                  {aiInsights[activeInsight].confidence}% confidence
                </Badge>
              </div>
              
              <div className="space-y-2">
                {aiInsights.map((insight, index) => (
                  <div 
                    key={insight.id}
                    className={`p-2 rounded-md border transition-all cursor-pointer ${index === activeInsight 
                      ? 'bg-white border-amber-200 shadow-sm' 
                      : 'bg-transparent border-transparent hover:bg-white/50'}`}
                    onClick={() => setActiveInsight(index)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${index === activeInsight ? 'bg-amber-100' : 'bg-slate-100'}`}>
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
              
              <Button variant="default" size="sm" className="w-full mt-3 gap-1.5 bg-amber-600 hover:bg-amber-700 text-xs">
                <Zap className="h-3.5 w-3.5" />
                Generate Treatment Recommendations
              </Button>
            </div>
          ) : (
            <div className="p-3 bg-gradient-to-r from-amber-50 to-white border-b border-amber-100">
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => setAiInsightsExpanded(true)}
              >
                <div className="p-1.5 rounded-full bg-amber-100 mr-2">
                  {aiInsights[activeInsight].icon}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-amber-800">{aiInsights[activeInsight].title}</div>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 bg-white/80 text-amber-600 border-amber-200">
                      AI Insight
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{aiInsights[activeInsight].description}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Analysis results view selector - Minimalist tabs */}
          <div className="flex border-b border-slate-200">
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setAnalysisView('line')}
              className={`flex-1 rounded-none py-2 border-b-2 transition-colors ${
                analysisView === 'line' 
                  ? 'border-primary-600 text-primary-700' 
                  : 'border-transparent text-slate-600 hover:border-slate-200'
              }`}
            >
              <Layers className="h-4 w-4 mr-1.5" />
              <span className="text-xs">Analysis</span>
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setAnalysisView('profilogram')}
              className={`flex-1 rounded-none py-2 border-b-2 transition-colors ${
                analysisView === 'profilogram' 
                  ? 'border-primary-600 text-primary-700' 
                  : 'border-transparent text-slate-600 hover:border-slate-200'
              }`}
            >
              <Share2 className="h-4 w-4 mr-1.5" />
              <span className="text-xs">Profile</span>
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setAnalysisView('chart')}
              className={`flex-1 rounded-none py-2 border-b-2 transition-colors ${
                analysisView === 'chart' 
                  ? 'border-primary-600 text-primary-700' 
                  : 'border-transparent text-slate-600 hover:border-slate-200'
              }`}
            >
              <FileBarChart className="h-4 w-4 mr-1.5" />
              <span className="text-xs">Norms</span>
            </Button>
          </div>
          
          {/* Main content - Analysis view */}
          <div className="flex-grow overflow-auto">
            {analysisView === 'line' && (
              <div className="p-3 space-y-4">
                {/* Analysis metrics with clinical significance */}
                <div className="flex justify-between items-center">
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
                  
                  <Button variant="outline" size="sm" className="h-7 text-xs p-1 gap-1">
                    <Eye className="h-3 w-3" />
                    <span>View All</span>
                  </Button>
                </div>
                
                <div className="space-y-1.5">
                  {patientMetrics.map((metric) => (
                    <motion.div 
                      key={metric.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-2 rounded-md border border-slate-100 hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-800">{metric.name}</span>
                        <div className="flex items-center gap-1.5">
                          <Badge 
                            className={`text-xs px-1.5 py-0.5 ${getStatusColor(metric.status)}`}
                          >
                            {metric.value}°
                          </Badge>
                          <span className="text-xs text-slate-500">{metric.norm}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{metric.significance}</p>
                      <div className="flex mt-1.5 gap-1">
                        {metric.landmark.map((mark, i) => (
                          <Badge 
                            key={i} 
                            variant="outline" 
                            className="text-[10px] px-1 py-0 bg-slate-50 border-slate-200"
                          >
                            {mark}
                          </Badge>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                    <Bookmark className="h-3 w-3" />
                    Save
                  </Button>
                  <Button variant="default" size="sm" className="h-7 text-xs">
                    Generate Report
                  </Button>
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
        </>
      )}
    </motion.div>
  );
};

export default ControlsSidebar;
