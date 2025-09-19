import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  AvatarGroup,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import MessageBubble from '../components/chat/MessageBubble';
import { useChat } from '../hooks/useChat';

const Chat = () => {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const { messages, sendMessage, matchDetails, loading } = useChat(matchId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading || !matchDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/matches')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <AvatarGroup max={2} sx={{ mr: 2 }}>
            <Avatar src={matchDetails.duo.members[0].photo} sx={{ width: 40, height: 40 }} />
            <Avatar src={matchDetails.duo.members[1].photo} sx={{ width: 40, height: 40 }} />
          </AvatarGroup>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">
              {matchDetails.duo.name}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {matchDetails.duo.members[0].name} & {matchDetails.duo.members[1].name}
            </Typography>
          </Box>
          
          <IconButton color="inherit">
            <VideoCallIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Container maxWidth="md">
          {/* Match notification */}
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Chip
              label={`Matched on ${format(new Date(matchDetails.matchedAt), 'MMMM d, yyyy')}`}
              size="small"
              sx={{ bgcolor: 'primary.light', color: 'white' }}
            />
          </Box>

          {/* Message list */}
          {messages.map((msg, index) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === matchDetails.currentUserId}
              showAvatar={
                index === 0 ||
                messages[index - 1].senderId !== msg.senderId ||
                new Date(msg.timestamp) - new Date(messages[index - 1].timestamp) > 300000
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </Container>
      </Box>

      {/* Input */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <IconButton size="small">
              <AttachFileIcon />
            </IconButton>
            
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: 'grey.100',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <EmojiEmotionsIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!message.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
                '&:disabled': { bgcolor: 'grey.300' },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default Chat;