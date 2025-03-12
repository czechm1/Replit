import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sliders, Layers, ZoomIn, ZoomOut, RefreshCw, Edit2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ImageSettingsControl from "./ImageSettingsControl";
import ObjectVisibilityControl from "./ObjectVisibilityControl";
import { LayerOpacityType, ImageControlsType } from "./types";
import { useTutorial } from "@/context/TutorialContext";

interface FloatingControlPanelProps {
  layerOpacity: LayerOpacityType;
  imageControls: ImageControlsType;
  onLayerOpacityChange: (layer: keyof LayerOpacityType, value: number) => void;
  onImageControlChange: (control: keyof ImageControlsType, value: number) => void;
  onResetLayers: () => void;
  onResetImageControls: () => void;
  onlyInvalidMode?: boolean;
  onOnlyInvalidModeChange?: (enabled: boolean) => void;
  // Zoom controls props
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  // Edit mode controls
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

const FloatingControlPanel: React.FC<FloatingControlPanelProps> = ({
  layerOpacity,
  imageControls,
  onLayerOpacityChange,
  onImageControlChange,
  onResetLayers,
  onResetImageControls,
  onlyInvalidMode = false,
  onOnlyInvalidModeChange,
  onZoomIn,
  onZoomOut,
  onResetView,
  isEditMode,
  onToggleEditMode
}) => {
  const [activeControl, setActiveControl] = useState<'none' | 'image' | 'layers'>('none');
  const { recordInteraction } = useTutorial();
  
  const toggleImageSettings = () => {
    setActiveControl(prev => prev === 'image' ? 'none' : 'image');
    if (activeControl === 'layers') setActiveControl('image');
    recordInteraction('image_settings');
  };
  
  const toggleObjectVisibility = () => {
    setActiveControl(prev => prev === 'layers' ? 'none' : 'layers');
    if (activeControl === 'image') setActiveControl('layers');
    recordInteraction('layer_controls');
  };
  
  const handleToggleEditMode = () => {
    onToggleEditMode();
    recordInteraction('landmark_editor');
  };
  
  const handleZoomIn = () => {
    onZoomIn();
    recordInteraction('zoom_controls');
  };
  
  const handleZoomOut = () => {
    onZoomOut();
    recordInteraction('zoom_controls');
  };
  
  const handleResetView = () => {
    onResetView();
    recordInteraction('zoom_controls');
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
                onClick={handleZoomOut}
                className="h-9 w-9 rounded-full text-slate-600"
                data-tutorial="zoom_controls"
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
                onClick={handleZoomIn}
                className="h-9 w-9 rounded-full text-slate-600"
                data-tutorial="zoom_controls"
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
                onClick={handleResetView}
                className="h-9 w-9 rounded-full text-slate-600"
                data-tutorial="zoom_controls"
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
        
        {/* Edit Landmarks Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isEditMode ? "default" : "ghost"}
                size="sm" 
                className="h-9 w-9 rounded-full"
                onClick={handleToggleEditMode}
                data-tutorial="landmark_editor"
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
                data-tutorial="image_settings"
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
                data-tutorial="layer_controls"
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
            onlyInvalidMode={onlyInvalidMode}
            onOnlyInvalidModeChange={onOnlyInvalidModeChange}
          />
        </div>
      )}
    </>
  );
};

export default FloatingControlPanel;