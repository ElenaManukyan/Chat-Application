import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

export const fetchData = createAsyncThunk(
    'chat/fetchData',
    async () => {
        const token = localStorage.getItem('token');
        console.log(`token fetchData= ${JSON.stringify(token, null, 2)}`);
        const response = await axios.get('api/v1/data', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data); // =>[{ id: '1', name: 'general', removable: false }, ...]
          return response.data;
    },
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        /*data: [],*/
        data: {
            channels: [],
            messages: [],
        },
        status: 'idle',
        error: null,
    },
    reducers: {
        addMessage(state, action) {
            state.data.messages.push(action.payload);
        },
        setChannels(state, action) {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                console.log(`chatSlice action.payload= ${JSON.stringify(action.payload, null, 2)}`);
                state.data.channels = action.payload.channels;
                state.data.messages = action.payload.messages;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});

export const { addMessage, setChannels } = chatSlice.actions;

export default chatSlice.reducer;