import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Chip,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/common/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, duo, loading, updateProfile } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    locationSharing: true,
    autoMatch: false,
  });

  const handleSettingChange = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    {
      icon: <GroupIcon />,
      title: 'My Duo',
      subtitle: duo ? `With ${duo.partnerName}` : 'Create or join a duo',
      action: () => navigate('/duo-setup'),
    },
    {
      icon: <SettingsIcon />,
      title: 'Preferences',
      subtitle: 'Dating preferences and filters',
      action: () => navigate('/preferences'),
    },
    {
      icon: <NotificationsIcon />,
      title: 'Notifications',
      subtitle: 'Manage notification settings',
      toggle: true,
      setting: 'notifications',
    },
    {
      icon: <SecurityIcon />,
      title: 'Privacy & Safety',
      subtitle: 'Control your privacy settings',
      action: () => navigate('/privacy'),
    },
    {
      icon: <HelpIcon />,
      title: 'Help & Support',
      subtitle: 'FAQs and contact support',
      action: () => navigate('/help'),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container sx={{ flex: 1, py: 4, pb: 10 }}>
        {/* Profile Header */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={profile?.photos?.[0]}
              sx={{ width: 80, height: 80, mr: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5">{profile?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.age} • {profile?.location}
                </Typography>
            </Box>
            <IconButton onClick={() => setEditMode(true)}>
              <EditIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {profile?.interests?.slice(0, 3).map((interest) => (
              <Chip key={interest} label={interest} size="small" />
            ))}
            {profile?.interests?.length > 3 && (
              <Chip label={`+${profile.interests.length - 3}`} size="small" />
            )}
          </Box>
        </Paper>

        {/* Duo Card */}
        {duo && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={duo.partnerPhoto} sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle1">{duo.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your duo with {duo.partnerName}
                    </Typography>
                  </Box>
                </Box>
                <Button variant="outlined" size="small">
                  View Duo
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Menu Items */}
        <Paper elevation={1} sx={{ borderRadius: 2 }}>
          <List>
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem
                  button
                  onClick={item.action}
                  sx={{ py: 2 }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.subtitle}
                  />
                  {item.toggle && (
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={settings[item.setting]}
                        onChange={() => handleSettingChange(item.setting)}
                      />
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
                {index < menuItems.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        {/* Logout Button */}
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          sx={{ mt: 3 }}
          onClick={() => setLogoutDialog(true)}
        >
          Log Out
        </Button>
      </Container>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
        <DialogTitle>Log Out?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Log Out
          </Button>
        </DialogActions>
      </Dialog>

      <BottomNav />
    </Box>
  );
};

export default Profile;