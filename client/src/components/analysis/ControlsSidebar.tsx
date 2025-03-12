import React, { useState } from "react";
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
import { 
  X, 
  Save, 
  BarChart3, 
  LayoutTemplate, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  Download
} from "lucide-react";
import { useAnalysisView } from "@/hooks/useAnalysisView";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ControlsSidebarProps {
  showDrawerPanel: boolean;
  onToggleDrawerPanel: () => void;
}

const ControlsSidebar: React.FC<ControlsSidebarProps> = ({ 
  showDrawerPanel, 
  onToggleDrawerPanel 
}) => {
  const { analysisView, setAnalysisView } = useAnalysisView();
  const [panelTab, setPanelTab] = useState("controls");

  return (
    <div className="bg-white border-l border-slate-200 w-72 flex flex-col overflow-hidden shadow-md">
      {/* Simplified header with tabs */}
      <div className="flex justify-between items-center border-b border-slate-200 bg-slate-50">
        <Tabs value={panelTab} onValueChange={setPanelTab} className="w-full">
          <TabsList className="w-full justify-start border-b-0 rounded-none gap-1 px-2 py-2">
            <TabsTrigger value="controls" className="text-xs py-1 px-2">
              <LayoutTemplate className="h-3.5 w-3.5 mr-1" />
              Controls
            </TabsTrigger>
            <TabsTrigger value="results" className="text-xs py-1 px-2">
              <BarChart3 className="h-3.5 w-3.5 mr-1" />
              Results
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-1 h-7 w-7 p-0"
          onClick={onToggleDrawerPanel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-grow overflow-auto">
        {panelTab === "controls" && (
          <div className="p-3 space-y-5">
            {/* Analysis Selection - simplified */}
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1.5">ANALYSIS TYPE</label>
              <Select defaultValue="ricketts">
                <SelectTrigger className="w-full h-8 text-sm">
                  <SelectValue placeholder="Select analysis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ricketts">Ricketts</SelectItem>
                  <SelectItem value="steiner">Steiner</SelectItem>
                  <SelectItem value="downs">Downs</SelectItem>
                  <SelectItem value="mcnamara">McNamara</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Analysis View Controls - simplified */}
            <AnalysisViewControls 
              analysisView={analysisView} 
              onViewChange={setAnalysisView} 
            />
            
            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-3">
              <Button variant="outline" size="sm" className="w-full flex-1 mr-2 h-8">
                <Save className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Save</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full flex-1 h-8">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Export</span>
              </Button>
            </div>
          </div>
        )}
        
        {panelTab === "results" && (
          <div className="p-3">
            <Card className="shadow-none border">
              <CardContent className="p-0 overflow-hidden">
                {analysisView === 'chart' && <ChartView />}
                {analysisView === 'profilogram' && <ProfilogramView />}
                {analysisView === 'line' && <LineAnalysisView />}
              </CardContent>
            </Card>
            
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Maximize2 className="h-3.5 w-3.5 mr-1.5" />
                Full View
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Collapse/expand button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="self-end flex justify-center items-center gap-1 px-3 py-1.5 m-2 text-xs border border-slate-200 rounded-full"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        <span>Collapse</span>
      </Button>
    </div>
  );
};

export default ControlsSidebar;
