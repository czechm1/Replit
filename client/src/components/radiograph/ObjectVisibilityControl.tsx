import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LayerOpacityType } from "./types";

interface ObjectVisibilityProps {
  layerOpacity: LayerOpacityType;
  onLayerOpacityChange: (layer: keyof LayerOpacityType, value: number) => void;
  onClose: () => void;
  onReset: () => void;
  onlyInvalidMode?: boolean;
  onOnlyInvalidModeChange?: (enabled: boolean) => void;
}

const ObjectVisibilityControl: React.FC<ObjectVisibilityProps> = ({
  layerOpacity,
  onLayerOpacityChange,
  onClose,
  onReset,
  onlyInvalidMode = false,
  onOnlyInvalidModeChange
}) => {
  // Use local state that syncs with props, defaulting to false if not provided
  const [onlyInvalid, setOnlyInvalid] = useState(onlyInvalidMode);
  
  // Helper function to toggle layer visibility
  const toggleLayerVisibility = (layer: keyof LayerOpacityType, currentValue: number) => {
    if (currentValue > 0) {
      onLayerOpacityChange(layer, 0); // Hide
    } else {
      onLayerOpacityChange(layer, 100); // Show at full opacity
    }
  };
  
  // Handler for Only Invalid toggle
  const handleOnlyInvalidToggle = (checked: boolean) => {
    setOnlyInvalid(checked);
    // Call the parent handler if provided
    if (onOnlyInvalidModeChange) {
      onOnlyInvalidModeChange(checked);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 p-3 w-64">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-slate-800">Object Visibility</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-400 hover:text-slate-600 h-7 w-7 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <label className="text-sm text-slate-600 font-medium mr-2">Landmarks</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-6 w-6"
                  onClick={() => toggleLayerVisibility('landmarks', layerOpacity.landmarks)}
                >
                  {layerOpacity.landmarks > 0 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
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
              <div className="flex items-center">
                <label className="text-sm text-slate-600 font-medium mr-2">Tracing</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-6 w-6"
                  onClick={() => toggleLayerVisibility('tracing', layerOpacity.tracing)}
                >
                  {layerOpacity.tracing > 0 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
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
              <div className="flex items-center">
                <label className="text-sm text-slate-600 font-medium mr-2">Measurements</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-6 w-6"
                  onClick={() => toggleLayerVisibility('measurements', layerOpacity.measurements)}
                >
                  {layerOpacity.measurements > 0 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
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
          
          {/* Profile visibility (if available) */}
          {layerOpacity.profile !== undefined && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <label className="text-sm text-slate-600 font-medium mr-2">Profile</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-6 w-6"
                    onClick={() => toggleLayerVisibility('profile', layerOpacity.profile || 0)}
                  >
                    {(layerOpacity.profile || 0) > 0 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
                <span className="text-xs text-slate-500">{layerOpacity.profile || 0}%</span>
              </div>
              <Slider
                value={[layerOpacity.profile || 0]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => onLayerOpacityChange('profile', value[0])}
                className="w-full"
              />
            </div>
          )}
          
          {/* High-contrast "Only Invalid" toggle with improved visibility */}
          <div className="flex items-center justify-between mt-4 p-2 bg-red-50 border border-red-100 rounded-md">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <Label
                htmlFor="only-invalid"
                className="text-sm font-medium text-red-700 cursor-pointer"
              >
                Only Invalid
              </Label>
            </div>
            <Switch
              id="only-invalid"
              checked={onlyInvalid}
              onCheckedChange={handleOnlyInvalidToggle}
              className="data-[state=checked]:bg-red-500"
            />
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded transition-colors"
          onClick={onReset}
        >
          Reset All
        </Button>
      </div>
    </div>
  );
};

export default ObjectVisibilityControl;