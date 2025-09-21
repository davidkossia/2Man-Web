import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authslice';
import profileReducer from './slices/profileSlice';
import duoReducer from './slices/duoSlice';
import matchingReducer from './slices/matchingSlice';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';
import apiMiddleware from './middleware/apiMiddleware';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        duo: duoReducer,
        matching: matchingReducer,
        chat: chatReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['auth/setUser'],
                ignoredPaths: ['auth.user'],
            },
        }).concat(apiMiddleware),
    });

    export default store;