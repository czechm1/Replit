import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import LayerControls from "./LayerControls";
import { useLayerControls } from "@/hooks/useLayerControls";
import { 
  ZoomIn, 
  ZoomOut, 
  Move, 
  RotateCw, 
  RefreshCw, 
  Layers 
} from "lucide-react";

interface RadiographViewerProps {
  highContrastMode: boolean;
}

const RadiographViewer: React.FC<RadiographViewerProps> = ({ highContrastMode }) => {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const { 
    layerOpacity, 
    imageControls, 
    showLayerControls, 
    setShowLayerControls, 
    updateLayerOpacity, 
    updateImageControl, 
    resetImageControls 
  } = useLayerControls();

  // Image transformation state
  const [scale, setScale] = useState(0.9);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut handlers would be implemented here
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.3));
  const handleResetView = () => {
    setScale(0.9);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  // Keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleResetView();
          break;
        case 'l':
        case 'L':
          setShowLayerControls(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowLayerControls]);

  // Function to render the tooltip content
  const getTooltipContent = (tooltip: string) => {
    switch (tooltip) {
      case 'zoom-in': return "Zoom In (Scroll up or press +)";
      case 'zoom-out': return "Zoom Out (Scroll down or press -)";
      case 'pan': return "Pan (Hold H + drag)";
      case 'rotate': return "Rotate (Hold R + drag)";
      case 'reset-view': return "Reset View (Press 0)";
      case 'layer-controls': return "Layer Controls (Press L)";
      default: return "";
    }
  };

  return (
    <div 
      className={`relative flex-grow overflow-hidden bg-slate-900 flex justify-center items-center ${
        highContrastMode ? 'high-contrast' : ''
      }`}
      ref={containerRef}
    >
      {/* Radiograph Image with Layers */}
      <div 
        className="relative max-w-full max-h-full"
        style={{ 
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)` 
        }}
      >
        {/* Base Radiograph Layer */}
        <img 
          src="https://images.unsplash.com/photo-1654627567074-cc3b14c1e408?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80" 
          alt="Cephalometric radiograph" 
          className="max-w-full max-h-full object-contain"
          style={{
            filter: `brightness(${100 + imageControls.brightness}%) contrast(${100 + imageControls.contrast}%)`
          }}
        />
        
        {/* Tracing Layer */}
        {layerOpacity.tracing > 0 && (
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 800 1000" 
            preserveAspectRatio="none"
            style={{ opacity: layerOpacity.tracing / 100 }}
          >
            <path d="M250,300 C300,280 350,260 400,250 C450,240 500,245 550,260 C600,280 650,310 680,350 C700,380 710,420 700,460 C690,500 670,540 640,570 C610,600 570,620 530,630 C480,645 430,650 380,640 C330,630 280,610 250,580 C220,550 200,510 190,470 C180,430 180,380 190,340 C200,320 220,305 250,300 Z" stroke="#3b82f6" fill="none" strokeWidth="2"/>
            <path d="M290,580 C310,600 340,615 370,625 C400,635 430,640 460,635 C490,630 515,620 535,600 C550,585 560,565 565,540 C570,515 570,490 560,465 C550,440 535,420 515,405 C490,385 460,375 430,370 C400,365 370,370 345,385 C320,400 300,425 290,450 C280,475 280,505 290,530 C295,550 305,565 320,580 Z" stroke="#3b82f6" fill="none" strokeWidth="2"/>
            <path d="M350,640 C370,660 395,675 425,680 C455,685 485,680 510,665 C535,650 555,625 565,595 C575,565 575,535 565,505 C555,475 535,450 510,435 C485,420 455,415 425,420 C395,425 370,440 350,460 C330,480 320,505 320,530 C320,555 330,580 350,600 Z" stroke="#3b82f6" fill="none" strokeWidth="2"/>
          </svg>
        )}
        
        {/* Landmarks Layer */}
        {layerOpacity.landmarks > 0 && (
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 800 1000" 
            preserveAspectRatio="none"
            style={{ opacity: layerOpacity.landmarks / 100 }}
          >
            <circle cx="250" cy="300" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="260" y="300" fontSize="12" fill="#ffffff">Na</text>
            
            <circle cx="320" cy="380" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="330" y="380" fontSize="12" fill="#ffffff">Or</text>
            
            <circle cx="400" cy="250" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="410" y="250" fontSize="12" fill="#ffffff">S</text>
            
            <circle cx="480" cy="265" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="490" y="265" fontSize="12" fill="#ffffff">Po</text>
            
            <circle cx="680" cy="350" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="690" y="350" fontSize="12" fill="#ffffff">Ba</text>
            
            <circle cx="190" cy="470" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="175" y="485" fontSize="12" fill="#ffffff">A</text>
            
            <circle cx="190" cy="540" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="175" y="555" fontSize="12" fill="#ffffff">B</text>
            
            <circle cx="370" cy="625" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="380" y="625" fontSize="12" fill="#ffffff">Pog</text>
            
            <circle cx="425" cy="680" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="435" y="680" fontSize="12" fill="#ffffff">Me</text>
            
            <circle cx="425" cy="420" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="435" y="420" fontSize="12" fill="#ffffff">ANS</text>
            
            <circle cx="510" cy="435" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1"/>
            <text x="520" y="435" fontSize="12" fill="#ffffff">PNS</text>
          </svg>
        )}
        
        {/* Measurement Layer */}
        {layerOpacity.measurements > 0 && (
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            viewBox="0 0 800 1000" 
            preserveAspectRatio="none"
            style={{ opacity: layerOpacity.measurements / 100 }}
          >
            <line x1="250" y1="300" x2="320" y2="380" stroke="#10b981" strokeWidth="2"/>
            <text x="275" y="330" fontSize="14" fill="#10b981">26.6°</text>
            
            <line x1="190" y1="470" x2="190" y2="540" stroke="#10b981" strokeWidth="2"/>
            <text x="200" y="505" fontSize="14" fill="#10b981">68.8°</text>
            
            <line x1="370" y1="625" x2="425" y2="680" stroke="#10b981" strokeWidth="2"/>
            <text x="390" y="660" fontSize="14" fill="#10b981">84.5°</text>
          </svg>
        )}
      </div>
      
      {/* Toolbar Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 p-1.5 flex flex-col space-y-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors flex items-center justify-center"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-5 w-5" />
                <span className="shortcut-key ml-2">+</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom In (Scroll up or press +)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors flex items-center justify-center"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-5 w-5" />
                <span className="shortcut-key ml-2">-</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom Out (Scroll down or press -)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="w-full border-t border-slate-200"></div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors flex items-center justify-center"
              >
                <Move className="h-5 w-5" />
                <span className="shortcut-key ml-2">H</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Pan (Hold H + drag)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors flex items-center justify-center"
              >
                <RotateCw className="h-5 w-5" />
                <span className="shortcut-key ml-2">R</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rotate (Hold R + drag)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors flex items-center justify-center"
                onClick={handleResetView}
              >
                <RefreshCw className="h-5 w-5" />
                <span className="shortcut-key ml-2">0</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset View (Press 0)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="w-full border-t border-slate-200"></div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors flex items-center justify-center"
                onClick={() => setShowLayerControls(!showLayerControls)}
              >
                <Layers className="h-5 w-5" />
                <span className="shortcut-key ml-2">L</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Layer Controls (Press L)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {/* Layer Controls Panel */}
      {showLayerControls && (
        <LayerControls 
          layerOpacity={layerOpacity}
          imageControls={imageControls}
          onLayerOpacityChange={updateLayerOpacity}
          onImageControlChange={updateImageControl}
          onClose={() => setShowLayerControls(false)}
          onResetAll={resetImageControls}
        />
      )}
    </div>
  );
};

export default RadiographViewer;
