import React, { useState, useCallback, useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCollaborativeAnnotation } from '@/hooks/useCollaborativeAnnotation';
import { useLandmarks } from '@/hooks/useLandmarks';
import { LandmarkPoint } from './types/landmark';
import { getLandmarkColor, getSelectedLandmarkColor, formatLandmarkAbbreviation } from '../../utils/landmarkUtils';

// Define the interface for landmarks to avoid schema import issues
interface Landmark {
  id: string;
  name: string;
  abbreviation: string;
  x: number;
  y: number;
  description?: string;
  confidence?: number;
}


interface LandmarkEditorProps {
  collectionId: string;
  userId: string;
  username: string;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  imageDimensions: { width: number; height: number };
}

export function LandmarkEditor({
  collectionId,
  userId,
  username,
  isEditMode,
  onToggleEditMode,
  imageDimensions
}: LandmarkEditorProps) {
  const { toast } = useToast();
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(null);
  const [newLandmarkMode, setNewLandmarkMode] = useState(false);
  const [newLandmarkName, setNewLandmarkName] = useState('');
  const [newLandmarkAbbr, setNewLandmarkAbbr] = useState('');

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [draggedLandmarkId, setDraggedLandmarkId] = useState<string | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Get initial landmarks from the API
  const { landmarkData, refetch: refetchLandmarks } = useLandmarks();

  // Initialize collection with landmarks from API
  useEffect(() => {
    if (landmarkData && landmarkData.points.length > 0 && !collection?.landmarks.length) {
      // Initialize with landmarks from API
      const initialLandmarks = landmarkData.points.map(point => ({
        id: nanoid(),
        name: point.landmark,
        abbreviation: formatLandmarkAbbreviation(point.landmark),
        x: point.coordinates.x,
        y: point.coordinates.y,
        confidence: point.confidence || 1.0
      }));

      // Add to collection
      initialLandmarks.forEach(landmark => {
        addLandmark(landmark);
      });
    }
  }, [landmarkData]);

  const {
    collection,
    updateLandmark,
    addLandmark,
    removeLandmark
  } = useCollaborativeAnnotation({
    collectionId,
    userId,
    username
  });

  // Handle selecting a landmark
  const handleLandmarkSelect = useCallback((landmark: Landmark) => {
    setSelectedLandmarkId(landmark.id);
    setNewLandmarkMode(false);
  }, []);

  // Handle moving a landmark
  const handleLandmarkMove = useCallback((id: string, x: number, y: number) => {
    if (!collection) return;

    const landmark = collection.landmarks.find(l => l.id === id);
    if (!landmark) return;

    // Ensure coordinates are within bounds
    const boundedX = Math.max(0, Math.min(x, imageDimensions.width));
    const boundedY = Math.max(0, Math.min(y, imageDimensions.height));

    const updatedLandmark: Landmark = {
      ...landmark,
      x: boundedX,
      y: boundedY
    };

    updateLandmark(updatedLandmark);
  }, [collection, updateLandmark, imageDimensions]);

  // Handle creating a new landmark
  const handleAddLandmark = useCallback((x: number, y: number) => {
    if (!newLandmarkMode || !newLandmarkName) return; // Only name is required

    // Use provided abbreviation or generate one using our utility
    const abbr = newLandmarkAbbr || formatLandmarkAbbreviation(newLandmarkName);
    
    const newLandmark: Landmark = {
      id: nanoid(),
      name: newLandmarkName,
      abbreviation: abbr,
      x,
      y,
      confidence: 1.0
    };

    addLandmark(newLandmark);

    // Reset new landmark form
    setNewLandmarkMode(false);
    setNewLandmarkName('');
    setNewLandmarkAbbr('');

    toast({
      title: 'Landmark Added',
      description: `Added new landmark ${newLandmarkName}`,
      duration: 3000
    });
  }, [newLandmarkMode, newLandmarkName, newLandmarkAbbr, addLandmark, toast]);

  // Handle removing a landmark
  const handleRemoveLandmark = useCallback(() => {
    if (!selectedLandmarkId) return;

    removeLandmark(selectedLandmarkId);
    setSelectedLandmarkId(null);

    toast({
      title: 'Landmark Removed',
      description: 'Landmark has been removed',
      duration: 3000
    });
  }, [selectedLandmarkId, removeLandmark, toast]);

  // Handle drag start on a landmark
  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>, landmarkId: string) => {
    if (!isEditMode) return;

    e.stopPropagation();
    setIsDragging(true);
    setDraggedLandmarkId(landmarkId);

    // Store the initial position of the cursor when the drag starts
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (rect) {
      dragStartPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }

    // Prevent any default browser drag behavior
    e.preventDefault();
  }, [isEditMode]);

  // Handle dragging a landmark
  const handleDrag = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode || !isDragging || !draggedLandmarkId || !collection) return;

    // Get the current position
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Update the landmark position
    handleLandmarkMove(draggedLandmarkId, currentX, currentY);

    // Prevent default to avoid text selection and other browser actions
    e.preventDefault();
  }, [isEditMode, isDragging, draggedLandmarkId, collection, handleLandmarkMove]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!isEditMode) return;

    setIsDragging(false);
    setDraggedLandmarkId(null);
  }, [isEditMode]);

  // Setup document-wide event listeners for drag
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && draggedLandmarkId && collection) {
        const canvas = document.querySelector('.absolute.inset-0');
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const currentX = e.clientX - rect.left;
          const currentY = e.clientY - rect.top;

          handleLandmarkMove(draggedLandmarkId, currentX, currentY);
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDraggedLandmarkId(null);
      }
    };

    if (isEditMode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isEditMode, isDragging, draggedLandmarkId, collection, handleLandmarkMove]);

  // Handle canvas click in edit mode
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (newLandmarkMode) {
      handleAddLandmark(x, y);
    }
  }, [isEditMode, newLandmarkMode, handleAddLandmark]);

  const handleSelectLandmark = useCallback((id: string) => {
    const landmark = collection?.landmarks.find(l => l.id === id);
    if (landmark) {
      handleLandmarkSelect(landmark);
    }
  }, [handleLandmarkSelect, collection])

  if (!isEditMode) {
    return (
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Edit mode toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onToggleEditMode}
                className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-primary hover:bg-white"
              >
                <Edit2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Edit Landmarks</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <>
      {/* Landmarks editing overlay for clicking and dragging */}
      <div 
        className="absolute inset-0 cursor-crosshair z-30" 
        onClick={handleCanvasClick}
      >
        {/* Render landmarks */}
        {collection?.landmarks.map((landmark) => (
          <div
            key={landmark.id}
            className={`absolute w-[8px] h-[8px] -translate-x-[4px] -translate-y-[4px] rounded-full 
              cursor-move group
              transition-all duration-150 ease-in-out shadow-sm
              hover:w-[14px] hover:h-[14px] hover:-translate-x-[7px] hover:-translate-y-[7px] hover:shadow-lg hover:border-2 hover:border-yellow-300
              ${
                selectedLandmarkId === landmark.id
                ? 'border-[2px] border-white shadow-md ring-2 ring-blue-400 ring-opacity-70 w-[12px] h-[12px] -translate-x-[6px] -translate-y-[6px]'
                : draggedLandmarkId === landmark.id
                ? 'border-[2px] border-white shadow-lg'
                : 'border-[1px] border-white/80'
              } 
              ${isDragging && draggedLandmarkId === landmark.id ? 'z-50' : 'z-10'}`}
            style={{
              left: landmark.x,
              top: landmark.y,
              backgroundColor: selectedLandmarkId === landmark.id 
                                ? getSelectedLandmarkColor(landmark.name)  
                                : draggedLandmarkId === landmark.id 
                                  ? getSelectedLandmarkColor(landmark.name)
                                  : getLandmarkColor(landmark.name),
              boxShadow: selectedLandmarkId === landmark.id ? '0 2px 5px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.2)',
              opacity: selectedLandmarkId === landmark.id ? 1 : 0.75, // Reduced opacity for non-selected landmarks
              filter: selectedLandmarkId === landmark.id ? 'none' : 'saturate(85%)' // Slightly desaturate non-selected points
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectLandmark(landmark.id);
            }}
            onMouseDown={(e) => handleDragStart(e, landmark.id)}
            onMouseMove={(e) => isDragging && handleDrag(e)}
            onMouseUp={handleDragEnd}
          >
            {/* Display landmark abbreviation only when hovered or selected */}
            <div 
              className={`absolute whitespace-nowrap text-xs font-bold pointer-events-none select-none px-1 py-0.5 rounded
                         transition-all duration-200 ease-in-out
                         ${selectedLandmarkId === landmark.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-90'}`}
              style={{ 
                color: '#ffffff',
                backgroundColor: 'rgba(0,0,0,0.7)',
                textShadow: '0px 0px 1px rgba(0,0,0,1)',
                letterSpacing: '0.02em',
                right: '-16px',   // Position the text further to the right of the point
                bottom: '-18px',  // Position the text below the point
                minWidth: '16px',
                textAlign: 'center',
                transform: selectedLandmarkId === landmark.id ? 'scale(1.05)' : 'scale(1)'
              }}
              title={`${landmark.name} (${landmark.abbreviation || formatLandmarkAbbreviation(landmark.name)})`}
            >
              {landmark.abbreviation || formatLandmarkAbbreviation(landmark.name)}
            </div>
            
            {/* Landmark label positioned ABOVE the landmark point to prevent overlap */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                         whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none z-20 shadow-md"
              style={{ 
                textShadow: '0px 0px 1px rgba(0,0,0,0.5)', 
                minWidth: `${landmark.name.length * 4}px`,
                top: `-32px`, // Position above the landmark
                transform: `translateX(-50%)`
              }}
            >
              {landmark.name}
            </div>
          </div>
        ))}
      </div>

      {/* Controls Panel */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">        
        {/* Edit controls */}
        <div className="bg-white/90 backdrop-blur-sm rounded-md shadow-md p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Landmark Editor</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onToggleEditMode} 
              className="h-6 w-6 text-gray-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {selectedLandmarkId ? (
              <>
                <Badge variant="outline" className="self-start mb-1">
                  {collection?.landmarks.find(l => l.id === selectedLandmarkId)?.name || 'Landmark'}
                </Badge>
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleRemoveLandmark}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setSelectedLandmarkId(null)}
                    className="w-full"
                  >
                    Deselect
                  </Button>
                </div>
              </>
            ) : newLandmarkMode ? (
              <>
                <div className="space-y-2">
                  <Input 
                    type="text" 
                    placeholder="Landmark name" 
                    value={newLandmarkName}
                    onChange={(e) => setNewLandmarkName(e.target.value)}
                    className="h-8 text-sm"
                  />
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="Abbreviation (optional)" 
                      value={newLandmarkAbbr}
                      onChange={(e) => setNewLandmarkAbbr(e.target.value)}
                      className="h-8 text-sm pr-16"
                      maxLength={3}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      Optional
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Click on the image to place the landmark
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setNewLandmarkMode(false)}
                  className="mt-1"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setNewLandmarkMode(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" /> Add New Landmark
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}