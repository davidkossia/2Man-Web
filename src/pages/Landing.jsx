import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container maxWidth="lg">
        <Box sx={{ pt: 10, pb: 6, color: 'white', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h1" gutterBottom>
              Double the Fun, Double the Connection
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Find your perfect match with a friend by your side
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Get Started
            </Button>
          </motion.div>
        </Box>

        <Grid container spacing={4} sx={{ pb: 8 }}>
          {[
            {
              icon: <GroupIcon sx={{ fontSize: 48 }} />,
              title: 'Team Up',
              description: 'Create a duo with your best friend',
            },
            {
              icon: <FavoriteIcon sx={{ fontSize: 48 }} />,
              title: 'Match Smart',
              description: 'AI-powered matching for compatible duos',
            },
            {
              icon: <EventIcon sx={{ fontSize: 48 }} />,
              title: 'Plan Together',
              description: 'Schedule fun double dates effortlessly',
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Box
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    p: 4,
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Box sx={{ color: 'white', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {feature.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Landing;