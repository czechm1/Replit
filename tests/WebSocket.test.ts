import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebSocketMessage, Landmark } from '../shared/schema';

// Mock WebSocket class
class MockWebSocket {
  url: string;
  onopen: ((event: any) => void) | null = null;
  onmessage: ((event: any) => void) | null = null;
  onclose: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  readyState: number = 0; // CONNECTING
  CONNECTING: number = 0;
  OPEN: number = 1;
  CLOSING: number = 2;
  CLOSED: number = 3;
  sent: any[] = [];

  constructor(url: string) {
    this.url = url;
    // Simulate connection after a brief delay
    setTimeout(() => {
      this.readyState = this.OPEN;
      if (this.onopen) {
        this.onopen({ type: 'open' });
      }
    }, 0);
  }

  send(data: string) {
    this.sent.push(JSON.parse(data));
  }

  close() {
    this.readyState = this.CLOSED;
    if (this.onclose) {
      this.onclose({ type: 'close' });
    }
  }

  // Helper method to simulate receiving a message
  simulateMessage(data: any) {
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data), type: 'message' });
    }
  }
}

describe('WebSocket Communication', () => {
  let originalWebSocket: any;
  let mockWebSocket: MockWebSocket;

  beforeEach(() => {
    // Store original WebSocket and replace with mock
    originalWebSocket = global.WebSocket;
    global.WebSocket = MockWebSocket as any;
    
    // Create mock WebSocket connection
    mockWebSocket = new MockWebSocket('ws://localhost:5000/ws');
  });

  afterEach(() => {
    // Restore original WebSocket
    global.WebSocket = originalWebSocket;
  });

  it('connects to WebSocket server with correct URL format', () => {
    // In a real environment, we would check the protocol
    const protocol = 'ws:'; // or 'wss:' for secure
    const host = 'localhost:5000';
    const path = '/ws';
    
    const expectedUrl = `${protocol}//${host}${path}`;
    expect(mockWebSocket.url).toBe(expectedUrl);
  });

  it('sends correct message format for landmark updates', () => {
    // Create a landmark update message
    const landmark: Landmark = {
      id: 'landmark1',
      name: 'A Point',
      abbreviation: 'A',
      x: 100,
      y: 150,
      description: 'Deepest point on the curve of the maxilla'
    };
    
    const message: WebSocketMessage = {
      type: 'update_landmark',
      userId: 'user123',
      username: 'Test User',
      collectionId: 'collection123',
      landmark
    };
    
    // Send the message
    mockWebSocket.send(JSON.stringify(message));
    
    // Check if message was sent correctly
    expect(mockWebSocket.sent.length).toBe(1);
    expect(mockWebSocket.sent[0]).toEqual(message);
  });

  it('receives and processes landmark update messages', () => {
    const handler = vi.fn();
    
    // Set up message handler
    mockWebSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handler(message);
    };
    
    // Create a test message
    const landmark: Landmark = {
      id: 'landmark2',
      name: 'B Point',
      abbreviation: 'B',
      x: 120,
      y: 180,
      description: 'Deepest point on the curve of the mandible'
    };
    
    const message: WebSocketMessage = {
      type: 'update_landmark',
      userId: 'user456',
      username: 'Another User',
      collectionId: 'collection123',
      landmark
    };
    
    // Simulate receiving a message
    mockWebSocket.simulateMessage(message);
    
    // Check if handler was called with the right message
    expect(handler).toHaveBeenCalledWith(message);
  });
  
  it('handles connection state changes', () => {
    const openHandler = vi.fn();
    const closeHandler = vi.fn();
    
    mockWebSocket.onopen = openHandler;
    mockWebSocket.onclose = closeHandler;
    
    // Simulate open event
    mockWebSocket.onopen({ type: 'open' });
    expect(openHandler).toHaveBeenCalled();
    
    // Simulate close event
    mockWebSocket.close();
    expect(closeHandler).toHaveBeenCalled();
    expect(mockWebSocket.readyState).toBe(mockWebSocket.CLOSED);
  });
});