import cleint from './client';

export const chatApi = {
    getMessages: (matchId, params = {}) =>
        client.get(`/matches/${matchId}/messages`, { params }),

    sendMessage: (matchId, data) =>
        client.post(`/matches/${matchId}/messages`, data),

    markAsRead: (matchId) =>
        client.put(`/chat/${matchId}/read`),

    getMatchDetails: (matchId) =>
        client.get(`/matches/${matchId}/details`),

    deleteMessage: (matchId, messageId) =>
        client.delete(`/matches/${matchId}/messages/${messageId}`),
};