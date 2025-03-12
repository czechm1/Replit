import { useState, useEffect, useCallback, useRef } from 'react';
import { Landmark, LandmarksCollection } from '@shared/schema';
import { useToast } from './use-toast';
import { apiRequest } from '@/lib/queryClient';

export interface CollaborativeUser {
  id: string;
  username: string;
}

interface UseCollaborativeAnnotationProps {
  collectionId: string;
  userId: string;
  username: string;
}

export function useCollaborativeAnnotation({
  collectionId,
  userId,
  username
}: UseCollaborativeAnnotationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [collaborativeUsers, setCollaborativeUsers] = useState<CollaborativeUser[]>([]);
  const [collection, setCollection] = useState<LandmarksCollection | null>(null);
  const pollingIntervalRef = useRef<number | null>(null);
  const collectionPollingIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  // Handle remote landmark updates
  const handleRemoteLandmarkUpdate = useCallback((landmark: Landmark) => {
    setCollection((prevCollection) => {
      if (!prevCollection) return null;
      
      const updatedLandmarks = prevCollection.landmarks.map(l => 
        l.id === landmark.id ? landmark : l
      );
      
      return {
        ...prevCollection,
        landmarks: updatedLandmarks
      };
    });
  }, []);

  // Handle remote landmark additions
  const handleRemoteLandmarkAdd = useCallback((landmark: Landmark) => {
    setCollection((prevCollection) => {
      if (!prevCollection) return null;
      
      return {
        ...prevCollection,
        landmarks: [...prevCollection.landmarks, landmark]
      };
    });
  }, []);

  // Handle remote landmark removals
  const handleRemoteLandmarkRemove = useCallback((landmarkId: string) => {
    setCollection((prevCollection) => {
      if (!prevCollection) return null;
      
      return {
        ...prevCollection,
        landmarks: prevCollection.landmarks.filter(l => l.id !== landmarkId)
      };
    });
  }, []);

  // Setup polling for active users
  const setupPolling = useCallback(() => {
    if (!collectionId || !userId || !username) return;

    // Join the collection
    const joinCollection = async () => {
      try {
        await apiRequest(`/api/join-collection/${collectionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, username })
        });
        
        setIsConnected(true);
        console.log('Joined collection via HTTP');
      } catch (error) {
        console.error('Error joining collection:', error);
        setIsConnected(false);
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to collaboration server.',
          variant: 'destructive'
        });
      }
    };

    // Initial join
    joinCollection();

    // Poll for active users
    const pollActiveUsers = async () => {
      if (!collectionId) return;

      try {
        const response = await apiRequest(`/api/active-users/${collectionId}`);
        const data = await response.json();
        
        if (data.users) {
          setCollaborativeUsers(data.users);
        }
      } catch (error) {
        console.error('Error polling active users:', error);
      }
    };

    // Poll for collection data
    const pollCollectionData = async () => {
      if (!collectionId) return;

      try {
        const response = await apiRequest(`/api/landmarks-collections/${collectionId}`);
        const data = await response.json();
        
        if (data) {
          setCollection(data);
        }
      } catch (error) {
        console.error('Error polling collection data:', error);
      }
    };

    // Initial polls
    pollActiveUsers();
    pollCollectionData();

    // Setup polling intervals
    pollingIntervalRef.current = window.setInterval(pollActiveUsers, 5000); // Poll every 5 seconds
    collectionPollingIntervalRef.current = window.setInterval(pollCollectionData, 5000); // Poll every 5 seconds

    // Heartbeat to keep user active
    const heartbeatInterval = window.setInterval(() => {
      joinCollection(); // Re-join to update last active timestamp
    }, 60000); // Every minute

    return () => {
      if (pollingIntervalRef.current) window.clearInterval(pollingIntervalRef.current);
      if (collectionPollingIntervalRef.current) window.clearInterval(collectionPollingIntervalRef.current);
      window.clearInterval(heartbeatInterval);
    };
  }, [collectionId, userId, username, toast]);

  // Setup polling on component mount
  useEffect(() => {
    const cleanup = setupPolling();

    // Clean up on unmount
    return () => {
      if (cleanup) cleanup();
      
      // Leave the collection
      if (collectionId && userId) {
        apiRequest(`/api/leave-collection/${collectionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId })
        }).catch(err => {
          console.error('Error leaving collection:', err);
        });
      }
      
      // Clear any polling intervals
      if (pollingIntervalRef.current) window.clearInterval(pollingIntervalRef.current);
      if (collectionPollingIntervalRef.current) window.clearInterval(collectionPollingIntervalRef.current);
    };
  }, [collectionId, userId, username, setupPolling]);

  // Update landmark
  const updateLandmark = useCallback(async (landmark: Landmark) => {
    if (!collectionId || !userId || !username || !isConnected) return;
    
    try {
      await apiRequest(`/api/landmarks-collections/${collectionId}/landmarks/${landmark.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ landmark, userId, username })
      });
      
      // Update local state
      handleRemoteLandmarkUpdate(landmark);
    } catch (error) {
      console.error('Error updating landmark:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update landmark.',
        variant: 'destructive'
      });
    }
  }, [collectionId, userId, username, isConnected, handleRemoteLandmarkUpdate, toast]);

  // Add landmark
  const addLandmark = useCallback(async (landmark: Landmark) => {
    if (!collectionId || !userId || !username || !isConnected) return;
    
    try {
      await apiRequest(`/api/landmarks-collections/${collectionId}/landmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ landmark, userId, username })
      });
      
      // Update local state
      handleRemoteLandmarkAdd(landmark);
    } catch (error) {
      console.error('Error adding landmark:', error);
      toast({
        title: 'Add Failed',
        description: 'Failed to add landmark.',
        variant: 'destructive'
      });
    }
  }, [collectionId, userId, username, isConnected, handleRemoteLandmarkAdd, toast]);

  // Remove landmark
  const removeLandmark = useCallback(async (landmarkId: string) => {
    if (!collectionId || !userId || !username || !isConnected) return;
    
    try {
      await apiRequest(`/api/landmarks-collections/${collectionId}/landmarks/${landmarkId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, username })
      });
      
      // Update local state
      handleRemoteLandmarkRemove(landmarkId);
    } catch (error) {
      console.error('Error removing landmark:', error);
      toast({
        title: 'Remove Failed',
        description: 'Failed to remove landmark.',
        variant: 'destructive'
      });
    }
  }, [collectionId, userId, username, isConnected, handleRemoteLandmarkRemove, toast]);

  return {
    isConnected,
    collaborativeUsers,
    collection,
    updateLandmark,
    addLandmark,
    removeLandmark
  };
}