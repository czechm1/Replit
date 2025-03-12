import React, { useState, useCallback, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Edit2, Save, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCollaborativeAnnotation } from '@/hooks/useCollaborativeAnnotation';
import { CollaborationIndicator } from './CollaborationIndicator';
import { Landmark } from '@shared/schema';

interface CollaborativeLandmarkEditorProps {
  collectionId: string;
  userId: string;
  username: string;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  imageDimensions: { width: number; height: number };
}

export function CollaborativeLandmarkEditor({
  collectionId,
  userId,
  username,
  isEditMode,
  onToggleEditMode,
  imageDimensions
}: CollaborativeLandmarkEditorProps) {
  const { toast } = useToast();
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(null);
  const [newLandmarkMode, setNewLandmarkMode] = useState(false);
  const [newLandmarkName, setNewLandmarkName] = useState('');
  const [newLandmarkAbbr, setNewLandmarkAbbr] = useState('');
  
  const {
    isConnected,
    collaborativeUsers,
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
    if (!newLandmarkMode || !newLandmarkName || !newLandmarkAbbr) return;
    
    const newLandmark: Landmark = {
      id: nanoid(),
      name: newLandmarkName,
      abbreviation: newLandmarkAbbr,
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

  if (!isEditMode) {
    return (
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Collaboration indicator */}
        <div className="bg-white/90 backdrop-blur-sm rounded-md shadow-md p-2">
          <CollaborationIndicator 
            users={collaborativeUsers} 
            currentUserId={userId}
            isConnected={isConnected}
          />
        </div>
        
        {/* Edit mode toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onToggleEditMode}
                className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-primary"
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
        className="absolute inset-0 cursor-crosshair" 
        onClick={handleCanvasClick}
      >
        {/* Render landmarks */}
        {collection?.landmarks.map((landmark) => (
          <div
            key={landmark.id}
            className={`absolute w-4 h-4 -translate-x-2 -translate-y-2 rounded-full border-2 border-white cursor-move ${
              selectedLandmarkId === landmark.id
                ? 'bg-blue-500 shadow-lg'
                : 'bg-red-500'
            }`}
            style={{
              left: landmark.x,
              top: landmark.y,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleLandmarkSelect(landmark);
            }}
            // Add draggable functionality in a real implementation
          >
            <div className="absolute text-xs font-bold text-white -top-5 left-1/2 -translate-x-1/2">
              {landmark.abbreviation}
            </div>
          </div>
        ))}
      </div>

      {/* Controls Panel */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Collaboration indicator */}
        <div className="bg-white/90 backdrop-blur-sm rounded-md shadow-md p-2">
          <CollaborationIndicator 
            users={collaborativeUsers} 
            currentUserId={userId}
            isConnected={isConnected}
          />
        </div>
        
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
                  <Input 
                    type="text" 
                    placeholder="Abbreviation (e.g., 'A')" 
                    value={newLandmarkAbbr}
                    onChange={(e) => setNewLandmarkAbbr(e.target.value)}
                    className="h-8 text-sm"
                    maxLength={3}
                  />
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