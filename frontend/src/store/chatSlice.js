import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchChannels = createAsyncThunk(
    'chat/fetchChannels',
    async () => {
        const token = localStorage.getItem('token');
        console.log(`token fetchChannels= ${JSON.stringify(token, null, 2)}`);
        // Get channels
        const response = await axios.get('/api/v1/channels', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data); // =>[{ id: '1', name: 'general', removable: false }, ...]
          return response.data;
    },
);

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async () => {
        const token = localStorage.getItem('token');
        console.log(`token fetchMessages= ${JSON.stringify(token, null, 2)}`);
        // Get messages
        const response = await axios.get('/api/v1/messages', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // console.log(response.data); // =>[{ id: '1', body: 'text message', channelId: '1', username: 'admin }, ...]
          return response.data;
    },
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        channels: [],
        messages: [],
        channelsStatus: 'idle',
        messagesStatus: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchChannels.pending, (state) => {
                state.channelsStatus = 'loading';
            })
            .addCase(fetchChannels.fulfilled, (state, action) => {
                // console.log('fetchChannels.fulfilled', action.payload);
                state.channelsStatus = 'succeeded';
                // console.log(`state.channels= ${JSON.stringify(state.channels, null, 2)}`);
                state.channels = action.payload;
            })
            .addCase(fetchChannels.rejected, (state, action) => {
                state.channelsStatus = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchMessages.pending, (state) => {
                state.messagesStatus = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messagesStatus = 'succeeded';
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.messagesStatus = 'failed';
                state.error = action.error.message;
            })
    },
});

export default chatSlice.reducer;