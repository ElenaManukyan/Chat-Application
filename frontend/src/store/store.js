import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import messagesReducer from './messagesSlice';
import channelsReducer from './channelsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        messages: messagesReducer,
        channels: channelsReducer,
    },
});

export default store;