import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLayerControls } from "@/hooks/useLayerControls";
import { Edit2 } from "lucide-react";
import FloatingControlPanel from "./FloatingControlPanel";
import { LandmarkEditor } from "./LandmarkEditor";
import TracingLinesLayer from "./TracingLinesLayer";
import AnalysisLinesLayer from "./AnalysisLinesLayer";
import LandmarksLayer from "./LandmarksLayer";
import MeasurementsLayer from "./MeasurementsLayer";

interface RadiographViewerProps {
  highContrastMode: boolean;
  patientId?: string;
  imageId?: string;
  imageUrl: string;
}

const RadiographViewer: React.FC<RadiographViewerProps> = ({
  highContrastMode,
  patientId = "demo-patient-1", // Default for demonstration purposes
  imageId = "demo-image-1", // Default for demonstration purposes
  imageUrl = "/images/cephalometric.png", // Default image path
}) => {
  const {
    layerOpacity,
    imageControls,
    updateLayerOpacity,
    updateImageControl,
    showObjectVisibility,
    setShowLayerControls,
    setShowImageSettings,
    setShowObjectVisibility,
    defaultLayerOpacity,
    resetLayerOpacity,
    resetOnlyImageControls,
  } = useLayerControls();

  // Image transformation state
  const [scale, setScale] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  // Only Invalid toggle state
  const [onlyInvalidMode, setOnlyInvalidMode] = useState(false);

  // Edit landmarks mode
  const [isEditMode, setIsEditMode] = useState(false);

  // const [layerOpacity, setLayerOpacity] = useState(defaultLayerOpacity);

  // Image dimensions for landmark positioning
  const [imageDimensions, setImageDimensions] = useState({
    width: 800,
    height: 1000,
  });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Measurement group visibility state
  const [visibleMeasurementGroups, setVisibleMeasurementGroups] = useState<
    string[]
  >(["skeletal", "dental", "soft-tissue"]);

  // Legend visibility state
  const [showMeasurementLegend, setShowMeasurementLegend] = useState(true);

  // Update image dimensions when the container is resized or image loads
  useEffect(() => {
    const updateDimensions = () => {
      if (imageContainerRef.current) {
        setImageDimensions({
          width: imageContainerRef.current.clientWidth,
          height: imageContainerRef.current.clientHeight,
        });
      }
    };

    // Initial update
    updateDimensions();

    // Update on resize
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Handle image load to get natural dimensions
  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      // Store natural dimensions ratio for consistent viewBox
      setImageDimensions((prev) => ({
        ...prev,
        naturalWidth,
        naturalHeight,
        aspectRatio: naturalWidth / naturalHeight,
      }));
    }
  };

  // Simplified handlers
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetView = () => {
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  // Handle landmark group toggling
  const handleToggleLandmarkGroup = (group: LandmarkGroupKey) => {
    setVisibleLandmarkGroups((prev) => {
      // Toggle the specific group (add if not present, remove if present)
      const isGroupSelected = prev.includes(group);

      if (isGroupSelected) {
        // Don't allow removing the last group - need at least one selected
        if (prev.length === 1) {
          return prev; // Keep at least one group selected
        }
        // Otherwise just remove this group
        return prev.filter((g) => g !== group);
      } else {
        // Add this group
        return [...prev, group];
      }
    });
  };

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "+") handleZoomIn();
      else if (e.key === "-") handleZoomOut();
      else if (e.key === "0") handleResetView();
      else if (e.key === "e" && e.ctrlKey) {
        e.preventDefault();
        toggleEditMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Apply image filters for brightness and contrast
  const getFilterStyle = () => {
    const { brightness, contrast } = imageControls;
    const brightnessValue = 1 + brightness / 100;
    const contrastValue = 1 + contrast / 100;

    return {
      filter: `brightness(${brightnessValue}) contrast(${contrastValue})`,
    };
  };

  const resetControls = () => {
    setShowLayerControls(false);
    setShowImageSettings(false);
    setShowObjectVisibility(false);
  };

  // Toggle measurement group visibility
  const handleMeasurementGroupToggle = (group: string, visible: boolean) => {
    setVisibleMeasurementGroups((prev) => {
      if (visible) {
        return [...prev, group];
      } else {
        return prev.filter((g) => g !== group);
      }
    });
  };

  // Toggle legend visibility
  const handleLegendToggle = () => {
    setShowMeasurementLegend((prev) => !prev);
  };

  // Debug useEffect to log layer opacity changes
  useEffect(() => {
    // console.log('RadiographViewer - layerOpacity updated:', layerOpacity);
  }, [layerOpacity]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900 flex justify-center items-center">
      {/* Radiograph with all layers in a single transformed container */}
      <div
        ref={imageContainerRef}
        className="relative w-full h-full"
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
          transition: "transform 0.2s ease-out",
          width: 1007,
          height: 741.288,
        }}
      >
        {/* Radiograph image */}
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Cephalometric radiograph"
          className="absolute top-0 left-0 w-full h-full object-contain"
          style={{
            filter: `brightness(${100 + imageControls.brightness}%) contrast(${
              100 + imageControls.contrast
            }%)
                    ${
                      highContrastMode
                        ? "brightness(120%) contrast(140%) grayscale(20%)"
                        : ""
                    }`,
          }}
          onLoad={handleImageLoad}
        />

        {/* Tracing lines layer - positioned directly over the image */}
        {layerOpacity.tracing > 0 && (
          <svg
            className="relative top-0 left-0 w-full h-full pointer-events-none"
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            <TracingLinesLayer opacity={layerOpacity.tracing} />
          </svg>
        )}
        {/* Analysis lines layer - positioned over the image */}
        {layerOpacity.analysisLine > 0 && (
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
              transition: "transform 0.2s ease-out",
            }}
          >
            <AnalysisLinesLayer opacity={layerOpacity.analysisLine} />
          </svg>
        )}

        {/* Landmark layer - positioned directly over the image */}
        {layerOpacity.landmarks > 0 && (
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
            <LandmarksLayer
              opacity={layerOpacity.landmarks}
              visibleLandmarkGroups={["skeletal", "dental"]}
            />
          </div>
        )}

        {/* Measurements layer - positioned over the landmarks */}
        {layerOpacity.measurements > 0 && (
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
            <MeasurementsLayer
              opacity={layerOpacity.measurements}
              visibleMeasurementGroups={visibleMeasurementGroups}
              showLegend={showMeasurementLegend}
            />
          </div>
        )}

        {/* Landmark Editor component */}
        {layerOpacity.landmarks > 0 && (
          <div className="absolute inset-0">
            <LandmarkEditor
              collectionId={`${patientId}-${imageId}`}
              userId="local-user"
              username="Local User"
              isEditMode={isEditMode}
              onToggleEditMode={toggleEditMode}
              imageDimensions={imageDimensions}
            />
          </div>
        )}
      </div>

      {/* Unified Floating Control Panel */}
      <FloatingControlPanel
        layerOpacity={layerOpacity}
        imageControls={imageControls}
        onLayerOpacityChange={updateLayerOpacity}
        onImageControlChange={updateImageControl}
        onResetLayers={resetLayerOpacity}
        onResetImageControls={resetOnlyImageControls}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        isEditMode={isEditMode}
        onToggleEditMode={toggleEditMode}
        visibleMeasurementGroups={visibleMeasurementGroups}
        onMeasurementGroupToggle={handleMeasurementGroupToggle}
        showMeasurementLegend={showMeasurementLegend}
        onLegendToggle={handleLegendToggle}
        defaultLayerOpacity={defaultLayerOpacity}
      />
    </div>
  );
};

export default RadiographViewer;
