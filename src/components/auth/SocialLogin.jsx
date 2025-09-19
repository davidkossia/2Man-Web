import React from 'react';
import { Box, Button, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import AppleIcon from '@mui/icons-material/Apple';
import { Auth } from 'aws-amplify';

const SocialLogin = () => {
  const handleSocialSignIn = async (provider) => {
    try {
      await Auth.federatedSignIn({ provider });
    } catch (error) {
      console.error('Social sign in error:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<GoogleIcon />}
        onClick={() => handleSocialSignIn('Google')}
        sx={{
          borderColor: 'grey.300',
          color: 'text.primary',
          '&:hover': {
            borderColor: 'grey.400',
            bgcolor: 'grey.50',
          },
        }}
      >
        Continue with Google
      </Button>
      
      <Button
        fullWidth
        variant="outlined"
        startIcon={<FacebookIcon />}
        onClick={() => handleSocialSignIn('Facebook')}
        sx={{
          borderColor: '#1877f2',
          color: '#1877f2',
          '&:hover': {
            borderColor: '#1877f2',
            bgcolor: 'rgba(24, 119, 242, 0.04)',
          },
        }}
      >
        Continue with Facebook
      </Button>
      
      <Button
        fullWidth
        variant="outlined"
        startIcon={<AppleIcon />}
        onClick={() => handleSocialSignIn('SignInWithApple')}
        sx={{
          borderColor: 'black',
          color: 'black',
          '&:hover': {
            borderColor: 'black',
            bgcolor: 'grey.50',
          },
        }}
      >
        Continue with Apple
      </Button>
    </Box>
  );
};

export default SocialLogin;