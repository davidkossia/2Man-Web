import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Chip,
  Select,
  MenuItem,
  OutlinedInput,
  Grid,
} from '@mui/material';

const dealBreakerOptions = [
  'Smoking',
  'Drugs',
  'No kids',
  'Wants kids',
  'Conservative',
  'Liberal',
  'Not vaccinated',
  'Allergic to pets',
  'Heavy drinking',
  'No drinking',
];

const PreferencesForm = ({ data, onUpdate, onNext, onBack }) => {
  const [preferences, setPreferences] = useState({
    ageRange: data.ageRange || [21, 35],
    maxDistance: data.maxDistance || 50,
    genderPreference: data.genderPreference || 'all',
    dealBreakers: data.dealBreakers || [],
  });

  const handleAgeChange = (event, newValue) => {
    setPreferences({ ...preferences, ageRange: newValue });
  };

  const handleDistanceChange = (event, newValue) => {
    setPreferences({ ...preferences, maxDistance: newValue });
  };

  const handleGenderChange = (event) => {
    setPreferences({ ...preferences, genderPreference: event.target.value });
  };

  const handleDealBreakerChange = (event) => {
    setPreferences({ ...preferences, dealBreakers: event.target.value });
  };

  const handleSubmit = () => {
    onUpdate(preferences);
    onNext();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Dating Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Help us find the perfect match for your duo
      </Typography>

      <Grid container spacing={4}>
        {/* Age Range */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel>Age Range</FormLabel>
            <Box sx={{ px: 2, pt: 3 }}>
              <Slider
                value={preferences.ageRange}
                onChange={handleAgeChange}
                valueLabelDisplay="on"
                min={18}
                max={65}
                marks={[
                  { value: 18, label: '18' },
                  { value: 30, label: '30' },
                  { value: 45, label: '45' },
                  { value: 65, label: '65+' },
                ]}
              />
            </Box>
          </FormControl>
        </Grid>

        {/* Distance */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel>Maximum Distance</FormLabel>
            <Box sx={{ px: 2, pt: 3 }}>
              <Slider
                value={preferences.maxDistance}
                onChange={handleDistanceChange}
                valueLabelDisplay="on"
                valueLabelFormat={(value) => `${value} km`}
                min={5}
                max={200}
                step={5}
                marks={[
                  { value: 5, label: '5 km' },
                  { value: 50, label: '50 km' },
                  { value: 100, label: '100 km' },
                  { value: 200, label: '200 km' },
                ]}
              />
            </Box>
          </FormControl>
        </Grid>

        {/* Gender Preference */}
        <Grid item xs={12}>
          <FormControl>
            <FormLabel>Show us duos with</FormLabel>
            <RadioGroup
              value={preferences.genderPreference}
              onChange={handleGenderChange}
              sx={{ mt: 1 }}
            >
              <FormControlLabel value="male" control={<Radio />} label="Men only" />
              <FormControlLabel value="female" control={<Radio />} label="Women only" />
              <FormControlLabel value="all" control={<Radio />} label="Everyone" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Deal Breakers */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <FormLabel>Deal Breakers</FormLabel>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
              We won't show you duos with these traits
            </Typography>
            <Select
              multiple
              value={preferences.dealBreakers}
              onChange={handleDealBreakerChange}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {dealBreakerOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack}>Back</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Complete Profile
        </Button>
      </Box>
    </Box>
  );
};

export default PreferencesForm;