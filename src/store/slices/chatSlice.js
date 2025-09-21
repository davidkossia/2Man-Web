import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    conversations: {},
    activeConversation: null,
    typing: {},
    unreadCounts: {},
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: 'chat',
    initalState,
    reducers: {
        setMessages: (state, action) => {
            const { matchId, messages } = action.payload;
            state.conversations[matchId] = messages;
        },
        addMessage: (state, action) => {
            const { matchId, message } = action.payload;
            if (!state.conversations[matchId]) {
                state.conversations[matchId] = [];
            }
            state.conversations[matchId].push(message);
        },
        setActiveConversation: (state, action) => {
            state.activeConversation = action.payload;
        },
        setTyping: (state, action) => {
            const { matchId, isTyping } = action.payload;
            if (!state.typing[matchId]) {
                state.typing[matchId] = {};
            }
            if (isTyping) {
                state.typing[matchId][userid] = true;
            } else {
                delete state.typing[matchId][userid];
            }
        },
        markAsRead: (state, action) => {
            const matchId = action.payload;
            state.unreadCouints[matchId] = 0;
        },
        incrementUnread: (state, action) => {
            const matchId = action.payload;
            state.unreadCounts[matchId] = (state.unreadCounts[matchId] || 0) + 1;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },       
    },
});

export const {
    setMessages,
    addMessage,
    setActiveConversation,
    setTyping,
    markAsRead,
    incrementUndread,
    setLoading,
    setError,
} = chatSlice.actions;

export default chatSlice.reducer;
