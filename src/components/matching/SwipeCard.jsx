import React, { useState } from 'react';
import { Box, Card, CardMedia, Typography, IconButton, Chip, Avatar } from '@mui/material';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const SwipeCard = ({ duo, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 100) {
      onSwipe('like');
    } else if (info.offset.x < -100) {
      onSwipe('pass');
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        position: 'absolute',
        width: '100%',
        cursor: 'grab',
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      <Card
        sx={{
          maxWidth: 400,
          margin: '0 auto',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="500"
            image={duo.photos[0]}
            alt={duo.name}
          />
          
          {/* Gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '70%',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)',
            }}
          />

          {/* Duo info */}
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 3, color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={duo.members[0].photo}
                sx={{ width: 60, height: 60, border: '3px solid white' }}
              />
              <Avatar
                src={duo.members[1].photo}
                sx={{ width: 60, height: 60, ml: -2, border: '3px solid white' }}
              />
              <Box sx={{ ml: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  {duo.members[0].name} & {duo.members[1].name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {duo.tagline}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                icon={<LocationOnIcon />}
                label={`${duo.distance} km away`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip
                icon={<CalendarTodayIcon />}
                label={duo.availability}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {duo.interests.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  size="small"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontSize: '0.75rem',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            py: 2,
            bgcolor: 'background.paper',
          }}
        >
          <IconButton
            onClick={() => onSwipe('pass')}
            sx={{
              bgcolor: 'grey.100',
              color: 'error.main',
              '&:hover': { bgcolor: 'error.light', color: 'white' },
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={() => onSwipe('like')}
            sx={{
              bgcolor: 'grey.100',
              color: 'success.main',
              '&:hover': { bgcolor: 'success.light', color: 'white' },
            }}
          >
            <FavoriteIcon />
          </IconButton>
        </Box>
      </Card>
    </motion.div>
  );
};

export default SwipeCard;