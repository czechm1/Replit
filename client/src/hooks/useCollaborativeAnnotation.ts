import { useState, useEffect, useCallback, useRef } from 'react';
import { WebSocketMessage, Landmark, LandmarksCollection } from '@shared/schema';
import { useToast } from './use-toast';

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
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
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

  // Function to create and set up WebSocket connection
  const setupWebSocket = useCallback(() => {
    if (!collectionId || !userId || !username) return null;

    // Clear any existing reconnection timeouts
    if (reconnectTimeoutRef.current !== null) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Create WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    console.log(`Connecting to WebSocket (attempt ${reconnectAttemptsRef.current + 1}):`, wsUrl);
    
    try {
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
        console.log('WebSocket connection established');
        
        // Join the collection
        const joinMessage: WebSocketMessage = {
          type: 'join_collection',
          collectionId,
          userId,
          username
        };
        
        socket.send(JSON.stringify(joinMessage));
      };

      socket.onclose = (event) => {
        setIsConnected(false);
        console.log('WebSocket connection closed:', event.code, event.reason);
        
        // Attempt to reconnect unless this was a normal closure or component unmounting
        if (event.code !== 1000 && reconnectAttemptsRef.current < 5) {
          const delay = Math.min(1000 * (2 ** reconnectAttemptsRef.current), 30000); // Exponential backoff with 30s max
          console.log(`Attempting to reconnect in ${delay}ms...`);
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            socketRef.current = setupWebSocket();
          }, delay);
        } else if (reconnectAttemptsRef.current >= 5) {
          toast({
            title: 'Connection Failed',
            description: 'Unable to connect to the collaboration server after multiple attempts. Please refresh the page to try again.',
            variant: 'destructive',
            duration: 10000
          });
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Only show error toast on first error to avoid spam
        if (reconnectAttemptsRef.current === 0) {
          toast({
            title: 'Connection Error',
            description: 'Failed to connect to collaboration server. Attempting to reconnect...',
            variant: 'destructive'
          });
        }
      };

      socket.onmessage = (event) => {
        try {
          console.log('WebSocket message received:', event.data.substring(0, 200) + (event.data.length > 200 ? '...' : ''));
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'users_in_collection':
              setCollaborativeUsers(message.users);
              break;
              
            case 'collection_data':
              setCollection(message.collection);
              break;
              
            case 'update_landmark':
              if (message.userId !== userId) {
                handleRemoteLandmarkUpdate(message.landmark);
                toast({
                  title: 'Landmark Updated',
                  description: `${message.username} updated landmark ${message.landmark.name}`,
                  duration: 3000
                });
              }
              break;
              
            case 'add_landmark':
              if (message.userId !== userId) {
                handleRemoteLandmarkAdd(message.landmark);
                toast({
                  title: 'Landmark Added',
                  description: `${message.username} added landmark ${message.landmark.name}`,
                  duration: 3000
                });
              }
              break;
              
            case 'remove_landmark':
              if (message.userId !== userId) {
                handleRemoteLandmarkRemove(message.landmarkId);
                toast({
                  title: 'Landmark Removed',
                  description: `${message.username} removed a landmark`,
                  duration: 3000
                });
              }
              break;
              
            case 'error':
              toast({
                title: 'Server Error',
                description: message.message,
                variant: 'destructive'
              });
              break;
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      return socket;
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      return null;
    }
  }, [collectionId, userId, username, toast, handleRemoteLandmarkUpdate, handleRemoteLandmarkAdd, handleRemoteLandmarkRemove]);

  // Connect to WebSocket server on component mount
  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = setupWebSocket();

    // Clean up on unmount
    return () => {
      // Clear any reconnection attempts
      if (reconnectTimeoutRef.current !== null) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Close WebSocket if it's open
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        try {
          const leaveMessage: WebSocketMessage = {
            type: 'leave_collection',
            collectionId,
            userId
          };
          
          socketRef.current.send(JSON.stringify(leaveMessage));
        } catch (err) {
          console.error('Error sending leave message:', err);
        }
        
        socketRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [collectionId, userId, username, setupWebSocket]);

  // Send landmark update
  const updateLandmark = useCallback((landmark: Landmark) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    
    const message: WebSocketMessage = {
      type: 'update_landmark',
      collectionId,
      userId,
      username,
      landmark
    };
    
    socketRef.current.send(JSON.stringify(message));
  }, [collectionId, userId, username]);

  // Add landmark
  const addLandmark = useCallback((landmark: Landmark) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    
    const message: WebSocketMessage = {
      type: 'add_landmark',
      collectionId,
      userId,
      username,
      landmark
    };
    
    socketRef.current.send(JSON.stringify(message));
  }, [collectionId, userId, username]);

  // Remove landmark
  const removeLandmark = useCallback((landmarkId: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
    
    const message: WebSocketMessage = {
      type: 'remove_landmark',
      collectionId,
      userId,
      username,
      landmarkId
    };
    
    socketRef.current.send(JSON.stringify(message));
  }, [collectionId, userId, username]);

  return {
    isConnected,
    collaborativeUsers,
    collection,
    updateLandmark,
    addLandmark,
    removeLandmark
  };
}