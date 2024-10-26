import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const login = createAsyncThunk(
    'auth/login',
    async (data) => {
        const response = await axios.post('/api/v1/login', data);
        console.log(response.data);
        return response.data;
        
});

export const signup = createAsyncThunk(
    'auth/signup',
    async ({ username, password }) => {
        try {
            const response = await axios.post('/api/v1/signup', { username, password });
            return response.data;
        } catch (error) {
            console.log(error);
            if (error.response) {
                throw new Error(error.response.data.statusCode || 'Ошибка при регистрации');
            } else {
                // Ошибка при настройке запроса
                throw new Error('Ошибка сети');
            }
        }
    });


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        username: localStorage.getItem('username') || null,
        token: localStorage.getItem('token') || null,
        isAuthorized: false,
    },
    reducers: {
        setAuthorized: (state, action) => {
            state.isAuthorized = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(login.fulfilled, (state, action) => {
                //console.log(`action.payload= ${JSON.stringify(action.payload, null, 2)}`);
                state.status = 'succeeded';
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                state.username = action.payload.username;
                localStorage.setItem('username', action.payload.username);
                state.isAuthorized = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(signup.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                state.username = action.payload.username;
                localStorage.setItem('username', action.payload.username);
                state.isAuthorized = true;
            })
            .addCase(signup.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                // console.log(state.error); // type string
            })
    },
});

export const { setAuthorized } = authSlice.actions;
export default authSlice.reducer;