import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Paper,
  Avatar,
  AvatarGroup,
  Chip,
  Button,
  IconButton,
  Badge,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/common/BottomNav';
import { matchingApi } from '../services/api/matching';

const MatchCard = ({ match, onOpen }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.3s',
          '&:hover': {
            boxShadow: 6,
            transform: 'translateY(-2px)',
          },
        }}
        onClick={() => onOpen(match)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AvatarGroup max={2} sx={{ mr: 2 }}>
            <Avatar src={match.duo.members[0].photo} alt={match.duo.members[0].name} />
            <Avatar src={match.duo.members[1].photo} alt={match.duo.members[1].name} />
          </AvatarGroup>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {match.duo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {match.lastMessage || 'Start a conversation!'}
            </Typography>
          </Box>
          {match.unreadCount > 0 && (
            <Badge badgeContent={match.unreadCount} color="error" sx={{ mr: 1 }} />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<LocationOnIcon />}
            label={`${match.duo.distance} km`}
            size="small"
            variant="outlined"
          />
          {match.upcomingDate && (
            <Chip
              icon={<EventIcon />}
              label={match.upcomingDate}
              size="small"
              color="primary"
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<ChatBubbleOutlineIcon />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/chat/${match.id}`);
            }}
          >
            Message
          </Button>
          <Button
            variant="contained"
            fullWidth
            startIcon={<EventIcon />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/schedule/${match.id}`);
            }}
          >
            Schedule
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
};

const Matches = () => {
  const [tab, setTab] = useState(0);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await matchingApi.getMatches();
      setMatches(response.data);
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeMatches = matches.filter((m) => m.status === 'active');
  const pendingDates = matches.filter((m) => m.upcomingDate);

  const handleOpenMatch = (match) => {
    // Could open a modal with match details
    console.log('Open match:', match);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container sx={{ flex: 1, pt: 2, pb: 10 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Your Matches
        </Typography>

        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
          <Tab label={`All Matches (${activeMatches.length})`} />
          <Tab label={`Upcoming Dates (${pendingDates.length})`} />
        </Tabs>

        <Grid container spacing={2}>
          <AnimatePresence mode="popLayout">
            {(tab === 0 ? activeMatches : pendingDates).map((match) => (
              <Grid item xs={12} md={6} key={match.id}>
                <MatchCard match={match} onOpen={handleOpenMatch} />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>

        {!loading && matches.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No matches yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Keep swiping to find your perfect double date match!
            </Typography>
          </Box>
        )}
      </Container>
      <BottomNav />
    </Box>
  );
};

export default Matches;