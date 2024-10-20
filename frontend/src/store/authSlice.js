import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }) => {
        const response = await axios.post('/api/v1/login', { username, password });
        return response.data;
});


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        username: localStorage.getItem('username') || null,
        token: localStorage.getItem('token') || null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                state.username = action.payload.username;
                localStorage.setItem('username', action.payload.username);
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    },
});

export default authSlice.reducer;