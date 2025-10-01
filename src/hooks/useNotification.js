import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Hub } from 'aws-amplify';

export const useNotifications = () => {
  // Notification state management
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [newMatches, setNewMatches] = useState(0);

  // Initialize notifications when user is available
  useEffect(() => {
    if (user) {
      fetchNotificationCounts();
      subscribeToNotifications();
    }
  }, [user]);

  // Fetch initial notification counts from API
  const fetchNotificationCounts = async () => {
    try {
      const response = await fetch(`/api/notifications/counts`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setUnreadMessages(data.unreadMessages);
      setNewMatches(data.newMatches);
    } catch (error) {
      console.error('Failed to fetch notification counts:', error);
    }
  };

  // Subscribe to real-time notification events via AWS Hub
  const subscribeToNotifications = () => {
    const listener = Hub.listen('notifications', ({ payload }) => {
      switch (payload.event) {
        case 'new-message':
          setUnreadMessages((prev) => prev + 1);
          break;
        case 'new-match':
          setNewMatches((prev) => prev + 1);
          break;
        case 'message-read':
          setUnreadMessages((prev) => Math.max(0, prev - 1));
          break;
        case 'match-viewed':
          setNewMatches((prev) => Math.max(0, prev - 1));
          break;
        default:
          break;
      }
    });

    return () => Hub.remove('notifications', listener);
  };

  // Functions to mark notifications as read/viewed
  const markMessagesAsRead = (matchId) => {
    Hub.dispatch('notifications', { event: 'message-read', data: { matchId } });
  };

  const markMatchAsViewed = (matchId) => {
    Hub.dispatch('notifications', { event: 'match-viewed', data: { matchId } });
  };

  return {
    notifications,
    unreadMessages,
    newMatches,
    markMessagesAsRead,
    markMatchAsViewed,
  };
};