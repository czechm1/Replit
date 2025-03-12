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
import { 
  ChevronLeft, 
  FileImage, 
  FileSpreadsheet, 
  Save, 
  BarChart3, 
  FileText 
} from "lucide-react";
import { useAnalysisView } from "@/hooks/useAnalysisView";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
      <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="font-semibold text-slate-800">Analysis Controls</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-400 hover:text-slate-600"
          onClick={onToggleDrawerPanel}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Toggle panel</span>
        </Button>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          {/* Analysis Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-600">ANALYSIS TYPE</h3>
            <Select defaultValue="tweed">
              <SelectTrigger className="w-full">
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
            
            <Button 
              variant="secondary" 
              className="w-full mt-2"
            >
              <FileText className="h-4 w-4 mr-2" />
              Case Presentation
              <Badge variant="outline" className="ml-2 px-1.5 py-0.5 text-xs bg-white/20 rounded">BETA</Badge>
            </Button>
          </div>
          
          <Separator />
          
          {/* Analysis View Controls */}
          <AnalysisViewControls 
            analysisView={analysisView} 
            onViewChange={setAnalysisView} 
          />
          
          <Separator />
          
          {/* Report Options */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-slate-600">REPORT OPTIONS</h3>
              <div className="flex items-center gap-2">
                <Label htmlFor="print-ceph" className="text-xs text-slate-500">Print Ceph</Label>
                <Switch id="print-ceph" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
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
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Report</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="comparison">Comparison</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" className="flex gap-2 justify-center">
                <FileImage className="h-3.5 w-3.5" />
                <span>Save as Image</span>
              </Button>
              
              <Button variant="outline" size="sm" className="flex gap-2 justify-center">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Export to Excel</span>
              </Button>
              
              <Button variant="outline" size="sm" className="flex gap-2 justify-center">
                <Save className="h-3.5 w-3.5" />
                <span>Save Analysis</span>
              </Button>
              
              <Button variant="outline" size="sm" className="flex gap-2 justify-center">
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Generate Chart</span>
              </Button>
            </div>
          </div>
          
          <Separator />
          
          {/* Wizard */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-slate-600">ANALYSIS WIZARD</h3>
            <Select defaultValue="wizard">
              <SelectTrigger>
                <SelectValue placeholder="Select wizard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wizard">Quick Analysis</SelectItem>
                <SelectItem value="quick-compare">Comparative Analysis</SelectItem>
                <SelectItem value="multi-template">Multi-Template Analysis</SelectItem>
                <SelectItem value="treatment-prediction">Treatment Prediction</SelectItem>
                <SelectItem value="superimposition">Superimposition</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          {/* Analysis Results - Conditionally rendered based on view */}
          <div className="pt-2">
            <Card>
              <CardContent className="p-0">
                {analysisView === 'chart' && <ChartView />}
                {analysisView === 'profilogram' && <ProfilogramView />}
                {analysisView === 'line' && <LineAnalysisView />}
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ControlsSidebar;
