import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { differenceInYears } from 'date-fns';

const ProfileForm = ({ data, onUpdate, onNext }) => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: data.name || '',
    dateOfBirth: data.dateOfBirth || null,
    gender: data.gender || '',
    bio: data.bio || '',
    location: data.location || '',
  });

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const age = differenceInYears(new Date(), new Date(formData.dateOfBirth));
      if (age < 18) newErrors.dateOfBirth = 'You must be at least 18 years old';
    }
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.bio || formData.bio.length < 20) {
      newErrors.bio = 'Bio must be at least 20 characters';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      const age = differenceInYears(new Date(), new Date(formData.dateOfBirth));
      onUpdate({ ...formData, age });
      onNext();
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Name"
          value={formData.name}
          onChange={handleChange('name')}
          error={!!errors.name}
          helperText={errors.name}
          required
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(newValue) => {
              setFormData({ ...formData, dateOfBirth: newValue });
              if (errors.dateOfBirth) {
                setErrors({ ...errors, dateOfBirth: null });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                required
              />
            )}
            maxDate={new Date()}
          />
        </LocalizationProvider>

        <FormControl fullWidth error={!!errors.gender} required>
          <InputLabel>Gender</InputLabel>
          <Select
            value={formData.gender}
            onChange={handleChange('gender')}
            label="Gender"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="non-binary">Non-binary</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
          {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
        </FormControl>

        <TextField
          fullWidth
          label="Bio"
          value={formData.bio}
          onChange={handleChange('bio')}
          multiline
          rows={4}
          error={!!errors.bio}
          helperText={errors.bio || `${formData.bio.length}/500 characters`}
          inputProps={{ maxLength: 500 }}
          placeholder="Tell us about yourself..."
          required
        />

        <TextField
          fullWidth
          label="Location"
          value={formData.location}
          onChange={handleChange('location')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon />
              </InputAdornment>
            ),
          }}
          placeholder="City, State"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          sx={{ mt: 2 }}
        >
          Continue
        </Button>
      </Box>
    </form>
  );
};

export default ProfileForm;