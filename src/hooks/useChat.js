import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { chatApi } from '../services/api/chat';
import { useAuth } from '../contexts/AuthContext';

export const useChat = (matchId) => {
  // State management for chat functionality
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(null);
  const typingTimeoutRef = useRef(null);

  // WebSocket connection for real-time communication
  const { sendMessage: wsSend, isConnected } = useWebSocket({
    onMessage: handleWebSocketMessage,
    roomId: matchId,
  });

  // Initialize chat data when matchId changes
  useEffect(() => {
    if (matchId) {
      fetchMatchDetails();
      fetchMessages();
    }
  }, [matchId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // API functions for fetching data
  const fetchMatchDetails = async () => {
    try {
      const response = await chatApi.getMatchDetails(matchId);
      setMatchDetails({
        ...response.data,
        currentUserId: user.id,
      });
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch match details:', err);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await chatApi.getMessages(matchId);
      setMessages(response.data);
      markMessagesAsRead();
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await chatApi.markAsRead(matchId);
    } catch (err) {
      console.error('Failed to mark messages as read:', err);
    }
  };

  // WebSocket message handler for real-time updates
  function handleWebSocketMessage(message) {
    switch (message.type) {
      case 'message':
        setMessages((prev) => [...prev, message.data]);
        if (message.data.senderId !== user.id) {
          markMessagesAsRead();
        }
        break;
      
      case 'typing':
        if (message.userId !== user.id) {
          setTyping(message.userName);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setTyping(null);
          }, 3000);
        }
        break;
      
      case 'read':
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === user.id ? { ...msg, read: true } : msg
          )
        );
        break;
      
      default:
        break;
    }
  }

  // Message sending with optimistic updates
  const sendMessage = async (text) => {
    const message = {
      id: Date.now().toString(),
      matchId,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      text,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Optimistically add to UI
    setMessages((prev) => [...prev, message]);

    try {
      // Send via WebSocket for real-time delivery
      if (isConnected) {
        wsSend({
          type: 'message',
          data: message,
        });
      }

      // Also send via API for persistence
      await chatApi.sendMessage(matchId, { text });
    } catch (err) {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== message.id));
      setError('Failed to send message');
      throw err;
    }
  };

  // Typing indicator functionality
  const sendTypingIndicator = () => {
    if (isConnected) {
      wsSend({
        type: 'typing',
        userId: user.id,
        userName: user.name,
      });
    }
  };

  // Pagination for loading more messages
  const loadMoreMessages = async (beforeTimestamp) => {
    try {
      const response = await chatApi.getMessages(matchId, {
        before: beforeTimestamp,
        limit: 50,
      });
      setMessages((prev) => [...response.data, ...prev]);
    } catch (err) {
      console.error('Failed to load more messages:', err);
    }
  };

  return {
    messages,
    matchDetails,
    loading,
    error,
    typing,
    sendMessage,
    sendTypingIndicator,
    loadMoreMessages,
    refetch: fetchMessages,
  };
};