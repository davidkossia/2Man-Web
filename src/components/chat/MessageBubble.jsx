import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import { format, isToday, isYesterday } from 'date-fns';

const MessageBubble = ({ message, isOwn, showAvatar }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        mb: showAvatar ? 2 : 0.5,
        alignItems: 'flex-end',
      }}
    >
      {!isOwn && showAvatar && (
        <Avatar
          src={message.senderAvatar}
          sx={{ width: 32, height: 32, mr: 1 }}
        />
      )}
      {!isOwn && !showAvatar && <Box sx={{ width: 40 }} />}
      
      <Box sx={{ maxWidth: '70%' }}>
        {showAvatar && !isOwn && (
          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
            {message.senderName}
          </Typography>
        )}
        
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            px: 2,
            bgcolor: isOwn ? 'primary.main' : 'grey.100',
            color: isOwn ? 'white' : 'text.primary',
            borderRadius: 2,
            borderBottomRightRadius: isOwn ? 0 : 16,
            borderBottomLeftRadius: isOwn ? 16 : 0,
          }}
        >
          <Typography variant="body2">{message.text}</Typography>
        </Paper>
        
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            mx: 1,
            color: 'text.secondary',
            textAlign: isOwn ? 'right' : 'left',
          }}
        >
          {formatTime(message.timestamp)}
          {isOwn && message.read && ' • Read'}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;