import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { LayerOpacityType } from "./types";
import { LandmarkGroupKey } from "./utils/landmarkGroups";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";

interface ObjectVisibilityProps {
  layerOpacity: LayerOpacityType;
  onLayerOpacityChange: (layer: keyof LayerOpacityType, value: number) => void;
  onClose: () => void;
  onReset: () => void;
  // Props for landmark filtering
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
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 p-3 w-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-slate-800">Landmark Filters</h3>
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
      
      <div className="space-y-3">
        {/* Landmark Filtering Section - single line */}
        <div className="flex flex-wrap gap-2 items-center">
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

          <Button 
            variant="outline" 
            size="sm" 
            className="px-2 py-1 ml-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors h-6"
            onClick={onReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ObjectVisibilityControl;