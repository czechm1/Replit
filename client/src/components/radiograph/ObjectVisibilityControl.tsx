import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, Eye, EyeOff, ChevronDown, ChevronUp, List } from "lucide-react";
import { LayerOpacityType } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

interface ObjectVisibilityProps {
  layerOpacity: LayerOpacityType;
  onLayerOpacityChange: (layer: keyof LayerOpacityType, value: number) => void;
  onClose: () => void;
  onReset: () => void;
  visibleMeasurementGroups?: string[];
  onMeasurementGroupToggle?: (group: string, visible: boolean) => void;
  showMeasurementLegend?: boolean;
  onLegendToggle?: () => void;
}

const ObjectVisibilityControl: React.FC<ObjectVisibilityProps> = ({
  layerOpacity,
  onLayerOpacityChange,
  onClose,
  onReset,
  visibleMeasurementGroups = ['skeletal', 'dental', 'soft-tissue'],
  onMeasurementGroupToggle = () => {},
  showMeasurementLegend = true,
  onLegendToggle = () => {}
}) => {
  
  // Helper function to toggle layer visibility
  const toggleLayerVisibility = (layer: keyof LayerOpacityType, currentValue: number) => {
    if (currentValue > 0) {
      onLayerOpacityChange(layer, 0); // Hide
    } else {
      onLayerOpacityChange(layer, 100); // Show at full opacity
    }
  };

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    measurements: false
  });

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Check if a measurement group is visible
  const isMeasurementGroupVisible = (group: string) => {
    return visibleMeasurementGroups.includes(group);
  };

  // Toggle measurement group visibility
  const toggleMeasurementGroup = (group: string) => {
    onMeasurementGroupToggle(group, !isMeasurementGroupVisible(group));
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-6 w-6 ml-1"
                  onClick={() => toggleSection('measurements')}
                >
                  {expandedSections.measurements ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
            
            {/* Measurement groups */}
            {expandedSections.measurements && (
              <div className="mt-2 pl-4 space-y-2 border-l-2 border-slate-200">
                <div className="flex items-center">
                  <Checkbox
                    id="skeletal-measurements"
                    checked={isMeasurementGroupVisible('skeletal')}
                    onCheckedChange={() => toggleMeasurementGroup('skeletal')}
                    className="mr-2 h-4 w-4"
                  />
                  <label
                    htmlFor="skeletal-measurements"
                    className="text-xs text-slate-600 cursor-pointer"
                  >
                    Skeletal Measurements
                  </label>
                </div>
                
                <div className="flex items-center">
                  <Checkbox
                    id="dental-measurements"
                    checked={isMeasurementGroupVisible('dental')}
                    onCheckedChange={() => toggleMeasurementGroup('dental')}
                    className="mr-2 h-4 w-4"
                  />
                  <label
                    htmlFor="dental-measurements"
                    className="text-xs text-slate-600 cursor-pointer"
                  >
                    Dental Measurements
                  </label>
                </div>
                
                <div className="flex items-center">
                  <Checkbox
                    id="soft-tissue-measurements"
                    checked={isMeasurementGroupVisible('soft-tissue')}
                    onCheckedChange={() => toggleMeasurementGroup('soft-tissue')}
                    className="mr-2 h-4 w-4"
                  />
                  <label
                    htmlFor="soft-tissue-measurements"
                    className="text-xs text-slate-600 cursor-pointer"
                  >
                    Soft Tissue Measurements
                  </label>
                </div>
                
                <div className="flex items-center mt-2 pt-2 border-t border-slate-200">
                  <Checkbox
                    id="show-legend"
                    checked={showMeasurementLegend}
                    onCheckedChange={onLegendToggle}
                    className="mr-2 h-4 w-4"
                  />
                  <label
                    htmlFor="show-legend"
                    className="text-xs text-slate-600 cursor-pointer flex items-center"
                  >
                    <List className="h-3 w-3 mr-1" />
                    Show Measurement Legend
                  </label>
                </div>
              </div>
            )}
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