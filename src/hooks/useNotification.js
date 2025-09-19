import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Hub } from 'aws-amplify';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [newMatches, setNewMatches] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotificationCounts();
      subscribeToNotifications();
    }
  }, [user]);

  const fetchNotificationCounts = async () => {
    try {
      // This would call your API to get notification counts
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

  const markMessagesAsRead = (matchId) => {
    // Update local state and notify server
    Hub.dispatch('notifications', { event: 'message-read', data: { matchId } });
  };

  const markMatchAsViewed = (matchId) => {
    // Update local state and notify server
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