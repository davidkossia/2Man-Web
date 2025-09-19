import client from './client';

export const profileApi = {
  createProfile: (data) => client.post('/profiles', data),
  
  getProfile: () => client.get('/profiles/me'),
  
  updateProfile: (updates) => client.put('/profiles/me', updates),
  
  uploadPhoto: (photoData) => client.post('/profiles/photos', photoData),
  
  deletePhoto: (photoId) => client.delete(`/profiles/photos/${photoId}`),
  
  updatePreferences: (preferences) => client.put('/profiles/preferences', preferences),
  
  getProfileById: (userId) => client.get(`/profiles/${userId}`),
};