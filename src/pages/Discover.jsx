import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import SwipeCard from '../components/matching/SwipeCard';
import BottomNav from '../components/common/BottomNav';
import { useMatchmaking } from '../hooks/useMatchmaking';
import RefreshIcon from '@mui/icons-material/Refresh';

const Discover = () => {
  const { candidates, loading, swipeCandidate, refreshCandidates } = useMatchmaking();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = async (duoId, action) => {
    await swipeCandidate(duoId, action);
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (currentIndex >= candidates.length) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              No more duos to show
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Check back later for more matches!
            </Typography>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setCurrentIndex(0);
                refreshCandidates();
              }}
            >
              Refresh
            </Button>
          </Box>
        </Container>
        <BottomNav />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container sx={{ flex: 1, pt: 4, pb: 10 }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Discover Duos
        </Typography>
        
        <Box sx={{ position: 'relative', height: 600 }}>
          {candidates.slice(currentIndex, currentIndex + 3).reverse().map((duo, index) => (
            <SwipeCard
              key={duo.id}
              duo={duo}
              onSwipe={(action) => handleSwipe(duo.id, action)}
            />
          ))}
        </Box>
      </Container>
      <BottomNav />
    </Box>
  );
};

export default Discover;