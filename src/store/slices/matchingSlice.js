import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    candidates: [],
    matches: [],
    currentCandidate: null,
    filters: {
        ageRange: [18, 30],
        maxDistance: 50,
        interests: [],
    },
    loading: false,
    error: null,
};

const matchingSlice = createSlice({
    name: 'matching',
    initialState,
    reducers: {
        setCandidates: (state, action) => {
            state.candidates = action.payload;
        },
        removeCandidate: (state, action) => {
            state.candidates = state.candidates.filter(c => c.id !== action.payload);
        },
        setCurrentCandidate: (state, action) => {
            state.currentCandidate = action.payload;
        },
        addMatch: (state, action) => {
            state.matches.unshift(action.payload);
        },
        setmatches: (state, action) => {
            state.matches = action.payload;
        },
        removeMatch: (state, action) => {
            state.fmatches = state.matches.filter(m => m.id !== action.payload);
        },
        updateFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
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
    setCandidates,
    removeCandidate,
    setCurrentCandidate,
    addMatch,
    setMatches,
    removeMatch,
    updateFilters,
    setLoading,
    setError,
} = matchingSlice.actions;

export default matchingSlice.reducer;
