import { useState, useCallback, useEffect } from 'react';
import { Landmark, LandmarksCollection } from '@shared/schema';
import { nanoid } from 'nanoid';
import { api } from '@/services/clientStorage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

// This hook uses client-side storage to provide a collaborative-like experience
export function useCollaborativeAnnotation({
  collectionId,
  userId,
  username
}: UseCollaborativeAnnotationProps) {
  // For a client-side only app, always just have the current user
  const [collaborativeUsers] = useState<CollaborativeUser[]>([
    { id: userId, username } // Only the current user
  ]);

  // Use React Query to fetch and manage the collection data
  const queryClient = useQueryClient();
  
  // Fetch the landmarks collection from our client storage
  const { data: collection, isLoading } = useQuery({
    queryKey: ['landmarksCollection', collectionId],
    queryFn: () => api.getLandmarksCollection(collectionId),
    // If collection doesn't exist, create a new one
    initialData: () => {
      // Try to construct a patientId and imageId from the collectionId pattern
      const parts = collectionId.split('-');
      const patientId = parts[0];
      const imageId = parts.length > 1 ? parts[1] : 'default';
      
      return {
        id: collectionId,
        patientId: patientId,
        imageId: imageId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: username,
        lastModifiedBy: username,
        landmarks: []
      };
    },
  });

  // Create a new collection if it doesn't exist
  useEffect(() => {
    if (collection && !isLoading) {
      api.createLandmarksCollection(collection);
    }
  }, [collection, isLoading]);

  // Mutation for updating a landmark
  const updateLandmarkMutation = useMutation({
    mutationFn: ({ landmarkId, landmark }: { landmarkId: string, landmark: Landmark }) => 
      api.updateLandmark(collectionId, landmarkId, landmark, username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarksCollection', collectionId] });
    },
  });

  // Mutation for adding a new landmark
  const addLandmarkMutation = useMutation({
    mutationFn: (landmark: Landmark) => 
      api.addLandmark(collectionId, landmark, username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarksCollection', collectionId] });
    },
  });

  // Mutation for removing a landmark
  const removeLandmarkMutation = useMutation({
    mutationFn: (landmarkId: string) => 
      api.deleteLandmark(collectionId, landmarkId, username),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarksCollection', collectionId] });
    },
  });

  // Wrapper functions for the mutations
  const updateLandmark = useCallback((landmark: Landmark) => {
    updateLandmarkMutation.mutate({ landmarkId: landmark.id, landmark });
  }, [updateLandmarkMutation]);

  const addLandmark = useCallback((landmark: Landmark) => {
    const newLandmark = {
      ...landmark,
      id: landmark.id || nanoid()
    };
    addLandmarkMutation.mutate(newLandmark);
  }, [addLandmarkMutation]);

  const removeLandmark = useCallback((landmarkId: string) => {
    removeLandmarkMutation.mutate(landmarkId);
  }, [removeLandmarkMutation]);

  return {
    isConnected: true, // Always true for a client-side only application
    collaborativeUsers,
    collection,
    updateLandmark,
    addLandmark,
    removeLandmark
  };
}