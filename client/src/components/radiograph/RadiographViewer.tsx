import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLayerControls } from "@/hooks/useLayerControls";
import { Edit2 } from "lucide-react";
import FloatingControlPanel from "./FloatingControlPanel";
import { LandmarkEditor } from "./LandmarkEditor";

interface RadiographViewerProps {
  highContrastMode: boolean;
  patientId?: string;
  imageId?: string;
}

const RadiographViewer: React.FC<RadiographViewerProps> = ({ 
  highContrastMode,
  patientId = "demo-patient-1", // Default for demonstration purposes
  imageId = "demo-image-1"      // Default for demonstration purposes
}) => {
  const { 
    layerOpacity, 
    imageControls, 
    updateLayerOpacity, 
    updateImageControl, 
    resetLayerOpacity,
    resetOnlyImageControls,
    resetAllControls
  } = useLayerControls();

  // Image transformation state
  const [scale, setScale] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  
  // Edit landmarks mode
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Image dimensions for landmark positioning
  const [imageDimensions, setImageDimensions] = useState({ width: 800, height: 1000 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Update image dimensions when the container is resized
  useEffect(() => {
    const updateDimensions = () => {
      if (imageContainerRef.current) {
        setImageDimensions({
          width: imageContainerRef.current.clientWidth,
          height: imageContainerRef.current.clientHeight
        });
      }
    };
    
    // Initial update
    updateDimensions();
    
    // Update on resize
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Simplified handlers
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleResetView = () => {
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
  };

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+') handleZoomIn();
      else if (e.key === '-') handleZoomOut();
      else if (e.key === '0') handleResetView();
      else if (e.key === 'e' && e.ctrlKey) {
        e.preventDefault();
        toggleEditMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-900 flex justify-center items-center">
      {/* Radiograph with layers */}
      <div 
        ref={imageContainerRef}
        className="relative w-full h-full"
        style={{ 
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
          transition: 'transform 0.2s ease-out',
          // Move background image inside the container so it scales with everything else
          backgroundImage: "url('/images/cephalometric.png')",
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          filter: `brightness(${100 + imageControls.brightness}%) contrast(${100 + imageControls.contrast}%)
                  ${highContrastMode ? 'brightness(120%) contrast(140%) grayscale(20%)' : ''}`
        }}
      >
        {/* Tracing layer - simplified */}
        {layerOpacity.tracing > 0 && (
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 800 1000" 
            style={{ opacity: layerOpacity.tracing / 100 }}
            preserveAspectRatio="xMidYMid meet"
          >
            <path d="M250,300 C300,280 350,260 400,250 C450,240 500,245 550,260 C600,280 650,310 680,350 C700,380 710,420 700,460 C690,500 670,540 640,570 C610,600 570,620 530,630 C480,645 430,650 380,640 C330,630 280,610 250,580 C220,550 200,510 190,470 C180,430 180,380 190,340 C200,320 220,305 250,300 Z" stroke="#3b82f6" fill="none" strokeWidth="2"/>
          </svg>
        )}
        
        {/* Landmarks layer */}
        {layerOpacity.landmarks > 0 && (
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 800 1000" 
            style={{ opacity: layerOpacity.landmarks / 100 }}
            preserveAspectRatio="xMidYMid meet"
          >
            <circle cx="250" cy="300" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="260" y="300" fontSize="12" fill="#ffffff">Na</text>
            
            <circle cx="320" cy="380" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="330" y="380" fontSize="12" fill="#ffffff">Or</text>
            
            <circle cx="400" cy="250" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="410" y="250" fontSize="12" fill="#ffffff">S</text>
          </svg>
        )}
        
        {/* Measurements layer - simplified */}
        {layerOpacity.measurements > 0 && (
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 800 1000" 
            style={{ opacity: layerOpacity.measurements / 100 }}
            preserveAspectRatio="xMidYMid meet"
          >
            <line x1="250" y1="300" x2="320" y2="380" stroke="#10b981" strokeWidth="2"/>
            <text x="275" y="330" fontSize="14" fill="#10b981">26.6°</text>
          </svg>
        )}

        {/* Landmark Editor component - with edit button removed */}
        <div className="relative">
          <LandmarkEditor 
            collectionId={`${patientId}-${imageId}`}
            userId="local-user"
            username="Local User"
            isEditMode={isEditMode}
            onToggleEditMode={toggleEditMode}
            imageDimensions={imageDimensions}
          />
        </div>
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
      />
      
    </div>
  );
};

export default RadiographViewer;
