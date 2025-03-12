import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLayerControls } from "@/hooks/useLayerControls";
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Layers
} from "lucide-react";

interface RadiographViewerProps {
  highContrastMode: boolean;
}

const RadiographViewer: React.FC<RadiographViewerProps> = ({ highContrastMode }) => {
  const { 
    layerOpacity, 
    imageControls, 
    showLayerControls, 
    setShowLayerControls, 
    updateLayerOpacity, 
    updateImageControl, 
    resetImageControls 
  } = useLayerControls();

  // Image transformation state - simplified
  const [scale, setScale] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  
  // Simplified handlers
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleResetView = () => {
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  // Keyboard event listeners - simplified
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+') handleZoomIn();
      else if (e.key === '-') handleZoomOut();
      else if (e.key === '0') handleResetView();
      else if (e.key.toLowerCase() === 'l') setShowLayerControls(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowLayerControls]);

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-slate-900 flex justify-center items-center"
    >
      {/* Radiograph with layers - simplified */}
      <div 
        className="relative"
        style={{ 
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        {/* Base radiograph */}
        <img 
          src="https://images.unsplash.com/photo-1654627567074-cc3b14c1e408?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80" 
          alt="Cephalometric radiograph" 
          className="max-w-full max-h-full object-contain"
          style={{
            filter: `brightness(${100 + imageControls.brightness}%) contrast(${100 + imageControls.contrast}%)`
          }}
        />
        
        {/* Tracing layer - simplified */}
        {layerOpacity.tracing > 0 && (
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 800 1000" 
            style={{ opacity: layerOpacity.tracing / 100 }}
          >
            <path d="M250,300 C300,280 350,260 400,250 C450,240 500,245 550,260 C600,280 650,310 680,350 C700,380 710,420 700,460 C690,500 670,540 640,570 C610,600 570,620 530,630 C480,645 430,650 380,640 C330,630 280,610 250,580 C220,550 200,510 190,470 C180,430 180,380 190,340 C200,320 220,305 250,300 Z" stroke="#3b82f6" fill="none" strokeWidth="2"/>
          </svg>
        )}
        
        {/* Landmarks layer - simplified */}
        {layerOpacity.landmarks > 0 && (
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 800 1000" 
            style={{ opacity: layerOpacity.landmarks / 100 }}
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
          >
            <line x1="250" y1="300" x2="320" y2="380" stroke="#10b981" strokeWidth="2"/>
            <text x="275" y="330" fontSize="14" fill="#10b981">26.6°</text>
          </svg>
        )}
      </div>
      
      {/* Minimal toolbar with tooltips */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full shadow-md px-2 py-1 flex space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleZoomOut}
                className="h-8 w-8 rounded-full text-slate-600"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleZoomIn}
                className="h-8 w-8 rounded-full text-slate-600"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="w-[1px] h-6 my-1 bg-slate-200"></div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleResetView}
                className="h-8 w-8 rounded-full text-slate-600"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="w-[1px] h-6 my-1 bg-slate-200"></div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowLayerControls(!showLayerControls)}
                className={`h-8 w-8 rounded-full ${showLayerControls ? 'bg-primary-50 text-primary-600' : 'text-slate-600'}`}
              >
                <Layers className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Layer Controls</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Layer controls - simplified to a floating panel */}
      {showLayerControls && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 p-3 space-y-3 w-64">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Display Options</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => setShowLayerControls(false)}
            >
              ×
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block text-slate-600">Brightness</label>
              <input 
                type="range" 
                min="-50" 
                max="50" 
                value={imageControls.brightness} 
                onChange={(e) => updateImageControl('brightness', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium mb-1 block text-slate-600">Contrast</label>
              <input 
                type="range" 
                min="-50" 
                max="50" 
                value={imageControls.contrast} 
                onChange={(e) => updateImageControl('contrast', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium mb-1 block text-slate-600">Tracing</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={layerOpacity.tracing} 
                onChange={(e) => updateLayerOpacity('tracing', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium mb-1 block text-slate-600">Landmarks</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={layerOpacity.landmarks} 
                onChange={(e) => updateLayerOpacity('landmarks', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium mb-1 block text-slate-600">Measurements</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={layerOpacity.measurements} 
                onChange={(e) => updateLayerOpacity('measurements', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2" 
              onClick={resetImageControls}
            >
              Reset All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadiographViewer;
