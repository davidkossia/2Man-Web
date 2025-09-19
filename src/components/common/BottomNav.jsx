import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Paper, BottomNavigation, BottomNavigationAction, Badge } from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNotifications } from '../../hooks/useNotifications';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadMessages, newMatches } = useNotifications();

  const routes = [
    { value: 'discover', label: 'Discover', icon: <ExploreIcon />, path: '/discover' },
    { value: 'matches', label: 'Matches', icon: <FavoriteIcon />, path: '/matches', badge: newMatches },
    { value: 'chat', label: 'Chat', icon: <ChatIcon />, path: '/chat', badge: unreadMessages },
    { value: 'profile', label: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
  ];

  const currentValue = routes.find(route => location.pathname.startsWith(route.path))?.value || 'discover';

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={currentValue}
        onChange={(event, newValue) => {
          const route = routes.find(r => r.value === newValue);
          if (route) navigate(route.path);
        }}
      >
        {routes.map((route) => (
          <BottomNavigationAction
            key={route.value}
            label={route.label}
            value={route.value}
            icon={
              route.badge > 0 ? (
                <Badge badgeContent={route.badge} color="error">
                  {route.icon}
                </Badge>
              ) : (
                route.icon
              )
            }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;