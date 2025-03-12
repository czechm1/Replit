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
import { ChevronUp, ChevronDown, Plus, Minus, RotateCw, RotateCcw } from "lucide-react";

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
    <div className="px-4 py-3 border-b border-slate-200">
      <div className="mb-3">
        <h3 className="font-medium text-slate-800 mb-2">View Mode</h3>
        <div className="flex items-center mb-3">
          <span className="text-sm text-slate-600 mr-3">Align to FH plane</span>
          <Switch 
            id="align-fh" 
            checked={alignToFH} 
            onCheckedChange={setAlignToFH} 
          />
        </div>
        
        <div className="flex text-sm font-medium">
          <Button
            variant="ghost"
            onClick={() => onViewChange('line')}
            className={`flex-1 px-4 py-2 border transition-colors rounded-l-md ${
              analysisView === 'line' 
                ? 'bg-primary-100 text-primary-700 border-primary-300' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Line analysis
          </Button>
          <Button
            variant="ghost"
            onClick={() => onViewChange('profilogram')}
            className={`flex-1 px-4 py-2 border-t border-b border-r transition-colors ${
              analysisView === 'profilogram' 
                ? 'bg-primary-100 text-primary-700 border-primary-300' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Profilogram
          </Button>
          <Button
            variant="ghost"
            onClick={() => onViewChange('chart')}
            className={`flex-1 px-4 py-2 border transition-colors rounded-r-md ${
              analysisView === 'chart' 
                ? 'bg-primary-100 text-primary-700 border-primary-300' 
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Chart
          </Button>
        </div>
      </div>
      
      {/* Line Analysis or Profilogram Options */}
      {(analysisView === 'line' || analysisView === 'profilogram') && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="cephalography" className="text-sm text-slate-600 font-medium">
              Cephalography
            </Label>
            <Switch 
              id="cephalography" 
              checked={showCephalography} 
              onCheckedChange={setShowCephalography} 
            />
          </div>
          
          {analysisView === 'profilogram' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Label className="text-sm text-slate-600 font-medium">Origin</Label>
                </div>
                <RadioGroup 
                  defaultValue="sella" 
                  className="flex items-center space-x-2"
                  value={selectedOrigin}
                  onValueChange={setSelectedOrigin}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sella" id="origin-sella" />
                    <Label htmlFor="origin-sella" className="text-sm text-slate-600">Sella</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nasion" id="origin-nasion" />
                    <Label htmlFor="origin-nasion" className="text-sm text-slate-600">Nasion</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Label className="text-sm text-slate-600 font-medium">Plane</Label>
                </div>
                <RadioGroup 
                  defaultValue="sn" 
                  className="flex items-center space-x-2"
                  value={selectedPlane}
                  onValueChange={setSelectedPlane}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sn" id="plane-sn" />
                    <Label htmlFor="plane-sn" className="text-sm text-slate-600">SN</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fh" id="plane-fh" />
                    <Label htmlFor="plane-fh" className="text-sm text-slate-600">FH</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="block text-sm text-slate-600 font-medium mb-1">Template Size</Label>
                <div className="flex items-center space-x-3">
                  <Slider
                    value={[templateSize]}
                    onValueChange={(value) => setTemplateSize(value[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-grow"
                  />
                  <div className="flex space-x-1">
                    <Button variant="outline" size="icon" className="p-1.5 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <div className="p-1.5 rounded-full bg-slate-100 text-slate-700 text-sm">
                      MOVE
                    </div>
                    <Button variant="outline" size="icon" className="p-1.5 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100">
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 flex">
                  <div className="flex-grow"></div>
                  <div className="flex items-center space-x-1">
                    <Button variant="outline" size="icon" className="p-1.5 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100">
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <div className="p-1.5 rounded-full bg-slate-100 text-slate-700 text-sm">
                      ROTATE
                    </div>
                    <Button variant="outline" size="icon" className="p-1.5 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="default" 
                className="w-full mt-2 px-4 py-2 bg-secondary-100 text-secondary-700 hover:bg-secondary-200 text-sm font-medium rounded-md transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Save Template
              </Button>
            </div>
          )}
          
          {analysisView === 'line' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="tracing-line" className="text-sm text-slate-600 font-medium">Tracing Line</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="tracing-line" 
                    checked={tracingLine} 
                    onCheckedChange={setTracingLine} 
                  />
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                    <div className="text-sm text-slate-600">Color</div>
                    <Badge variant="feature" className="px-1.5 py-0.5 text-xs font-medium rounded-sm">NEW</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Label htmlFor="analysis-line" className="text-sm text-slate-600 font-medium">Analysis Line</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="analysis-line" 
                    checked={analysisLine} 
                    onCheckedChange={setAnalysisLine} 
                  />
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                    <div className="text-sm text-slate-600">Color</div>
                    <Badge variant="feature" className="px-1.5 py-0.5 text-xs font-medium rounded-sm">NEW</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Label htmlFor="measurements" className="text-sm text-slate-600 font-medium">Measurements</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="measurements" 
                    checked={measurements} 
                    onCheckedChange={setMeasurements} 
                  />
                  <div className="flex items-center space-x-1">
                    <div className="w-5 h-5 rounded-full bg-secondary-500 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                    <div className="text-sm text-slate-600">Color</div>
                    <Badge variant="feature" className="px-1.5 py-0.5 text-xs font-medium rounded-sm">NEW</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Chart View Options */}
      {analysisView === 'chart' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">SELECT</Button>
              <Button variant="outline" className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded transition-colors">RECORD</Button>
              <Badge variant="feature" className="px-1.5 py-0.5 text-xs font-medium rounded-sm self-center">NEW</Badge>
            </div>
            <Button variant="ghost" size="sm" className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-md">
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
