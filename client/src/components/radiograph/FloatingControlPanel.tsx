import { Button } from "@/components/ui/button";
import React, { useState, useRef, useEffect } from "react";
import { Sliders, Layers, ZoomIn, ZoomOut, RefreshCw, Edit2, X, RotateCcw, Eye, EyeOff, GripHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LayerOpacityType, ImageControlsType } from "./types";
import { useLayerControls } from "@/hooks/useLayerControls";

// Import component styles using JSS pattern
const useStyles = () => {
  // This is a simplified version of JSS styling approach used in the UI kit
  return {
    root: "vivera-floating-control-panel",
    panel: "vivera-panel",
    panelContent: "vivera-panel-content",
    compactControls: "vivera-compact-controls",
    section: "vivera-section",
    iconButton: "vivera-icon-button",
    active: "active",
    divider: "vivera-divider",
    opacityControls: "vivera-opacity-controls",
    floatingPanelContent: "vivera-floating-panel-content",
    opacitySlider: "vivera-opacity-slider",
    sliderLabel: "vivera-slider-label",
    sliderLabelText: "vivera-slider-label-text",
    sliderValue: "vivera-slider-value",
    slider: "vivera-slider",
    disabledSlider: "vivera-slider-disabled",
    disabled: "disabled",
    resetButton: "vivera-reset-button",
    floatingSettingsPanel: "vivera-floating-settings-panel",
    panelHeader: "vivera-panel-header",
    panelHeaderTitle: "vivera-panel-header-title",
    closeButton: "vivera-close-button",
    tooltip: "vivera-tooltip",
    sliderControls: "vivera-slider-controls",
    visibilityButton: "vivera-visibility-button",
    dragHandle: "vivera-drag-handle",
    dragging: "dragging",
    positioned: "positioned",
    positionedPanel: "positionedPanel"
  };
};

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
  // Layer visibility controls (optional with default values)
  layerVisibility?: {[key in keyof LayerOpacityType]: boolean};
  onLayerVisibilityChange?: (layer: keyof LayerOpacityType, isVisible: boolean) => void;
  // Optional initial position
  initialPosition?: { x: number, y: number };
  // Default layer opacity values for reset
  defaultLayerOpacity?: LayerOpacityType;
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
  onLegendToggle = () => {},
  layerVisibility = {
    landmarks: true,
    measurements: true,
    tracing: true,
    analysisLine: true
  },
  onLayerVisibilityChange = () => {},
  initialPosition,
  defaultLayerOpacity = {
    landmarks: 60,
    measurements: 70,
    tracing: 80,
    analysisLine: 100
  },
}) => {
  const [activeControl, setActiveControl] = useState<'none' | 'image' | 'layers'>('none');
  const [layerVisible, setLayerVisible] = useState<{[key in keyof LayerOpacityType]: boolean}>(layerVisibility);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [useDefaultPosition, setUseDefaultPosition] = useState(!initialPosition);
  const dragRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const positionRef = useRef(position);
  const rafRef = useRef<number | null>(null);
  const classes = useStyles();
  
  // Update position ref when position state changes
  useEffect(() => {
    positionRef.current = position;
  }, [position]);
  
  // Add ref for the main panel width
  const panelWidthRef = useRef<number>(0);
  
  // Update panel width when component mounts and when window resizes
  useEffect(() => {
    const updatePanelWidth = () => {
      if (dragRef.current) {
        panelWidthRef.current = dragRef.current.offsetWidth;
      }
    };
    
    updatePanelWidth();
    window.addEventListener('resize', updatePanelWidth);
    
    return () => {
      window.removeEventListener('resize', updatePanelWidth);
    };
  }, []);
  
  // Helper function to update panel width measurement
  const updatePanelWidth = () => {
    if (dragRef.current) {
      panelWidthRef.current = dragRef.current.offsetWidth;
    }
  };
  
  const toggleImageSettings = () => {
    // Update width measurement before toggling
    updatePanelWidth();
    
    // If we're opening the panel for the first time
    if (activeControl !== 'image') {
      // Small delay to ensure DOM is updated
      setTimeout(() => updatePanelWidth(), 0);
    }
    
    setActiveControl(prev => prev === 'image' ? 'none' : 'image');
    if (activeControl === 'layers') setActiveControl('image');
  };
  
  const toggleObjectVisibility = () => {
    // Update width measurement before toggling
    updatePanelWidth();
    
    // If we're opening the panel for the first time
    if (activeControl !== 'layers') {
      // Small delay to ensure DOM is updated
      setTimeout(() => updatePanelWidth(), 0);
    }
    
    setActiveControl(prev => prev === 'layers' ? 'none' : 'layers');
    if (activeControl === 'image') setActiveControl('layers');
  };
  
  const closeControls = () => {
    setActiveControl('none');
  };
  
  const toggleLayerVisibility = (layer: keyof LayerOpacityType) => {
    const newVisibility = {
      ...layerVisible,
      [layer]: !layerVisible[layer]
    };
    setLayerVisible(newVisibility);
    if(!newVisibility[layer]){
      onLayerOpacityChange(layer, 0);
    }
    else{
      onLayerOpacityChange(layer, defaultLayerOpacity[layer]);
    }

    onLayerVisibilityChange(layer, !layerVisible[layer]);
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left mouse button
    
    // Calculate the offset of the mouse relative to the panel
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      
      // If we're using default position, capture the current absolute position
      if (useDefaultPosition) {
        setPosition({
          x: rect.left,
          y: rect.top
        });
      }
      
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      
      setIsDragging(true);
      
      // We'll set useDefaultPosition to false on the first actual movement
      // rather than immediately, to avoid the jump
    }
    
    e.preventDefault();
    e.stopPropagation();
  };
  
  const updatePosition = (clientX: number, clientY: number) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      // Only now set useDefaultPosition to false once we're actually moving
      if (useDefaultPosition) {
        setUseDefaultPosition(false);
      }
      
      setPosition({
        x: clientX - offset.x,
        y: clientY - offset.y
      });
      rafRef.current = null;
    });
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX, e.clientY);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isDragging, offset]);
  
  return (
    <div className={classes.root}>
      {/* Main control panel */}
      <div 
        className={`${classes.panel} ${isDragging ? classes.dragging : ''} ${useDefaultPosition ? '' : classes.positioned}`} 
        style={useDefaultPosition ? {} : { 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transition: isDragging ? 'none' : 'all 0.2s ease' 
        }}
        ref={dragRef}
      >
        {/* Drag handle */}
        <div className={classes.dragHandle} onMouseDown={handleMouseDown}>
          <GripHorizontal size={14} />
        </div>
        
        {/* Panel content */}
        <div className={classes.panelContent}>
          <div className={classes.compactControls}>
        {/* Zoom Out */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                  <button
                    className={classes.iconButton}
                onClick={onZoomOut}
                    aria-label="Zoom Out"
              >
                    <ZoomOut size={18} />
                  </button>
            </TooltipTrigger>
                <TooltipContent className={classes.tooltip}>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Zoom In */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                  <button
                    className={classes.iconButton}
                onClick={onZoomIn}
                    aria-label="Zoom In"
              >
                    <ZoomIn size={18} />
                  </button>
            </TooltipTrigger>
                <TooltipContent className={classes.tooltip}>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Reset View */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                  <button
                    className={classes.iconButton}
                onClick={onResetView}
                    aria-label="Reset View"
              >
                    <RefreshCw size={18} />
                  </button>
            </TooltipTrigger>
                <TooltipContent className={classes.tooltip}>
              <p>Reset View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
            <div className={classes.divider}></div>
        
            {/* Edit Mode */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                  <button
                    className={`${classes.iconButton} ${isEditMode ? classes.active : ''}`}
                onClick={onToggleEditMode}
                    aria-label={isEditMode ? "Exit Edit Mode" : "Edit Landmarks"}
              >
                    <Edit2 size={18} />
                  </button>
            </TooltipTrigger>
                <TooltipContent className={classes.tooltip}>
              <p>{isEditMode ? "Exit Edit Mode" : "Edit Landmarks"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
            <div className={classes.divider}></div>
        
        {/* Image Settings */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                  <button
                    className={`${classes.iconButton} ${activeControl === 'image' ? classes.active : ''}`}
                onClick={toggleImageSettings}
                    aria-label="Image Settings"
              >
                    <Sliders size={18} />
                  </button>
            </TooltipTrigger>
                <TooltipContent className={classes.tooltip}>
              <p>Image Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Layer Visibility */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                  <button
                    className={`${classes.iconButton} ${activeControl === 'layers' ? classes.active : ''}`}
                onClick={toggleObjectVisibility}
                    aria-label="Layer Visibility"
              >
                    <Layers size={18} />
                  </button>
            </TooltipTrigger>
                <TooltipContent className={classes.tooltip}>
                  <p>Layer Visibility</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Floating panels */}
      {activeControl === 'image' && (
        <div 
          className={`${classes.floatingSettingsPanel} ${useDefaultPosition ? '' : classes.positionedPanel}`}
          style={useDefaultPosition ? {
            width: `${panelWidthRef.current}px`,
            bottom: '100px'
          } : { 
            left: `${position.x}px`, 
            top: `${position.y - 190}px`,
            transition: isDragging ? 'none' : 'all 0.2s ease',
            width: `${panelWidthRef.current}px`
          }}
        >
          <div className={classes.panelHeader}>
            <h3 className={classes.panelHeaderTitle}>Image Settings</h3>
            <button 
              className={classes.closeButton} 
              onClick={closeControls}
            >
              <X size={16} />
            </button>
          </div>
          <div className={`${classes.opacityControls} ${classes.floatingPanelContent}`}>
            <div className={classes.opacitySlider}>
              <div className={classes.sliderLabel}>
                <span className={classes.sliderLabelText}>Brightness</span>
                <span className={classes.sliderValue}>{imageControls.brightness}%</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={imageControls.brightness}
                onChange={(e) => onImageControlChange("brightness", parseInt(e.target.value))}
                className={classes.slider}
              />
            </div>
            
            <div className={classes.opacitySlider}>
              <div className={classes.sliderLabel}>
                <span className={classes.sliderLabelText}>Contrast</span>
                <span className={classes.sliderValue}>{imageControls.contrast}%</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={imageControls.contrast}
                onChange={(e) => onImageControlChange("contrast", parseInt(e.target.value))}
                className={classes.slider}
              />
            </div>
            
            <button 
              className={classes.resetButton} 
              onClick={onResetImageControls}
            >
              <RotateCcw size={14} />
              <span>Reset Image</span>
            </button>
          </div>
        </div>
      )}
      
      {activeControl === 'layers' && (
        <div 
          className={`${classes.floatingSettingsPanel} ${useDefaultPosition ? '' : classes.positionedPanel}`}
          style={useDefaultPosition ? {
            width: `${panelWidthRef.current}px`,
            bottom: '100px'
          } : { 
            left: `${position.x}px`, 
            top: `${position.y - 285}px`,
            transition: isDragging ? 'none' : 'all 0.2s ease',
            width: `${panelWidthRef.current}px`
          }}
        >
          <div className={classes.panelHeader}>
            <h3 className={classes.panelHeaderTitle}>Layer Visibility</h3>
            <button 
              className={classes.closeButton} 
              onClick={closeControls}
            >
              <X size={16} />
            </button>
          </div>
          <div className={`${classes.opacityControls} ${classes.floatingPanelContent}`}>
            <div className={classes.opacitySlider}>
              <div className={classes.sliderLabel}>
                <span className={classes.sliderLabelText}>Landmarks</span>
                <div className={classes.sliderControls}>
                  <span className={`${classes.sliderValue} ${!layerVisible.landmarks ? classes.disabled : ''}`}>
                    {layerOpacity.landmarks}%
                  </span>
                  <button
                    className={classes.visibilityButton}
                    onClick={() => toggleLayerVisibility('landmarks')}
                    aria-label={layerVisible.landmarks ? "Hide Landmarks" : "Show Landmarks"}
                  >
                    {layerVisible.landmarks ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={layerOpacity.landmarks}
                onChange={(e) => onLayerOpacityChange("landmarks", parseInt(e.target.value))}
                className={`${classes.slider} ${!layerVisible.landmarks ? classes.disabledSlider : ''}`}
                disabled={!layerVisible.landmarks}
              />
            </div>
            
            <div className={classes.opacitySlider}>
              <div className={classes.sliderLabel}>
                <span className={classes.sliderLabelText}>Measurements</span>
                <div className={classes.sliderControls}>
                  <span className={`${classes.sliderValue} ${!layerVisible.measurements ? classes.disabled : ''}`}>
                    {layerOpacity.measurements}%
                  </span>
                  <button
                    className={classes.visibilityButton}
                    onClick={() => toggleLayerVisibility('measurements')}
                    aria-label={layerVisible.measurements ? "Hide Measurements" : "Show Measurements"}
                  >
                    {layerVisible.measurements ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={layerOpacity.measurements}
                onChange={(e) => onLayerOpacityChange("measurements", parseInt(e.target.value))}
                className={`${classes.slider} ${!layerVisible.measurements ? classes.disabledSlider : ''}`}
                disabled={!layerVisible.measurements}
              />
            </div>
            
            <div className={classes.opacitySlider}>
              <div className={classes.sliderLabel}>
                <span className={classes.sliderLabelText}>Tracing Lines</span>
                <div className={classes.sliderControls}>
                  <span className={`${classes.sliderValue} ${!layerVisible.tracing ? classes.disabled : ''}`}>
                    {layerOpacity.tracing}%
                  </span>
                  <button
                    className={classes.visibilityButton}
                    onClick={() => toggleLayerVisibility('tracing')}
                    aria-label={layerVisible.tracing ? "Hide Tracing Lines" : "Show Tracing Lines"}
                  >
                    {layerVisible.tracing ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={layerOpacity.tracing}
                onChange={(e) => onLayerOpacityChange("tracing", parseInt(e.target.value))}
                className={`${classes.slider} ${!layerVisible.tracing ? classes.disabledSlider : ''}`}
                disabled={!layerVisible.tracing}
              />
            </div>
            
            <div className={classes.opacitySlider}>
              <div className={classes.sliderLabel}>
                <span className={classes.sliderLabelText}>Analysis Lines</span>
                <div className={classes.sliderControls}>
                  <span className={`${classes.sliderValue} ${!layerVisible.analysisLine ? classes.disabled : ''}`}>
                    {layerOpacity.analysisLine}%
                  </span>
                  <button
                    className={classes.visibilityButton}
                    onClick={() => toggleLayerVisibility('analysisLine')}
                    aria-label={layerVisible.analysisLine ? "Hide Analysis Lines" : "Show Analysis Lines"}
                  >
                    {layerVisible.analysisLine ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={layerOpacity.analysisLine}
                onChange={(e) => onLayerOpacityChange("analysisLine", parseInt(e.target.value))}
                className={`${classes.slider} ${!layerVisible.analysisLine ? classes.disabledSlider : ''}`}
                disabled={!layerVisible.analysisLine}
              />
            </div>
            
            <button 
              className={classes.resetButton} 
              onClick={onResetLayers}
            >
              <RotateCcw size={14} />
              <span>Reset Layers</span>
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          /* Vivera UI Kit Styles - Light Theme using CSS Variables */
          :root {
            /* Colors from designTokens.ts */
            --gray5: #f4f4f4;
            --gray10: #e9e9e9;
            --gray15: #dfdfdf;
            --gray20: #d2d2d2;
            --gray25: #c5c5c5;
            --gray30: #b6b6b6;
            --gray35: #a8a8a8;
            --gray40: #9a9a9a;
            --gray45: #8e8e8e;
            --gray50: #818181;
            --gray55: #767676;
            --gray60: #696969;
            --gray65: #5e5e5e;
            --gray70: #525252;
            --gray75: #474747;
            --gray80: #3b3b3b;
            --gray85: #303030;
            --gray90: #262626;
            --gray95: #1b1b1b;
            --gray100: #121212;
            
            /* Blue colors */
            --blue5: #e6f7ff;
            --blue10: #d1f1ff;
            --blue15: #b0e5ff;
            --blue20: #8adaff;
            --blue25: #5fcefa;
            --blue30: #41c1f0;
            --blue35: #29b3e6;
            --blue40: #16a5d9;
            --blue45: #009ace;
            --blue50: #008ec2;
            --blue55: #0080b2;
            --blue60: #0072a3;
            --blue65: #006796;
            --blue70: #005780;
            
            /* Light theme tokens */
            --backgroundSubtle00: #f4f4f4;
            --backgroundSubtle01: #ffffff;
            --backgroundSubtle02: #f4f4f4;
            --backgroundAccent: #dfdfdf;
            --backgroundMenu: #ffffff;
            --backgroundOverlay: rgba(0, 0, 0, 0.630);
            --backgroundOnColor: #ffffff;
            --backgroundInverse: #262626;
            --backgroundInteractive: #009ace;
            --backgroundDestructive: #d43f58;
            --backgroundSubtleHover: rgba(0, 0, 0, 0.045);
            --backgroundAccentHover: #d2d2d2;
            --backgroundInteractiveHover: #008ec2;
            --backgroundSubtleActive: rgba(0, 0, 0, 0.085);
            --backgroundAccentActive: #c5c5c5;
            --backgroundInteractiveActive: #0080b2;
            
            --borderSubtle: rgba(0, 0, 0, 0.085);
            --borderAccent: rgba(0, 0, 0, 0.228);
            --borderInteractive: #009ace;
            --borderFocus: #009ace;
            
            --textPrimary: rgba(0, 0, 0, 0.930);
            --textSecondary: rgba(0, 0, 0, 0.630);
            --textTertiary: rgba(0, 0, 0, 0.445);
            --textOnColorPrimary: #ffffff;
            
            /* Spacing tokens - exact px values */
            --sp01: 4px;
            --sp02: 8px;
            --sp03: 12px;
            --sp04: 16px;
            --sp05: 24px;
            --sp06: 32px;
            
            /* Typography tokens - exact values from the UI kit */
            --tpHeading01: 500 14px/20px Roboto, Arial, sans-serif;
            --tpBody01: 400 14px/20px Roboto, Arial, sans-serif;
            --tpBody02: 400 17px/24px Roboto, Arial, sans-serif;
            --tpLabel01: 400 12px/16px Roboto, Arial, sans-serif;
          }
          
          .vivera-floating-control-panel {
            font-family: Roboto, Arial, sans-serif;
          }
          
          .vivera-panel {
            position: fixed;
            bottom: var(--sp05);
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 6px;
            border: 1px solid var(--borderSubtle);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
            overflow: hidden;
            z-index: 50;
            max-width: 95vw;
            width: auto;
            cursor: default;
            will-change: transform, left, top;
          }
          
          .vivera-panel.positioned {
            position: fixed;
            top: auto;
            bottom: auto;
            left: auto;
            right: auto;
            transform: none;
          }
          
          .vivera-panel.dragging {
            opacity: 0.8;
            cursor: grabbing !important;
          }
          
          .vivera-drag-handle {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 16px;
            padding: 2px 0;
            cursor: grab;
            color: var(--textTertiary);
            background-color: rgba(0, 0, 0, 0.02);
            border-bottom: 1px solid var(--borderSubtle);
            user-select: none;
            touch-action: none;
          }
          
          .vivera-drag-handle:hover {
            color: var(--textSecondary);
            background-color: rgba(0, 0, 0, 0.04);
          }
          
          .vivera-drag-handle:active {
            cursor: grabbing;
          }
          
          .vivera-panel-content {
            padding: var(--sp02) var(--sp03);
          }
          
          .vivera-compact-controls {
            display: flex;
            align-items: center;
            gap: var(--sp02);
          }
          
          .vivera-section {
            display: flex;
            flex-direction: column;
            gap: var(--sp02);
          }
          
          .vivera-icon-button {
            background-color: rgba(244, 244, 244, 0.5);
            color: var(--textPrimary);
            border: none;
            border-radius: 4px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            padding: 0;
          }
          
          .vivera-icon-button:hover {
            background-color: rgba(244, 244, 244, 0.7);
          }
          
          .vivera-icon-button.active {
            background-color: var(--backgroundInteractive);
            color: var(--textOnColorPrimary);
          }
          
          .vivera-divider {
            width: 1px;
            height: 16px;
            background-color: var(--borderSubtle);
            margin: 0 var(--sp01);
          }
          
          .vivera-opacity-controls {
            display: flex;
            flex-direction: column;
            gap: var(--sp03);
          }
          
          .vivera-floating-panel-content {
            padding: var(--sp04);
          }
          
          .vivera-opacity-slider {
            display: flex;
            flex-direction: column;
            gap: var(--sp02);
          }
          
          .vivera-slider-label {
            display: flex;
            justify-content: space-between;
            font: var(--tpLabel01);
          }
          
          .vivera-slider-label-text {
            color: var(--textPrimary);
            font-weight: 500;
          }
          
          .vivera-slider-value {
            color: var(--textSecondary);
            font-weight: 400;
          }
          
          .vivera-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: var(--borderAccent);
            outline: none;
            transition: all 0.2s;
            cursor: pointer;
          }
          
          .vivera-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--backgroundInteractive);
            cursor: pointer;
            transition: all 0.2s;
            border: 2px solid var(--backgroundOnColor);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .vivera-slider::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--backgroundInteractive);
            cursor: pointer;
            transition: all 0.2s;
            border: 2px solid var(--backgroundOnColor);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .vivera-slider::-webkit-slider-thumb:hover,
          .vivera-slider::-webkit-slider-thumb:active {
            transform: scale(1.1);
          }
          
          .vivera-slider::-moz-range-thumb:hover,
          .vivera-slider::-moz-range-thumb:active {
            transform: scale(1.1);
          }
          
          .vivera-reset-button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--sp01);
            background-color: var(--backgroundSubtle02);
            color: var(--textPrimary);
            border: none;
            border-radius: 4px;
            padding: var(--sp01) var(--sp02);
            font: var(--tpLabel01);
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: var(--sp01);
          }
          
          .vivera-reset-button:hover {
            background-color: var(--backgroundSubtleHover);
          }
          
          .vivera-floating-settings-panel {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 6px;
            border: 1px solid var(--borderSubtle);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
            overflow: hidden;
            max-width: 95vw;
            z-index: 49;
            will-change: transform, left, top;
          }
          
          .vivera-floating-settings-panel.positionedPanel {
            position: fixed;
            top: auto;
            bottom: auto;
            left: auto;
            right: auto;
            transform: none;
          }
          
          .vivera-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--sp02) var(--sp03);
            border-bottom: 1px solid var(--borderSubtle);
            background-color: rgba(255, 255, 255, 0.4);
          }
          
          .vivera-panel-header h3 {
            margin: 0;
            font: var(--tpHeading01);
            color: var(--textPrimary);
          }
          
          .vivera-close-button {
            background-color: transparent;
            color: var(--textSecondary);
            border: none;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s ease;
            padding: 0;
          }
          
          .vivera-close-button:hover {
            background-color: var(--backgroundSubtleHover);
            color: var(--textPrimary);
          }
          
          .vivera-tooltip {
            background-color: var(--backgroundInverse) !important;
            color: var(--textOnColorPrimary) !important;
            border-radius: 4px !important;
            font: var(--tpLabel01) !important;
            padding: 4px 8px !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
          }
          
          .vivera-slider-controls {
            display: flex;
            align-items: center;
            gap: var(--sp02);
          }
          
          .vivera-visibility-button {
            background-color: transparent;
            color: var(--textSecondary);
            border: none;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s ease;
            padding: 0;
          }
          
          .vivera-visibility-button:hover {
            background-color: var(--backgroundSubtleHover);
            color: var(--textPrimary);
          }
          
          .vivera-slider-disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
          
          .disabled {
            color: var(--textTertiary);
          }
        `}
      </style>
    </div>
  );
};

export default FloatingControlPanel;