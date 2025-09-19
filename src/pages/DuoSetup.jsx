import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  Tabs,
  Tab,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { motion } from 'framer-motion';
import { duoApi } from '../services/api/duos';
import { useAuth } from '../contexts/AuthContext';

const DuoSetup = () => {
  const navigate = useNavigate();
  const { user, checkAuthState } = useAuth();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [duoName, setDuoName] = useState('');
  const [duoTagline, setDuoTagline] = useState('');

  const handleCreateDuo = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await duoApi.createDuo({
        name: duoName,
        tagline: duoTagline,
        invitePhone: phoneNumber,
      });
      await checkAuthState();
      navigate('/discover');
    } catch (err) {
      setError(err.message || 'Failed to create duo');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinDuo = async () => {
    setLoading(true);
    setError('');
    try {
      await duoApi.joinDuo(inviteCode);
      await checkAuthState();
      navigate('/discover');
    } catch (err) {
      setError(err.message || 'Invalid invite code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  margin: '0 auto',
                  mb: 2,
                }}
              >
                <GroupAddIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography component="h1" variant="h5" gutterBottom>
                Create Your Duo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Team up with a friend to start double dating
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
              <Tab label="Create New Duo" />
              <Tab label="Join Existing Duo" />
            </Tabs>

            {tab === 0 ? (
              <Box>
                <TextField
                  fullWidth
                  label="Duo Name"
                  value={duoName}
                  onChange={(e) => setDuoName(e.target.value)}
                  placeholder="e.g., Dynamic Duo, Partners in Crime"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Tagline"
                  value={duoTagline}
                  onChange={(e) => setDuoTagline(e.target.value)}
                  placeholder="A fun description of your duo"
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Friend's Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  helperText="We'll send them an invite to join your duo"
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCreateDuo}
                  disabled={loading || !duoName || !phoneNumber}
                  startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
                >
                  {loading ? 'Creating...' : 'Create & Send Invite'}
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Enter the invite code from your friend
                </Typography>
                
                <TextField
                  fullWidth
                  label="Invite Code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  placeholder="ABCD1234"
                  inputProps={{ style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.2rem' } }}
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleJoinDuo}
                  disabled={loading || inviteCode.length < 6}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Joining...' : 'Join Duo'}
                </Button>
              </Box>
            )}

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button variant="text" onClick={() => navigate('/discover')}>
                Skip for now
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default DuoSetup;