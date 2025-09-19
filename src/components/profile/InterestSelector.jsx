import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const interestCategories = {
  'Activities': [
    'Hiking', 'Yoga', 'Running', 'Gym', 'Dancing', 'Swimming', 'Cycling', 'Rock Climbing',
    'Martial Arts', 'Tennis', 'Golf', 'Basketball', 'Volleyball', 'Skiing', 'Surfing'
  ],
  'Entertainment': [
    'Movies', 'Music', 'Concerts', 'Theater', 'Comedy Shows', 'Museums', 'Art Galleries',
    'Karaoke', 'Board Games', 'Video Games', 'Reading', 'Podcasts', 'TV Shows'
  ],
  'Food & Drink': [
    'Cooking', 'Wine Tasting', 'Coffee', 'Craft Beer', 'Foodie', 'Baking', 'BBQ',
    'Vegetarian', 'Vegan', 'Sushi', 'Italian Food', 'Mexican Food', 'Asian Cuisine'
  ],
  'Lifestyle': [
    'Travel', 'Photography', 'Fashion', 'Pets', 'Dogs', 'Cats', 'Gardening',
    'DIY Projects', 'Meditation', 'Volunteering', 'Environmental', 'Politics'
  ],
  'Social': [
    'Nightlife', 'Bars', 'Clubs', 'House Parties', 'Game Nights', 'Trivia',
    'Happy Hour', 'Brunch', 'Picnics', 'Festivals', 'Live Music', 'Networking'
  ],
};

const InterestSelector = ({ selected = [], onUpdate, onNext, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterests, setSelectedInterests] = useState(new Set(selected));
  const maxInterests = 10;
  const minInterests = 3;

  const handleToggleInterest = (interest) => {
    const newSelected = new Set(selectedInterests);
    
    if (newSelected.has(interest)) {
      newSelected.delete(interest);
    } else if (newSelected.size < maxInterests) {
      newSelected.add(interest);
    }
    
    setSelectedInterests(newSelected);
  };

  const handleContinue = () => {
    onUpdate(Array.from(selectedInterests));
    onNext();
  };

  const filteredCategories = Object.entries(interestCategories).reduce((acc, [category, interests]) => {
    const filtered = interests.filter(interest =>
      interest.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Your Interests
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose {minInterests}-{maxInterests} interests that best describe you and your duo
      </Typography>

      <TextField
        fullWidth
        placeholder="Search interests..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        />
  
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Selected: {selectedInterests.size}/{maxInterests}
          </Typography>
        </Box>
  
        {Object.entries(filteredCategories).map(([category, interests]) => (
          <Paper key={category} elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
              {category}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {interests.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  onClick={() => handleToggleInterest(interest)}
                  color={selectedInterests.has(interest) ? 'primary' : 'default'}
                  variant={selectedInterests.has(interest) ? 'filled' : 'outlined'}
                  disabled={!selectedInterests.has(interest) && selectedInterests.size >= maxInterests}
                  sx={{
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>
        ))}
  
        {selectedInterests.size > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'white' }}>
              Your selected interests:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Array.from(selectedInterests).map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  onDelete={() => handleToggleInterest(interest)}
                  size="small"
                  sx={{ bgcolor: 'white', color: 'primary.main' }}
                />
              ))}
            </Box>
          </Box>
        )}
  
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button onClick={onBack}>Back</Button>
          <Button
            variant="contained"
            onClick={handleContinue}
            disabled={selectedInterests.size < minInterests}
          >
            Continue
          </Button>
        </Box>
      </Box>
    );
  };
  
  export default InterestSelector;