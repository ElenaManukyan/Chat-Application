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
        data: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});

export default chatSlice.reducer;