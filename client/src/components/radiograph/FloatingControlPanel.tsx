import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sliders, Layers, ZoomIn, ZoomOut, RefreshCw, Edit2, List } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ImageSettingsControl from "./ImageSettingsControl";
import ObjectVisibilityControl from "./ObjectVisibilityControl";
import { LayerOpacityType, ImageControlsType } from "./types";

interface FloatingControlPanelProps {
  layerOpacity: LayerOpacityType;
  imageControls: ImageControlsType;
  onLayerOpacityChange: (layer: keyof LayerOpacityType, value: number) => void;
  onImageControlChange: (control: keyof ImageControlsType, value: number) => void;
  onResetLayers: () => void;
  onResetImageControls: () => void;
  // Zoom controls props
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  // Edit mode controls
  isEditMode: boolean;
  onToggleEditMode: () => void;
  // Measurement group visibility
  visibleMeasurementGroups?: string[];
  onMeasurementGroupToggle?: (group: string, visible: boolean) => void;
  // Legend visibility
  showMeasurementLegend?: boolean;
  onLegendToggle?: () => void;
}

const FloatingControlPanel: React.FC<FloatingControlPanelProps> = ({
  layerOpacity,
  imageControls,
  onLayerOpacityChange,
  onImageControlChange,
  onResetLayers,
  onResetImageControls,
  onZoomIn,
  onZoomOut,
  onResetView,
  isEditMode,
  onToggleEditMode,
  visibleMeasurementGroups = ['skeletal', 'dental', 'soft-tissue'],
  onMeasurementGroupToggle = () => {},
  showMeasurementLegend = true,
  onLegendToggle = () => {}
}) => {
  const [activeControl, setActiveControl] = useState<'none' | 'image' | 'layers'>('none');
  
  const toggleImageSettings = () => {
    setActiveControl(prev => prev === 'image' ? 'none' : 'image');
    if (activeControl === 'layers') setActiveControl('image');
  };
  
  const toggleObjectVisibility = () => {
    setActiveControl(prev => prev === 'layers' ? 'none' : 'layers');
    if (activeControl === 'image') setActiveControl('layers');
  };
  
  const closeControls = () => {
    setActiveControl('none');
  };
  
  return (
    <>
      {/* Unified bottom control panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-slate-200 p-1 flex items-center space-x-1">
        {/* Zoom Out */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onZoomOut}
                className="h-9 w-9 rounded-full text-slate-600"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Zoom In */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onZoomIn}
                className="h-9 w-9 rounded-full text-slate-600"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Reset View */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onResetView}
                className="h-9 w-9 rounded-full text-slate-600"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="w-[1px] h-6 mx-1 bg-slate-200"></div>
        
        {/* Toggle Legend */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={showMeasurementLegend ? "default" : "ghost"}
                size="sm" 
                className="h-9 w-9 rounded-full"
                onClick={onLegendToggle}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">Toggle Legend</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{showMeasurementLegend ? "Hide Legend" : "Show Legend"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Edit Landmarks Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isEditMode ? "default" : "ghost"}
                size="sm" 
                className="h-9 w-9 rounded-full"
                onClick={onToggleEditMode}
              >
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">Edit Landmarks</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isEditMode ? "Exit Edit Mode" : "Edit Landmarks"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="w-[1px] h-6 mx-1 bg-slate-200"></div>
        
        {/* Image Settings */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeControl === 'image' ? 'default' : 'ghost'} 
                size="sm" 
                className="h-9 w-9 rounded-full"
                onClick={toggleImageSettings}
              >
                <Sliders className="h-4 w-4" />
                <span className="sr-only">Image Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Image Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Layer Visibility */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeControl === 'layers' ? 'default' : 'ghost'} 
                size="sm" 
                className="h-9 w-9 rounded-full"
                onClick={toggleObjectVisibility}
              >
                <Layers className="h-4 w-4" />
                <span className="sr-only">Object Visibility</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Object Visibility</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Control panels - now positioned above the toolbar */}
      {activeControl === 'image' && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <ImageSettingsControl
            imageControls={imageControls}
            onImageControlChange={onImageControlChange}
            onClose={closeControls}
            onReset={onResetImageControls}
          />
        </div>
      )}
      
      {activeControl === 'layers' && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <ObjectVisibilityControl
            layerOpacity={layerOpacity}
            onLayerOpacityChange={onLayerOpacityChange}
            onClose={closeControls}
            onReset={onResetLayers}
            visibleMeasurementGroups={visibleMeasurementGroups}
            onMeasurementGroupToggle={onMeasurementGroupToggle}
            showMeasurementLegend={showMeasurementLegend}
            onLegendToggle={onLegendToggle}
          />
        </div>
      )}
    </>
  );
};

export default FloatingControlPanel;