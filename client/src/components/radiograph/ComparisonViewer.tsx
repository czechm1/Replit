import React, { useState, useRef, useEffect } from "react";
import { useComparisonViewer } from "@/hooks/useComparisonViewer";
import { useLayerControls } from "@/hooks/useLayerControls";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  X, 
  Eye, 
  EyeOff, 
  ZoomIn,
  ZoomOut,
  RefreshCw,
  LayoutGrid, 
  Layers,
  ChevronLeft,
  RotateCw,
  Sliders,
  Info,
  Clock,
  Calendar,
  Plus as PlusIcon,
  Minus as MinusIcon
} from "lucide-react";
import FloatingControlPanel from "./FloatingControlPanel";
import { ComparisonImageType } from "./types";

interface ComparisonViewerProps {
  patientId: string;
  highContrastMode: boolean;
  // If initialImages is provided, they will be loaded into the comparison view
  initialImages?: ComparisonImageType[];
  onClose?: () => void;
}

const ComparisonViewer: React.FC<ComparisonViewerProps> = ({ 
  patientId,
  highContrastMode,
  initialImages = [],
  onClose 
}) => {
  const {
    comparisonImages,
    activeImageId,
    comparisonMode,
    isComparisonActive,
    addComparisonImage,
    removeComparisonImage,
    toggleImageVisibility,
    updateImageOpacity,
    updateImageColorFilter,
    setActiveImageId,
    toggleComparisonMode,
    toggleComparisonActive
  } = useComparisonViewer();

  const { 
    layerOpacity, 
    imageControls, 
    updateLayerOpacity, 
    updateImageControl, 
    resetAllControls 
  } = useLayerControls();

  const [scale, setScale] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize with any provided images
  useEffect(() => {
    if (initialImages.length > 0) {
      initialImages.forEach(img => {
        addComparisonImage(img);
      });
      
      if (initialImages.length > 1) {
        toggleComparisonActive();
      }
    }
  }, []);

  // Sample images for testing - in a real app, these would come from the backend
  const sampleImages: ComparisonImageType[] = [
    {
      id: 'ceph-before',
      patientId,
      imageType: 'ceph',
      timestamp: '2025-01-15',
      description: 'Before Treatment',
      url: '/images/cephalometric.png',
      visible: true,
      opacity: 100
    },
    {
      id: 'ceph-after',
      patientId,
      imageType: 'ceph',
      timestamp: '2025-03-15',
      description: 'After Treatment',
      url: '/images/cephalometric.png', // Would be different in real app
      visible: true,
      opacity: 100,
      colorFilter: 'hue-rotate(180deg)'
    },
    {
      id: 'profile-before',
      patientId,
      imageType: 'profile',
      timestamp: '2025-01-15',
      description: 'Profile - Before',
      url: '/images/profile.png', // Placeholder
      visible: true,
      opacity: 100
    }
  ];

  // State for edit mode (not used for landmarks, just to enable the FloatingControlPanel)
  const [isEditMode, setIsEditMode] = useState(false);
  const toggleEditMode = () => setIsEditMode(prev => !prev);

  // Zoom and pan handlers
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.3));
  const handleResetView = () => {
    setScale(1.0);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add handlers for touch events for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-full bg-slate-900 flex flex-col">
      {/* Header with controls */}
      <div className="flex justify-between items-center bg-slate-800 text-white p-2">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-200 hover:text-white hover:bg-slate-700 mr-2"
            onClick={onClose}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Button>
          <h3 className="text-lg font-medium">Comparison View</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Comparison mode toggle */}
          <div className="flex items-center">
            <Tabs value={comparisonMode} onValueChange={(value) => toggleComparisonMode()}>
              <TabsList className="bg-slate-700 text-slate-200">
                <TabsTrigger value="overlay" className="data-[state=active]:bg-blue-600">
                  <Layers className="h-4 w-4 mr-1" />
                  Overlay
                </TabsTrigger>
                <TabsTrigger value="sideBySide" className="data-[state=active]:bg-blue-600">
                  <LayoutGrid className="h-4 w-4 mr-1" />
                  Side by Side
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Zoom controls */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <MinusIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm bg-slate-700 px-2 py-1 rounded">{Math.round(scale * 100)}%</span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <PlusIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleResetView}>
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Upper section with image controls and viewer */}
        <div className="flex-1 flex min-h-0">
          {/* Sidebar with image controls */}
          <div className="w-64 bg-slate-800 p-3 overflow-y-auto">
            <div className="mb-4">
              <h4 className="text-white font-medium mb-2">Images</h4>
              
              {/* Image list */}
              <div className="space-y-3">
                {comparisonImages.length > 0 ? (
                  comparisonImages.map(image => (
                    <div key={image.id} className={`
                      bg-slate-700 rounded p-2 
                      ${activeImageId === image.id ? 'ring-2 ring-blue-500' : ''}
                    `}>
                      <div className="flex justify-between items-center mb-1">
                        <button 
                          className="text-sm font-medium text-slate-200 flex-1 text-left"
                          onClick={() => setActiveImageId(image.id)}
                        >
                          {image.description || image.imageType}
                        </button>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleImageVisibility(image.id)}
                            className="text-slate-300 hover:text-white h-6 w-6 p-0"
                          >
                            {image.visible ? 
                              <Eye className="h-3.5 w-3.5" /> : 
                              <EyeOff className="h-3.5 w-3.5" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeComparisonImage(image.id)}
                            className="text-slate-300 hover:text-red-400 h-6 w-6 p-0"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Opacity control */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400 w-14">Opacity</span>
                        <Slider
                          value={[image.opacity]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) => updateImageOpacity(image.id, value[0])}
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-400 w-7">{image.opacity}%</span>
                      </div>
                      
                      {/* Color filter selection */}
                      <div className="mt-1.5 flex gap-1">
                        <button 
                          className={`h-5 w-5 rounded-full ${image.colorFilter === undefined ? 'ring-2 ring-white' : ''}`}
                          style={{ background: 'white' }}
                          onClick={() => updateImageColorFilter(image.id, "")}
                        />
                        <button 
                          className={`h-5 w-5 rounded-full ${image.colorFilter === 'hue-rotate(120deg)' ? 'ring-2 ring-white' : ''}`}
                          style={{ background: 'green' }}
                          onClick={() => updateImageColorFilter(image.id, 'hue-rotate(120deg)')}
                        />
                        <button 
                          className={`h-5 w-5 rounded-full ${image.colorFilter === 'hue-rotate(180deg)' ? 'ring-2 ring-white' : ''}`}
                          style={{ background: 'blue' }}
                          onClick={() => updateImageColorFilter(image.id, 'hue-rotate(180deg)')}
                        />
                        <button 
                          className={`h-5 w-5 rounded-full ${image.colorFilter === 'hue-rotate(0deg) sepia(1) hue-rotate(310deg) saturate(3)' ? 'ring-2 ring-white' : ''}`}
                          style={{ background: 'red' }}
                          onClick={() => updateImageColorFilter(image.id, 'hue-rotate(0deg) sepia(1) hue-rotate(310deg) saturate(3)')}
                        />
                      </div>

                      {/* Image details */}
                      <div className="mt-2 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{image.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 text-sm">No images added for comparison</div>
                )}
              </div>
              
              {/* Add image button */}
              <div className="mt-3">
                <h5 className="text-slate-300 text-sm mb-1">Add Images:</h5>
                <div className="grid grid-cols-1 gap-1">
                  {sampleImages
                    .filter(img => !comparisonImages.some(existingImg => existingImg.id === img.id))
                    .map(image => (
                      <Button 
                        key={image.id} 
                        variant="outline" 
                        size="sm"
                        className="text-xs text-left justify-start bg-slate-700 hover:bg-slate-600 border-slate-600"
                        onClick={() => addComparisonImage(image)}
                      >
                        <PlusIcon className="h-3 w-3 mr-1" />
                        {image.description || image.imageType}
                      </Button>
                    ))
                  }
                  
                  {sampleImages.length === comparisonImages.length && (
                    <p className="text-slate-400 text-xs italic">All available images added</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Image view area */}
          <div className="flex-1 relative overflow-hidden bg-black"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            ref={containerRef}
          >
            {comparisonMode === 'overlay' ? (
              // Overlay mode
              <div 
                className="w-full h-full relative"
                style={{ 
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
              >
                {comparisonImages
                  .filter(img => img.visible)
                  .map((image, index) => (
                    <div 
                      key={image.id}
                      className="absolute top-0 left-0 w-full h-full bg-center bg-no-repeat bg-contain"
                      style={{
                        backgroundImage: `url(${image.url})`,
                        opacity: image.opacity / 100,
                        filter: `
                          brightness(${100 + imageControls.brightness}%) 
                          contrast(${100 + imageControls.contrast}%)
                          ${image.colorFilter || ''}
                          ${highContrastMode ? 'brightness(120%) contrast(140%) grayscale(20%)' : ''}
                        `,
                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                        zIndex: index
                      }}
                    />
                  ))}
              </div>
            ) : (
              // Side by side mode
              <div className="w-full h-full grid grid-cols-2 gap-1 p-1 bg-black">
                {comparisonImages
                  .filter(img => img.visible)
                  .map((image) => (
                    <div 
                      key={image.id}
                      className="relative bg-center bg-no-repeat bg-contain h-full overflow-hidden"
                      style={{
                        cursor: isDragging ? 'grabbing' : 'grab',
                      }}
                    >
                      <div
                        className="absolute top-0 left-0 w-full h-full bg-center bg-no-repeat bg-contain"
                        style={{
                          backgroundImage: `url(${image.url})`,
                          opacity: image.opacity / 100,
                          filter: `
                            brightness(${100 + imageControls.brightness}%) 
                            contrast(${100 + imageControls.contrast}%)
                            ${image.colorFilter || ''}
                            ${highContrastMode ? 'brightness(120%) contrast(140%) grayscale(20%)' : ''}
                          `,
                          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                        }}
                      />
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {image.description || image.imageType}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            
            {/* Empty state */}
            {comparisonImages.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <p>Please add images from the sidebar to begin comparison</p>
                </div>
              </div>
            )}

            {/* Floating control panel */}
            {comparisonImages.length > 0 && (
              <FloatingControlPanel
                layerOpacity={layerOpacity}
                imageControls={imageControls}
                onLayerOpacityChange={updateLayerOpacity}
                onImageControlChange={updateImageControl}
                onResetLayers={() => resetAllControls()}
                onResetImageControls={() => resetAllControls()}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetView={handleResetView}
                isEditMode={isEditMode}
                onToggleEditMode={toggleEditMode}
              />
            )}
          </div>
        </div>

        {/* Bottom section with data table */}
        {comparisonImages.length > 0 && (
          <div className="h-48 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 overflow-auto">
            <Tabs defaultValue="measurements" className="w-full">
              <TabsList className="w-full justify-start px-4 pt-2">
                <TabsTrigger value="measurements">Measurements</TabsTrigger>
                <TabsTrigger value="details">Image Details</TabsTrigger>
              </TabsList>
              <TabsContent value="measurements" className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Measurement</TableHead>
                      {comparisonImages.filter(img => img.visible).map(image => (
                        <TableHead key={image.id}>
                          {image.description || image.imageType}
                        </TableHead>
                      ))}
                      <TableHead>Difference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample measurements rows */}
                    <TableRow>
                      <TableCell className="font-medium">SNA (°)</TableCell>
                      <TableCell>82.0</TableCell>
                      <TableCell>83.5</TableCell>
                      <TableCell className="text-green-600">+1.5</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">SNB (°)</TableCell>
                      <TableCell>78.0</TableCell>
                      <TableCell>79.0</TableCell>
                      <TableCell className="text-green-600">+1.0</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">ANB (°)</TableCell>
                      <TableCell>4.0</TableCell>
                      <TableCell>4.5</TableCell>
                      <TableCell className="text-amber-600">+0.5</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Wits (mm)</TableCell>
                      <TableCell>2.5</TableCell>
                      <TableCell>1.0</TableCell>
                      <TableCell className="text-green-600">-1.5</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="details">
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {comparisonImages.map(image => (
                      <Card key={image.id}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm font-medium">{image.description || image.imageType}</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Date:</span>
                              <span>{image.timestamp}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span className="capitalize">{image.imageType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Patient ID:</span>
                              <span>{patientId}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonViewer;