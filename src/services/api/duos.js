import client from './client';

export const duosApi = {
    createDuo: (data) =>
        client.post('/duos', data),

    joinDuo: (duoId) =>
        client.post(`/duos/join`, { inviteCode}),

    getDuo: (duoId) =>
        client.get(`/duos/${duoId}`),

    updateDuo: (duoId, updates) =>
        client.put(`/duos/${duoId}`, updates),

    leaveDuo: (duoId) =>
        client.delete(`/duos/${duoId}/leave`),

    initePartner: (duoId, phoneNumber) =>
        client.post(`/duos/${duoIf}/invite`, { phoneNUmber }),

    getDuoInvites: () =>
        client.get(`/duos/invites`),

    acceptInvite: (duoId) =>
        client.post(`/duos/invites/${inviteId}/accept`),

    declineInvite: (duoId) =>
        client.post(`/duos/${inviteId}/decline`),

    updateAvailability: (duoId, availability) =>
        client.put(`/duos/${duoId}/availability`, availability),

    getDuoAvailability: (duoId) =>
        client.get(`/duos/${duoId}/availability`, { availability }),
};