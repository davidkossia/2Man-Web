import client from './client';

export const authApi = {
  verifyPhone: (phoneNumber) => 
    client.post('/auth/verify-phone', { phoneNumber }),
  
  confirmPhone: (phoneNumber, code) => 
    client.post('/auth/confirm-phone', { phoneNumber, code }),
  
  updatePassword: (oldPassword, newPassword) => 
    client.post('/auth/change-password', { oldPassword, newPassword }),
  
  deleteAccount: (reason) => 
    client.post('/auth/delete-account', { reason }),
  
  exportData: () => 
    client.get('/auth/export-data'),
  
  updatePrivacySettings: (settings) => 
    client.put('/auth/privacy', settings),
};