import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async () => {
        const token = localStorage.getItem('token');
        // console.log(`token fetchData= ${JSON.stringify(token, null, 2)}`);
        const response = await axios.get('/api/v1/messages', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          //console.log(response.data); // =>[{ id: '1', body: 'text message', channelId: '1', username: 'admin }, ...]
          return response.data;
    },
);

export const addMessage = createAsyncThunk(
    'chat/addMessage',
    async (newMessage) => {
        const token = localStorage.getItem('token');
        // console.log(`token fetchData= ${JSON.stringify(token, null, 2)}`);
        const response = await axios.post('/api/v1/messages', newMessage, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data;
    },
);

export const removeMessage = createAsyncThunk(
    'chat/removeMessage',
    async (id) => {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`/api/v1/messages/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response.data;
    },
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        addMessageReducers(state, action) {
            state.messages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                //console.log(`chatSlice action.payload= ${JSON.stringify(action.payload, null, 2)}`);
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addMessage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addMessage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                //console.log(`chatSlice action.payload= ${JSON.stringify(action.payload, null, 2)}`);
                state.messages.push(action.payload);
            })
            .addCase(addMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(removeMessage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeMessage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                //console.log(`chatSlice action.payload= ${JSON.stringify(action.payload, null, 2)}`);
                
                const index = state.messages.findIndex((message) => message.id === action.payload);
                if (index >= 0) {
                    state.messages.splice(index, 1);
                }
                
            })
            .addCase(removeMessage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});

export const { addMessageReducers } = chatSlice.actions;

export default chatSlice.reducer;