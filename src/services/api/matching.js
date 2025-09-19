import client from './client';

export const matchingApi = {
  getCandidates: (params = {}) => 
    client.get('/matching/candidates', { params }),
  
  swipe: (duoId, action) => 
    client.post(`/matching/swipe`, { duoId, action }),
  
  getMatches: (params = {}) => 
    client.get('/matching/matches', { params }),
  
  unmatch: (matchId) => 
    client.delete(`/matching/matches/${matchId}`),
  
  reportDuo: (duoId, reason) => 
    client.post('/matching/report', { duoId, reason }),
};