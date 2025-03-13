import { useState, useCallback } from "react";
import { LayerOpacityType, ImageControlsType } from "@/components/radiograph/types";

export function useLayerControls() {
  const [layerOpacity, setLayerOpacity] = useState<LayerOpacityType>({
    tracing: 100,
    landmarks: 100,
    measurements: 100,
    profile: 100
  });

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
      tracing: 100,
      landmarks: 100,
      measurements: 100,
      profile: 100
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
    resetAllControls
  };
}
