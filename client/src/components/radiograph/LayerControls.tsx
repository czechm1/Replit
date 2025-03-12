import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LayerControlsProps {
  layerOpacity: {
    tracing: number;
    landmarks: number;
    measurements: number;
  };
  imageControls: {
    brightness: number;
    contrast: number;
  };
  onLayerOpacityChange: (layer: string, value: number) => void;
  onImageControlChange: (control: string, value: number) => void;
  onClose: () => void;
  onResetAll: () => void;
}

const LayerControls: React.FC<LayerControlsProps> = ({
  layerOpacity,
  imageControls,
  onLayerOpacityChange,
  onImageControlChange,
  onClose,
  onResetAll
}) => {
  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 p-3 w-64">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-slate-800">Layer Controls</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-400 hover:text-slate-600"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-slate-600 font-medium">Tracing</label>
            <span className="text-xs text-slate-500">{layerOpacity.tracing}%</span>
          </div>
          <Slider
            value={[layerOpacity.tracing]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onLayerOpacityChange('tracing', value[0])}
            className="w-full"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-slate-600 font-medium">Landmarks</label>
            <span className="text-xs text-slate-500">{layerOpacity.landmarks}%</span>
          </div>
          <Slider
            value={[layerOpacity.landmarks]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onLayerOpacityChange('landmarks', value[0])}
            className="w-full"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-slate-600 font-medium">Measurements</label>
            <span className="text-xs text-slate-500">{layerOpacity.measurements}%</span>
          </div>
          <Slider
            value={[layerOpacity.measurements]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onLayerOpacityChange('measurements', value[0])}
            className="w-full"
          />
        </div>
        
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-slate-600 font-medium">Brightness</label>
            <div className="flex items-center">
              <span className="text-xs text-slate-500 mr-1">{imageControls.brightness}</span>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs text-primary-600 hover:text-primary-700 p-0 h-auto"
                onClick={() => onImageControlChange('brightness', 0)}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">-50</span>
            <Slider
              value={[imageControls.brightness]}
              min={-50}
              max={50}
              step={1}
              onValueChange={(value) => onImageControlChange('brightness', value[0])}
              className="flex-grow"
            />
            <span className="text-xs text-slate-400">+50</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-slate-600 font-medium">Contrast</label>
            <div className="flex items-center">
              <span className="text-xs text-slate-500 mr-1">{imageControls.contrast}</span>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs text-primary-600 hover:text-primary-700 p-0 h-auto"
                onClick={() => onImageControlChange('contrast', 0)}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">-50</span>
            <Slider
              value={[imageControls.contrast]}
              min={-50}
              max={50}
              step={1}
              onValueChange={(value) => onImageControlChange('contrast', value[0])}
              className="flex-grow"
            />
            <span className="text-xs text-slate-400">+50</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded transition-colors"
            onClick={onResetAll}
          >
            Reset All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 text-sm font-medium rounded transition-colors"
          >
            Save Preset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LayerControls;
