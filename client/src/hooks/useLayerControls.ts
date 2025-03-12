import { useState, useCallback } from "react";

interface LayerOpacity {
  tracing: number;
  landmarks: number;
  measurements: number;
}

interface ImageControls {
  brightness: number;
  contrast: number;
}

export function useLayerControls() {
  const [layerOpacity, setLayerOpacity] = useState<LayerOpacity>({
    tracing: 100,
    landmarks: 100,
    measurements: 100
  });

  const [imageControls, setImageControls] = useState<ImageControls>({
    brightness: 0,
    contrast: 0
  });

  const [showLayerControls, setShowLayerControls] = useState(false);

  // Update layer opacity
  const updateLayerOpacity = useCallback((
    layer: keyof LayerOpacity, 
    valueOrFn: number | ((prev: number) => number)
  ) => {
    setLayerOpacity(prev => ({
      ...prev,
      [layer]: typeof valueOrFn === 'function' 
        ? valueOrFn(prev[layer]) 
        : valueOrFn
    }));
  }, []);

  // Update image control
  const updateImageControl = useCallback((
    control: keyof ImageControls, 
    valueOrFn: number | ((prev: number) => number)
  ) => {
    setImageControls(prev => ({
      ...prev,
      [control]: typeof valueOrFn === 'function' 
        ? valueOrFn(prev[control]) 
        : valueOrFn
    }));
  }, []);

  // Reset all image controls
  const resetImageControls = useCallback(() => {
    setLayerOpacity({
      tracing: 100,
      landmarks: 100,
      measurements: 100
    });
    setImageControls({
      brightness: 0,
      contrast: 0
    });
  }, []);

  return {
    layerOpacity,
    imageControls,
    showLayerControls,
    setShowLayerControls,
    updateLayerOpacity,
    updateImageControl,
    resetImageControls
  };
}
