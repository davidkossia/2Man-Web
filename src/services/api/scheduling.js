import client from './client';

export const schedulingApi = {
    proposeDate: (data) =>
        client.post('/scheduling/propose', data),

    getProposals: (matchId) =>
        client.get(`/scheduling/matches/${matchId}/proposals`),

    acceptProposal: (proposalId) =>
        client.post(`/scheduling/proposals/${proposalId}/accept`),

    declineProposal: (proposalId) =>
        client.post(`/scheduling/proposals/${proposalId}/decline`),

    suggestAlternative: (proposalId, alternative) =>
        client.post(`/scheduling/proposals/${proposalId}/alternative`, alternative),

    getVenueSuggestions: (params) =>
        client.get(`/scheduling/venues`, {params}),

    getMatchDetails: (matchId) =>
        client.get(`/scheduling/matches/${matchId}`),

    confirmDate: (dateId) =>
        client.post(`/scheduling/dates/${dateId}/confirm`),

    cancelDate: (dateId, reason) =>
        client.post(`/scheduling/dates/${dateId}/cancel`, { reason }),

    getUpcomingDates: () =>
        client.get('/scheduling/dates/upcoming'),

    rateDate: (dateId, rating) =>
        client.post(`/scheduling/dates/${dateId}/rate`, { rating }),
    };