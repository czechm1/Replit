import { useState, useCallback, useEffect, useRef } from 'react';
import { Landmark, LandmarksCollection, WebSocketMessage } from '@shared/schema';
import { nanoid } from 'nanoid';
import { api } from '@/services/clientStorage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  const [collaborativeUsers, setCollaborativeUsers] = useState<CollaborativeUser[]>([
    { id: userId, username } // Start with just the current user
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  
  // Use React Query to fetch and manage the collection data
  const queryClient = useQueryClient();
  
  // Fetch the landmarks collection
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

  // WebSocket setup
  useEffect(() => {
    if (!collectionId || !userId || !username) return;
    
    // Set up WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    // WebSocket event handlers
    socket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      
      // Join the collection
      const joinMessage: WebSocketMessage = {
        type: 'join_collection',
        collectionId,
        userId,
        username
      };
      socket.send(JSON.stringify(joinMessage));
    };
    
    socket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        
        switch (message.type) {
          case 'users_in_collection':
            setCollaborativeUsers(message.users);
            break;
            
          case 'collection_data':
            // Update the collection in react-query cache
            queryClient.setQueryData(
              ['landmarksCollection', collectionId], 
              message.collection
            );
            break;
            
          case 'update_landmark':
            // Don't update if the message is from the current user
            if (message.userId !== userId) {
              // Update the landmark in the local collection
              queryClient.setQueryData(
                ['landmarksCollection', collectionId],
                (oldData: LandmarksCollection | undefined) => {
                  if (!oldData) return oldData;
                  
                  return {
                    ...oldData,
                    landmarks: oldData.landmarks.map(l => 
                      l.id === message.landmark.id ? message.landmark : l
                    ),
                    lastModifiedBy: message.username
                  };
                }
              );
            }
            break;
            
          case 'add_landmark':
            // Don't update if the message is from the current user
            if (message.userId !== userId) {
              // Add the landmark to the local collection
              queryClient.setQueryData(
                ['landmarksCollection', collectionId],
                (oldData: LandmarksCollection | undefined) => {
                  if (!oldData) return oldData;
                  
                  return {
                    ...oldData,
                    landmarks: [...oldData.landmarks, message.landmark],
                    lastModifiedBy: message.username
                  };
                }
              );
            }
            break;
            
          case 'remove_landmark':
            // Don't update if the message is from the current user
            if (message.userId !== userId) {
              // Remove the landmark from the local collection
              queryClient.setQueryData(
                ['landmarksCollection', collectionId],
                (oldData: LandmarksCollection | undefined) => {
                  if (!oldData) return oldData;
                  
                  return {
                    ...oldData,
                    landmarks: oldData.landmarks.filter(l => l.id !== message.landmarkId),
                    lastModifiedBy: message.username
                  };
                }
              );
            }
            break;
            
          case 'error':
            console.error('WebSocket error message:', message.message);
            break;
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
    
    // Cleanup function
    return () => {
      // Send leave message before closing
      if (socket.readyState === WebSocket.OPEN) {
        const leaveMessage: WebSocketMessage = {
          type: 'leave_collection',
          collectionId,
          userId
        };
        socket.send(JSON.stringify(leaveMessage));
        socket.close();
      }
    };
  }, [collectionId, userId, username, queryClient]);

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

  // WebSocket wrapper functions for the mutations
  const updateLandmark = useCallback((landmark: Landmark) => {
    // Call the REST API first
    updateLandmarkMutation.mutate({ landmarkId: landmark.id, landmark });
    
    // Then broadcast via WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'update_landmark',
        collectionId,
        userId,
        username,
        landmark
      };
      socketRef.current.send(JSON.stringify(message));
    }
  }, [updateLandmarkMutation, collectionId, userId, username]);

  const addLandmark = useCallback((landmark: Landmark) => {
    const newLandmark = {
      ...landmark,
      id: landmark.id || nanoid()
    };
    
    // Call the REST API first
    addLandmarkMutation.mutate(newLandmark);
    
    // Then broadcast via WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'add_landmark',
        collectionId,
        userId,
        username,
        landmark: newLandmark
      };
      socketRef.current.send(JSON.stringify(message));
    }
  }, [addLandmarkMutation, collectionId, userId, username]);

  const removeLandmark = useCallback((landmarkId: string) => {
    // Call the REST API first
    removeLandmarkMutation.mutate(landmarkId);
    
    // Then broadcast via WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'remove_landmark',
        collectionId,
        userId,
        username,
        landmarkId
      };
      socketRef.current.send(JSON.stringify(message));
    }
  }, [removeLandmarkMutation, collectionId, userId, username]);

  return {
    isConnected,
    collaborativeUsers,
    collection,
    updateLandmark,
    addLandmark,
    removeLandmark
  };
}