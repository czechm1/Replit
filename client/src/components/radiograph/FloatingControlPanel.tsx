import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sliders, Layers, ChevronUp, ChevronDown } from "lucide-react";
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
  onlyInvalidMode?: boolean;
  onOnlyInvalidModeChange?: (enabled: boolean) => void;
}

const FloatingControlPanel: React.FC<FloatingControlPanelProps> = ({
  layerOpacity,
  imageControls,
  onLayerOpacityChange,
  onImageControlChange,
  onResetLayers,
  onResetImageControls,
  onlyInvalidMode = false,
  onOnlyInvalidModeChange
}) => {
  const [activeControl, setActiveControl] = useState<'none' | 'image' | 'layers'>('none');
  const [expanded, setExpanded] = useState(false);
  
  const toggleImageSettings = () => {
    setActiveControl(prev => prev === 'image' ? 'none' : 'image');
  };
  
  const toggleObjectVisibility = () => {
    setActiveControl(prev => prev === 'layers' ? 'none' : 'layers');
  };
  
  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };
  
  const closeControls = () => {
    setActiveControl('none');
  };
  
  return (
    <>
      {/* Floating bottom control panel */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-slate-200 p-1 flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeControl === 'image' ? 'default' : 'ghost'} 
                size="sm" 
                className="h-10 w-10 rounded-full"
                onClick={toggleImageSettings}
              >
                <Sliders className="h-5 w-5" />
                <span className="sr-only">Image Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Image Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={activeControl === 'layers' ? 'default' : 'ghost'} 
                size="sm" 
                className="h-10 w-10 rounded-full"
                onClick={toggleObjectVisibility}
              >
                <Layers className="h-5 w-5" />
                <span className="sr-only">Object Visibility</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Object Visibility</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Expand/Collapse button positioned lower */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-8 rounded-full px-3 shadow-md"
                onClick={toggleExpanded}
              >
                {expanded ? 
                  <><ChevronDown className="h-4 w-4 mr-1" /> Collapse</> : 
                  <><ChevronUp className="h-4 w-4 mr-1" /> Expand</>
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{expanded ? 'Collapse Analysis Panel' : 'Expand Analysis Panel'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Conditional rendering of control panels */}
      {activeControl === 'image' && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <ImageSettingsControl
            imageControls={imageControls}
            onImageControlChange={onImageControlChange}
            onClose={closeControls}
            onReset={onResetImageControls}
          />
        </div>
      )}
      
      {activeControl === 'layers' && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
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