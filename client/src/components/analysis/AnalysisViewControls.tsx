import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { 
  Plus, 
  Minus, 
  RotateCw, 
  RotateCcw, 
  AlignVerticalJustifyCenter,
  BarChart3,
  LineChart, 
  Activity,
  MoreVertical,
  Save,
  Circle
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisViewControlsProps {
  analysisView: string;
  onViewChange: (view: string) => void;
}

const AnalysisViewControls: React.FC<AnalysisViewControlsProps> = ({ 
  analysisView, 
  onViewChange 
}) => {
  const [alignToFH, setAlignToFH] = useState(false);
  const [showCephalography, setShowCephalography] = useState(true);
  const [selectedOrigin, setSelectedOrigin] = useState("sella");
  const [selectedPlane, setSelectedPlane] = useState("sn");
  const [templateSize, setTemplateSize] = useState(50);
  const [tracingLine, setTracingLine] = useState(true);
  const [analysisLine, setAnalysisLine] = useState(true);
  const [measurements, setMeasurements] = useState(true);
  const [selectedDate, setSelectedDate] = useState("2025-01-30");

  return (
    <div className="space-y-3" data-tutorial="analysis_view">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-600">VIEW MODE</h3>
        
        <div className="flex items-center gap-3 mb-2">
          <AlignVerticalJustifyCenter className="h-4 w-4 text-slate-500" />
          <Label htmlFor="align-fh" className="text-sm text-slate-600 cursor-pointer flex-grow">
            Align to FH plane
          </Label>
          <Switch 
            id="align-fh" 
            checked={alignToFH} 
            onCheckedChange={setAlignToFH} 
          />
        </div>
        
        <Tabs defaultValue={analysisView} onValueChange={onViewChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-2">
            <TabsTrigger value="line" className="text-xs">
              <LineChart className="h-3.5 w-3.5 mr-1" />
              Line Analysis
            </TabsTrigger>
            <TabsTrigger value="profilogram" className="text-xs">
              <Activity className="h-3.5 w-3.5 mr-1" />
              Profilogram
            </TabsTrigger>
            <TabsTrigger value="chart" className="text-xs">
              <BarChart3 className="h-3.5 w-3.5 mr-1" />
              Chart
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Line Analysis or Profilogram Options */}
      {(analysisView === 'line' || analysisView === 'profilogram') && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="cephalography" className="text-sm text-slate-600">
              Cephalography
            </Label>
            <Switch 
              id="cephalography" 
              checked={showCephalography} 
              onCheckedChange={setShowCephalography} 
            />
          </div>
          
          {analysisView === 'profilogram' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-sm text-slate-600">Origin</Label>
                <RadioGroup 
                  defaultValue="sella" 
                  className="flex items-center space-x-2"
                  value={selectedOrigin}
                  onValueChange={setSelectedOrigin}
                  orientation="horizontal"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="sella" id="origin-sella" />
                    <Label htmlFor="origin-sella" className="text-xs text-slate-600">Sella</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="nasion" id="origin-nasion" />
                    <Label htmlFor="origin-nasion" className="text-xs text-slate-600">Nasion</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex justify-between items-center">
                <Label className="text-sm text-slate-600">Plane</Label>
                <RadioGroup 
                  defaultValue="sn" 
                  className="flex items-center space-x-2"
                  value={selectedPlane}
                  onValueChange={setSelectedPlane}
                  orientation="horizontal"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="sn" id="plane-sn" />
                    <Label htmlFor="plane-sn" className="text-xs text-slate-600">SN</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="fh" id="plane-fh" />
                    <Label htmlFor="plane-fh" className="text-xs text-slate-600">FH</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm text-slate-600">Template Size</Label>
                  <span className="text-xs text-slate-500">{templateSize}%</span>
                </div>
                <Slider
                  value={[templateSize]}
                  onValueChange={(value) => setTemplateSize(value[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="my-1"
                />
                <div className="flex justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-slate-100 rounded-full px-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-slate-500">
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-medium text-slate-700">MOVE</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-slate-500">
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 rounded-full px-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-slate-500">
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-medium text-slate-700">ROTATE</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-slate-500">
                      <RotateCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="secondary" 
                size="sm"
                className="w-full mt-2 flex items-center justify-center"
              >
                <Save className="h-3.5 w-3.5 mr-2" />
                Save Template
              </Button>
            </div>
          )}
          
          {analysisView === 'line' && (
            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="tracing-line" className="text-sm text-slate-600">Tracing Line</Label>
                <div className="flex items-center gap-2">
                  <Switch 
                    id="tracing-line" 
                    checked={tracingLine} 
                    onCheckedChange={setTracingLine} 
                  />
                  <Badge className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-2">
                    <Circle className="h-3 w-3 fill-primary-500 text-primary-500" />
                    <span className="text-xs">Color</span>
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Label htmlFor="analysis-line" className="text-sm text-slate-600">Analysis Line</Label>
                <div className="flex items-center gap-2">
                  <Switch 
                    id="analysis-line" 
                    checked={analysisLine} 
                    onCheckedChange={setAnalysisLine} 
                  />
                  <Badge className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-2">
                    <Circle className="h-3 w-3 fill-accent-500 text-accent-500" />
                    <span className="text-xs">Color</span>
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Label htmlFor="measurements" className="text-sm text-slate-600">Measurements</Label>
                <div className="flex items-center gap-2">
                  <Switch 
                    id="measurements" 
                    checked={measurements} 
                    onCheckedChange={setMeasurements} 
                  />
                  <Badge className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer px-2">
                    <Circle className="h-3 w-3 fill-secondary-500 text-secondary-500" />
                    <span className="text-xs">Color</span>
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Chart View Options */}
      {analysisView === 'chart' && (
        <div className="space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs font-medium bg-primary-50 text-primary-600 border-primary-200">
                SELECT
              </Button>
              <Button variant="outline" size="sm" className="text-xs font-medium bg-slate-50 text-slate-600 border-slate-200">
                RECORD
              </Button>
              <Badge variant="outline" className="self-center text-xs bg-secondary-50 text-secondary-600 border-secondary-200">
                NEW
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-slate-50 p-2 rounded-md">
            <RadioGroup 
              defaultValue="2025-01-30" 
              value={selectedDate}
              onValueChange={setSelectedDate}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2025-01-30" id="date-1" />
                <Label htmlFor="date-1" className="text-sm text-slate-600">2025-01-30</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisViewControls;
