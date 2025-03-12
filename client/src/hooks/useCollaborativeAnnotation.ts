import { useState, useCallback } from 'react';
import { Landmark, LandmarksCollection } from '@shared/schema';
import { nanoid } from 'nanoid';

// Simplified version without any collaboration features
export interface CollaborativeUser {
  id: string;
  username: string;
}

interface UseCollaborativeAnnotationProps {
  collectionId: string;
  userId: string;
  username: string;
}

// This is a mock implementation that doesn't attempt any network connections
export function useCollaborativeAnnotation({
  collectionId,
  userId,
  username
}: UseCollaborativeAnnotationProps) {
  // Static mock data to avoid network requests
  const [collaborativeUsers] = useState<CollaborativeUser[]>([
    { id: userId, username } // Only the current user
  ]);
  
  // Local collection with no network sync
  const [collection, setCollection] = useState<LandmarksCollection | null>({
    id: collectionId,
    patientId: 'demo-patient',
    imageId: 'demo-image',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastModifiedBy: username,
    landmarks: []
  });

  // Local-only landmark operations
  const updateLandmark = useCallback((landmark: Landmark) => {
    setCollection((prevCollection) => {
      if (!prevCollection) return null;
      
      const updatedLandmarks = prevCollection.landmarks.map(l => 
        l.id === landmark.id ? landmark : l
      );
      
      return {
        ...prevCollection,
        landmarks: updatedLandmarks,
        updatedAt: new Date().toISOString(),
        lastModifiedBy: username
      };
    });
  }, [username]);

  const addLandmark = useCallback((landmark: Landmark) => {
    const newLandmark = {
      ...landmark,
      id: landmark.id || nanoid()
    };
    
    setCollection((prevCollection) => {
      if (!prevCollection) return null;
      
      return {
        ...prevCollection,
        landmarks: [...prevCollection.landmarks, newLandmark],
        updatedAt: new Date().toISOString(),
        lastModifiedBy: username
      };
    });
  }, [username]);

  const removeLandmark = useCallback((landmarkId: string) => {
    setCollection((prevCollection) => {
      if (!prevCollection) return null;
      
      return {
        ...prevCollection,
        landmarks: prevCollection.landmarks.filter(l => l.id !== landmarkId),
        updatedAt: new Date().toISOString(),
        lastModifiedBy: username
      };
    });
  }, [username]);

  return {
    isConnected: true, // Always consider connected since we're not doing network requests
    collaborativeUsers,
    collection,
    updateLandmark,
    addLandmark,
    removeLandmark
  };
}