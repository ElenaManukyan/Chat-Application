import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import chatReducer from './chatSlice';
import channelsReducer from './channelsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        channels: channelsReducer,
    },
});

export default store;