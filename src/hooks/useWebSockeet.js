import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

export const useWebSocket = ({ onMessage, roomId }) => {
  // WebSocket connection state and reconnection management
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  // Initialize connection when user and roomId are available
  useEffect(() => {
    if (user && roomId) {
      connect();
    }

    return () => {
      disconnect();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user, roomId]);

  // WebSocket connection setup with authentication and room joining
  const connect = () => {
    const wsUrl = process.env.REACT_APP_WEBSOCKET_URL;
    
    socketRef.current = io(wsUrl, {
      auth: {
        token: user.token,
      },
      query: {
        roomId,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        attemptReconnect();
      }
    });

    socketRef.current.on('message', (data) => {
      if (onMessage) {
        onMessage(data);
      }
    });

    socketRef.current.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  };

  // Connection management functions
  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  // Exponential backoff reconnection strategy
  const attemptReconnect = () => {
    if (reconnectAttemptsRef.current < 5) {
      reconnectAttemptsRef.current += 1;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log(`Attempting to reconnect (attempt ${reconnectAttemptsRef.current})`);
        connect();
      }, delay);
    }
  };

  // Message sending and room management
  const sendMessage = (data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('message', {
        roomId,
        ...data,
      });
    } else {
      console.error('WebSocket not connected');
    }
  };

  const joinRoom = (newRoomId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join-room', newRoomId);
    }
  };

  const leaveRoom = (oldRoomId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave-room', oldRoomId);
    }
  };

  return {
    isConnected,
    sendMessage,
    joinRoom,
    leaveRoom,
    disconnect,
    reconnect: connect,
  };
};