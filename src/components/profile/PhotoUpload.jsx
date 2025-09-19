import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { uploadPhoto } from '../../services/aws/s3Upload';
import { verifyPhoto } from '../../services/aws/rekognition';

const PhotoUpload = ({ photos, onUpdate, onNext, onBack }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const maxPhotos = 6;

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Verify photo content
      const verificationResult = await verifyPhoto(file);
      if (!verificationResult.safe) {
        setError('Photo contains inappropriate content');
        setUploading(false);
        return;
      }

      // Upload to S3
      const photoUrl = await uploadPhoto(file);
      onUpdate([...photos, { url: photoUrl, id: Date.now() }]);
    } catch (err) {
      setError('Failed to upload photo');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (photoId) => {
    onUpdate(photos.filter(photo => photo.id !== photoId));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdate(items);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Add Photos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add up to {maxPhotos} photos. Your first photo will be your main photo.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="photos" direction="horizontal">
          {(provided) => (
            <Grid
              container
              spacing={2}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {photos.map((photo, index) => (
                <Draggable key={photo.id} draggableId={photo.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <Grid
                      item
                      xs={6}
                      sm={4}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card
                        sx={{
                          position: 'relative',
                          paddingTop: '100%',
                          opacity: snapshot.isDragging ? 0.5 : 1,
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `url(${photo.url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        {index === 0 && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              bgcolor: 'primary.main',
                              color: 'white',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                            }}
                          >
                            Main
                          </Box>
                        )}
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              bgcolor: 'rgba(0,0,0,0.7)',
                            },
                          }}
                          size="small"
                          onClick={() => handleDelete(photo.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Card>
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {photos.length < maxPhotos && (
                <Grid item xs={6} sm={4}>
                  <Card
                    sx={{
                      position: 'relative',
                      paddingTop: '100%',
                      cursor: 'pointer',
                      border: '2px dashed',
                      borderColor: 'divider',
                      bgcolor: 'background.default',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <input
                        accept="image/*"
                        type="file"
                        id="photo-upload"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                        disabled={uploading}
                      />
                      <label htmlFor="photo-upload" style={{ cursor: 'pointer' }}>
                        {uploading ? (
                          <CircularProgress size={40} />
                        ) : (
                          <>
                            <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              Add Photo
                            </Typography>
                          </>
                        )}
                      </label>
                    </Box>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack}>Back</Button>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={photos.length < 2}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default PhotoUpload;