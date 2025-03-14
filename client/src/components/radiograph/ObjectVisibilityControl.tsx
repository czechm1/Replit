import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
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
  const [showLandmarkFilters, setShowLandmarkFilters] = useState(false);
  
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

          {/* Landmark Filtering Section */}
          {layerOpacity.landmarks > 0 && (
            <>
              <div className="pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex justify-between items-center px-2 py-1 h-8 text-sm text-slate-600"
                  onClick={() => setShowLandmarkFilters(!showLandmarkFilters)}
                >
                  <span>Filter Landmark Types</span>
                  {showLandmarkFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              
              {showLandmarkFilters && (
                <div className="pl-4 pr-2 py-2 bg-slate-50 rounded-md border border-slate-100">
                  <div className="text-xs text-slate-500 mb-2">Show landmarks by type:</div>
                  <div className="flex flex-wrap gap-2">
                    {/* All Landmarks */}
                    <Badge 
                      variant={isGroupSelected('all') ? "default" : "outline"} 
                      className={`cursor-pointer ${isGroupSelected('all') ? 'bg-gray-800 hover:bg-gray-900 text-yellow-300' : 'hover:bg-slate-100'}`}
                      onClick={() => onToggleLandmarkGroup('all')}
                    >
                      {isGroupSelected('all') && <CheckIcon className="h-3 w-3 mr-1" />}
                      All
                    </Badge>
                    
                    {/* Skeletal Landmarks */}
                    <Badge 
                      variant={isGroupSelected('skeletal') ? "default" : "outline"} 
                      className={`cursor-pointer ${isGroupSelected('skeletal') ? 'bg-red-600 hover:bg-red-700 text-white' : 'hover:bg-slate-100 text-red-600 border-red-600'}`}
                      onClick={() => onToggleLandmarkGroup('skeletal')}
                    >
                      {isGroupSelected('skeletal') && <CheckIcon className="h-3 w-3 mr-1" />}
                      Skeletal
                    </Badge>
                    
                    {/* Dental Landmarks */}
                    <Badge 
                      variant={isGroupSelected('dental') ? "default" : "outline"} 
                      className={`cursor-pointer ${isGroupSelected('dental') ? 'bg-red-500 hover:bg-red-600 text-white' : 'hover:bg-slate-100 text-red-500 border-red-500'}`}
                      onClick={() => onToggleLandmarkGroup('dental')}
                    >
                      {isGroupSelected('dental') && <CheckIcon className="h-3 w-3 mr-1" />}
                      Dental
                    </Badge>
                    
                    {/* Soft Tissue Landmarks */}
                    <Badge 
                      variant={isGroupSelected('softTissue') ? "default" : "outline"} 
                      className={`cursor-pointer ${isGroupSelected('softTissue') ? 'bg-red-400 hover:bg-red-500 text-white' : 'hover:bg-slate-100 text-red-400 border-red-400'}`}
                      onClick={() => onToggleLandmarkGroup('softTissue')}
                    >
                      {isGroupSelected('softTissue') && <CheckIcon className="h-3 w-3 mr-1" />}
                      Soft Tissue
                    </Badge>
                    
                    {/* Outline Landmarks */}
                    <Badge 
                      variant={isGroupSelected('outlines') ? "default" : "outline"} 
                      className={`cursor-pointer ${isGroupSelected('outlines') ? 'bg-red-700 hover:bg-red-800 text-white' : 'hover:bg-slate-100 text-red-700 border-red-700'}`}
                      onClick={() => onToggleLandmarkGroup('outlines')}
                    >
                      {isGroupSelected('outlines') && <CheckIcon className="h-3 w-3 mr-1" />}
                      Outlines
                    </Badge>
                  </div>
                </div>
              )}
            </>
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