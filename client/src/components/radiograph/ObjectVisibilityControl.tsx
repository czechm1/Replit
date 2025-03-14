import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Eye, EyeOff } from "lucide-react";
import { LayerOpacityType } from "./types";
import { LandmarkGroupKey } from "./utils/landmarkGroups";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";

interface ObjectVisibilityProps {
  layerOpacity: LayerOpacityType;
  onLayerOpacityChange: (layer: keyof LayerOpacityType, value: number) => void;
  onClose: () => void;
  onReset: () => void;
  // New props for landmark filtering
  visibleLandmarkGroups: LandmarkGroupKey[];
  onToggleLandmarkGroup: (group: LandmarkGroupKey) => void;
}

const ObjectVisibilityControl: React.FC<ObjectVisibilityProps> = ({
  layerOpacity,
  onLayerOpacityChange,
  onClose,
  onReset,
  visibleLandmarkGroups,
  onToggleLandmarkGroup
}) => {
  // Helper function to toggle layer visibility
  const toggleLayerVisibility = (layer: keyof LayerOpacityType, currentValue: number) => {
    if (currentValue > 0) {
      onLayerOpacityChange(layer, 0); // Hide
    } else {
      onLayerOpacityChange(layer, 100); // Show at full opacity
    }
  };

  // Check if landmark group is selected
  const isGroupSelected = (group: LandmarkGroupKey): boolean => {
    return visibleLandmarkGroups.includes(group);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 p-3 w-72">
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
          {/* Landmarks Section - No Slider, Only Toggle and Filter */}
          <div>
            <div className="flex justify-between items-center">
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
            </div>
          </div>

          {/* Landmark Filtering Section - Always visible in one line */}
          {layerOpacity.landmarks > 0 && (
            <div className="flex flex-row gap-1 flex-wrap mb-1">
              {/* Skeletal Landmarks */}
              <Badge 
                variant={isGroupSelected('skeletal') ? "default" : "outline"} 
                className={`cursor-pointer ${isGroupSelected('skeletal') ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-slate-100 text-blue-600 border-blue-600'}`}
                onClick={() => onToggleLandmarkGroup('skeletal')}
              >
                {isGroupSelected('skeletal') && <CheckIcon className="h-3 w-3 mr-1" />}
                Skeletal
              </Badge>
              
              {/* Dental Landmarks */}
              <Badge 
                variant={isGroupSelected('dental') ? "default" : "outline"} 
                className={`cursor-pointer ${isGroupSelected('dental') ? 'bg-green-600 hover:bg-green-700 text-white' : 'hover:bg-slate-100 text-green-600 border-green-600'}`}
                onClick={() => onToggleLandmarkGroup('dental')}
              >
                {isGroupSelected('dental') && <CheckIcon className="h-3 w-3 mr-1" />}
                Dental
              </Badge>
              
              {/* Soft Tissue Landmarks */}
              <Badge 
                variant={isGroupSelected('softTissue') ? "default" : "outline"} 
                className={`cursor-pointer ${isGroupSelected('softTissue') ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'hover:bg-slate-100 text-amber-500 border-amber-500'}`}
                onClick={() => onToggleLandmarkGroup('softTissue')}
              >
                {isGroupSelected('softTissue') && <CheckIcon className="h-3 w-3 mr-1" />}
                Soft
              </Badge>
              
              {/* Outline Landmarks */}
              <Badge 
                variant={isGroupSelected('outlines') ? "default" : "outline"} 
                className={`cursor-pointer ${isGroupSelected('outlines') ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'hover:bg-slate-100 text-purple-600 border-purple-600'}`}
                onClick={() => onToggleLandmarkGroup('outlines')}
              >
                {isGroupSelected('outlines') && <CheckIcon className="h-3 w-3 mr-1" />}
                Outlines
              </Badge>
            </div>
          )}
          
          <Separator className="my-1" />
          
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
          
          {/* Analysis line visibility */}
          {layerOpacity.analysisLine !== undefined && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <label className="text-sm text-slate-600 font-medium mr-2">Analysis Line</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-6 w-6"
                    onClick={() => toggleLayerVisibility('analysisLine', layerOpacity.analysisLine || 0)}
                  >
                    {(layerOpacity.analysisLine || 0) > 0 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
                <span className="text-xs text-slate-500">{layerOpacity.analysisLine || 0}%</span>
              </div>
              <Slider
                value={[layerOpacity.analysisLine || 0]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => onLayerOpacityChange('analysisLine', value[0])}
                className="w-full"
              />
            </div>
          )}

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