import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import ProfileForm from '../components/profile/ProfileForm';
import PhotoUpload from '../components/profile/PhotoUpload';
import InterestSelector from '../components/profile/InterestSelector';
import PreferencesForm from '../components/profile/PreferencesForm';
import { profileApi } from '../services/api/profiles';
import { useAuth } from '../contexts/AuthContext';

const steps = ['Basic Info', 'Photos', 'Interests', 'Preferences'];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, checkAuthState } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    profile: {
      name: user?.name || '',
      age: '',
      bio: '',
      gender: '',
      location: {},
    },
    photos: [],
    interests: [],
    preferences: {
      ageRange: [21, 35],
      maxDistance: 50,
      genderPreference: 'all',
      dealBreakers: [],
    },
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleUpdateData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleComplete = async () => {
    try {
      await profileApi.createProfile(formData);
      await checkAuthState();
      navigate('/duo-setup');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ProfileForm
            data={formData.profile}
            onUpdate={(data) => handleUpdateData('profile', data)}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <PhotoUpload
            photos={formData.photos}
            onUpdate={(photos) => handleUpdateData('photos', photos)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <InterestSelector
            selected={formData.interests}
            onUpdate={(interests) => handleUpdateData('interests', interests)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <PreferencesForm
            data={formData.preferences}
            onUpdate={(data) => handleUpdateData('preferences', data)}
            onNext={handleComplete}
            onBack={handleBack}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Complete Your Profile
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mt: 3, mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {activeStep === steps.length ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" gutterBottom>
                All steps completed - you're ready to find your match!
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/duo-setup')}
                sx={{ mt: 2 }}
              >
                Continue
              </Button>
            </Box>
          ) : (
            <Box>
              {getStepContent(activeStep)}
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Onboarding;