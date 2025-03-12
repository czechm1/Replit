import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import AnalysisViewControls from "./AnalysisViewControls";
import ChartView from "./ChartView";
import ProfilogramView from "./ProfilogramView";
import LineAnalysisView from "./LineAnalysisView";
import { Badge } from "@/components/ui/badge";
import { Square } from "lucide-react";
import { useAnalysisView } from "@/hooks/useAnalysisView";

interface ControlsSidebarProps {
  showDrawerPanel: boolean;
  onToggleDrawerPanel: () => void;
}

const ControlsSidebar: React.FC<ControlsSidebarProps> = ({ 
  showDrawerPanel, 
  onToggleDrawerPanel 
}) => {
  const { analysisView, setAnalysisView } = useAnalysisView();

  return (
    <div className="bg-white border-l border-slate-200 w-80 lg:w-96 flex flex-col overflow-hidden">
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800">Cephalometric Analysis</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          onClick={onToggleDrawerPanel}
        >
          <Square className="h-5 w-5" />
          <span className="sr-only">Toggle panel</span>
        </Button>
      </div>
      
      <div className="px-4 py-3 border-b border-slate-200 flex flex-col">
        <p className="text-sm text-slate-600 mb-3">You can choose analysis among various preset cephalometric analysis.</p>
        
        {/* Analysis Dropdown */}
        <div className="flex space-x-2">
          <div className="flex-grow relative">
            <Select defaultValue="tweed">
              <SelectTrigger>
                <SelectValue placeholder="Select analysis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tweed">Tweed</SelectItem>
                <SelectItem value="steiner">Steiner</SelectItem>
                <SelectItem value="ricketts">Ricketts</SelectItem>
                <SelectItem value="downs">Downs</SelectItem>
                <SelectItem value="mcnamara">McNamara</SelectItem>
                <SelectItem value="jarabak">Jarabak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="secondary" 
            className="px-3 py-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium rounded-md transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span>Case Presentation</span>
            <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-white bg-opacity-20 rounded">BETA</Badge>
          </Button>
        </div>
      </div>
      
      {/* Analysis View Controls */}
      <AnalysisViewControls 
        analysisView={analysisView} 
        onViewChange={setAnalysisView} 
      />
      
      {/* Report Options */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-slate-800">Report</h3>
          <div className="flex items-center">
            <span className="text-sm text-slate-600 mr-3">Print Ceph</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
            <Badge variant="secondary" className="ml-1.5 px-1.5 py-0.5 text-xs font-medium bg-secondary-100 text-secondary-600 rounded-sm">PREMIUM</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Select defaultValue="simple">
            <SelectTrigger>
              <SelectValue placeholder="Report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple Report</SelectItem>
              <SelectItem value="detailed">Detailed Report</SelectItem>
              <SelectItem value="custom">Custom Report</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="full">
            <SelectTrigger>
              <SelectValue placeholder="Report format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Report</SelectItem>
              <SelectItem value="summary">Summary Report</SelectItem>
              <SelectItem value="comparison">Comparison Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="px-4 py-2 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 text-sm font-medium rounded-md transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            Save as Image
            <Badge variant="outline" className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-white bg-opacity-30 rounded">NEW</Badge>
          </Button>
          
          <Button 
            variant="outline" 
            className="px-4 py-2 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 text-sm font-medium rounded-md transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Export to Excel
            <Badge variant="outline" className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-white bg-opacity-30 rounded">NEW</Badge>
          </Button>
          
          <Button 
            variant="outline" 
            className="px-4 py-2 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 text-sm font-medium rounded-md transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
              <path d="M3 8a2 2 0 012-2h2.93a.5.5 0 01.5.5v5a.5.5 0 01-.5.5H5a2 2 0 01-2-2V8z" />
            </svg>
            Archive Analysis
            <Badge variant="outline" className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-white bg-opacity-30 rounded">NEW</Badge>
          </Button>
          
          <Button 
            variant="outline" 
            className="px-4 py-2 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 text-sm font-medium rounded-md transition-colors flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z" clipRule="evenodd" />
            </svg>
            Archive Chart
            <Badge variant="outline" className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-white bg-opacity-30 rounded">NEW</Badge>
          </Button>
        </div>
      </div>
      
      {/* Wizard */}
      <div className="px-4 py-3 border-b border-slate-200">
        <h3 className="font-medium text-slate-800 mb-3">Wizard</h3>
        <Select defaultValue="wizard">
          <SelectTrigger>
            <SelectValue placeholder="Select wizard" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wizard">Wizard</SelectItem>
            <SelectItem value="quick-compare">Quick Compare</SelectItem>
            <SelectItem value="multi-template">Multi-Template</SelectItem>
            <SelectItem value="treatment-prediction">Treatment Prediction</SelectItem>
            <SelectItem value="superimposition">Superimposition</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Analysis Results - Conditionally rendered based on view */}
      <div className="flex-grow overflow-y-auto scrollbar-hide">
        {analysisView === 'chart' && <ChartView />}
        {analysisView === 'profilogram' && <ProfilogramView />}
        {analysisView === 'line' && <LineAnalysisView />}
      </div>
    </div>
  );
};

export default ControlsSidebar;
