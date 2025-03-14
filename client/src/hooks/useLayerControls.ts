import { useState, useCallback } from "react";
import { LayerOpacityType, ImageControlsType } from "@/components/radiograph/types";

export function useLayerControls() {
  const defaultLayerOpacity = {
    landmarks: 60,
    measurements: 70,
    tracing: 80,
    analysisLine: 100 // Changed from profile to analysisLine
  }
  const [layerOpacity, setLayerOpacity] = useState<LayerOpacityType>(defaultLayerOpacity);

  const [imageControls, setImageControls] = useState<ImageControlsType>({
    brightness: 0,
    contrast: 0
  });

  const [showLayerControls, setShowLayerControls] = useState(false);
  const [showImageSettings, setShowImageSettings] = useState(false);
  const [showObjectVisibility, setShowObjectVisibility] = useState(false);

  // Update layer opacity
  const updateLayerOpacity = useCallback((
    layer: keyof LayerOpacityType, 
    valueOrFn: number | ((prev: number) => number)
  ) => {
    setLayerOpacity((prev: LayerOpacityType) => ({
      ...prev,
      [layer]: typeof valueOrFn === 'function' 
        ? valueOrFn(prev[layer] || 0) 
        : valueOrFn
    }));
  }, []);

  // Update image control
  const updateImageControl = useCallback((
    control: keyof ImageControlsType, 
    valueOrFn: number | ((prev: number) => number)
  ) => {
    setImageControls((prev: ImageControlsType) => ({
      ...prev,
      [control]: typeof valueOrFn === 'function' 
        ? valueOrFn(prev[control]) 
        : valueOrFn
    }));
  }, []);

  // Reset layer opacity settings
  const resetLayerOpacity = useCallback(() => {
    setLayerOpacity({
      landmarks: 60,
      measurements: 70,
      tracing: 80,
      analysisLine: 75// Changed from profile to analysisLine
    });
  }, []);

  // Reset image controls
  const resetOnlyImageControls = useCallback(() => {
    setImageControls({
      brightness: 0,
      contrast: 0
    });
  }, []);

  // Reset all controls
  const resetAllControls = useCallback(() => {
    resetLayerOpacity();
    resetOnlyImageControls();
  }, [resetLayerOpacity, resetOnlyImageControls]);

  return {
    defaultLayerOpacity,
    layerOpacity,
    imageControls,
    showLayerControls,
    setShowLayerControls,
    showImageSettings,
    setShowImageSettings,
    showObjectVisibility,
    setShowObjectVisibility,
    updateLayerOpacity,
    updateImageControl,
    resetLayerOpacity,
    resetOnlyImageControls,
    resetAllControls,
    setLayerOpacity
  };
}
