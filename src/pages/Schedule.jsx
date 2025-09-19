import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  AvatarGroup,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import MovieIcon from '@mui/icons-material/Movie';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays, setHours } from 'date-fns';
import { schedulingApi } from '../services/api/scheduling';

const steps = ['Select Date & Time', 'Choose Activity', 'Pick Venue', 'Confirm'];

const activityTypes = [
  { id: 'dinner', label: 'Dinner', icon: <RestaurantIcon /> },
  { id: 'drinks', label: 'Drinks', icon: <LocalBarIcon /> },
  { id: 'movie', label: 'Movie', icon: <MovieIcon /> },
  { id: 'activity', label: 'Activity', icon: <SportsEsportsIcon /> },
];

const Schedule = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [matchDetails, setMatchDetails] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(false);
  
  const [scheduleData, setScheduleData] = useState({
    date: addDays(new Date(), 2),
    time: setHours(new Date(), 19),
    activityType: 'dinner',
    venue: null,
    message: '',
  });

  const [venues, setVenues] = useState([]);
  const [proposedSlots, setProposedSlots] = useState([]);

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  useEffect(() => {
    if (activeStep === 2 && scheduleData.activityType) {
      fetchVenues();
    }
  }, [activeStep, scheduleData.activityType]);

  const fetchMatchDetails = async () => {
    try {
      const response = await schedulingApi.getMatchDetails(matchId);
      setMatchDetails(response.data);
      
      // Load any existing proposed slots
      if (response.data.proposedSlots) {
        setProposedSlots(response.data.proposedSlots);
      }
    } catch (error) {
      console.error('Failed to fetch match details:', error);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await schedulingApi.getVenueSuggestions({
        activityType: scheduleData.activityType,
        location: matchDetails.midpointLocation,
        date: scheduleData.date,
      });
      setVenues(response.data);
    } catch (error) {
      console.error('Failed to fetch venues:', error);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleDateChange = (newDate) => {
    setScheduleData({ ...scheduleData, date: newDate });
  };

  const handleTimeChange = (newTime) => {
    setScheduleData({ ...scheduleData, time: newTime });
  };

  const handleActivityChange = (event, newActivity) => {
    if (newActivity !== null) {
      setScheduleData({ ...scheduleData, activityType: newActivity });
    }
  };

  const handleVenueSelect = (venue) => {
    setScheduleData({ ...scheduleData, venue });
  };

  const handlePropose = async () => {
    setLoading(true);
    try {
      await schedulingApi.proposeDate({
        matchId,
        ...scheduleData,
      });
      setConfirmDialog(true);
    } catch (error) {
      console.error('Failed to propose date:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  When would you like to meet?
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date"
                  value={scheduleData.date}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Time"
                  value={scheduleData.time}
                  onChange={handleTimeChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              {proposedSlots.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Or choose from their suggested times:
                  </Typography>
                  <List>
                    {proposedSlots.map((slot) => (
                      <ListItem
                        key={slot.id}
                        button
                        onClick={() => {
                          setScheduleData({
                            ...scheduleData,
                            date: new Date(slot.date),
                            time: new Date(slot.time),
                          });
                        }}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemIcon>
                          <EventIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={format(new Date(slot.date), 'EEEE, MMMM d')}
                          secondary={format(new Date(slot.time), 'h:mm a')}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              )}
            </Grid>
          </LocalizationProvider>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              What would you like to do?
            </Typography>
            <ToggleButtonGroup
              value={scheduleData.activityType}
              exclusive
              onChange={handleActivityChange}
              sx={{ mt: 2 }}
            >
              {activityTypes.map((activity) => (
                <ToggleButton
                  key={activity.id}
                  value={activity.id}
                  sx={{
                    flexDirection: 'column',
                    p: 3,
                    minWidth: 120,
                  }}
                >
                  {activity.icon}
                  <Typography variant="caption" sx={{ mt: 1 }}>
                    {activity.label}
                  </Typography>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Choose a venue
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {venues.map((venue) => (
                <Grid item xs={12} key={venue.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: scheduleData.venue?.id === venue.id ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                    onClick={() => handleVenueSelect(venue)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h6">{venue.name}</Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {venue.cuisine || venue.type}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip
                              icon={<LocationOnIcon />}
                              label={`${venue.distance} km`}
                              size="small"
                            />
                            <Chip label={venue.priceRange} size="small" />
                            <Chip label={`★ ${venue.rating}`} size="small" color="primary" />
                          </Box>
                        </Box>
                        <Box>
                          <img
                            src={venue.image}
                            alt={venue.name}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 8,
                            }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review your date proposal
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon color="primary" />
                    <Typography>
                      {format(scheduleData.date, 'EEEE, MMMM d, yyyy')} at{' '}
                      {format(scheduleData.time, 'h:mm a')}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon color="primary" />
                    <Typography>
                      {scheduleData.venue?.name} - {scheduleData.venue?.address}
                    </Typography>
                    </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Add a message (optional)"
                    value={scheduleData.message}
                    onChange={(e) => setScheduleData({ ...scheduleData, message: e.target.value })}
                    placeholder="Looking forward to meeting you both!"
                  />
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                The other duo will be notified of your proposal and can accept, suggest alternatives, or decline.
              </Typography>
            </Box>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  if (!matchDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AvatarGroup max={2} sx={{ mr: 2 }}>
              <Avatar src={matchDetails.duo.members[0].photo} />
              <Avatar src={matchDetails.duo.members[1].photo} />
            </AvatarGroup>
            <Typography variant="h5">
              Schedule a date with {matchDetails.duo.name}
            </Typography>
          </Box>
          
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Step content */}
        <Box sx={{ minHeight: 300 }}>
          {getStepContent(activeStep)}
        </Box>

        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/matches')}
            >
              Cancel
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handlePropose}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Send Proposal'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && (!scheduleData.date || !scheduleData.time)) ||
                  (activeStep === 2 && !scheduleData.venue)
                }
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Success dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Date Proposal Sent!</DialogTitle>
        <DialogContent>
          <Typography>
            Your date proposal has been sent to {matchDetails.duo.name}. 
            We'll notify you when they respond!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/matches')} variant="contained">
            Back to Matches
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Schedule;