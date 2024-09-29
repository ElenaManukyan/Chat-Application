import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        username: localStorage.getItem('username') || null,
        token: localStorage.getItem('token') || null,
    },
    reducers: {
        setToken(state, action) {
            state.token = action.payload;
        },
        addUsername(state, action) {
            state.username = action.payload;
        },
        clearToken(state) {
            state.token = null;
            localStorage.removeItem('token');
        },
    },
});

export const { setToken, clearToken, addUsername } = authSlice.actions;
export default authSlice.reducer;