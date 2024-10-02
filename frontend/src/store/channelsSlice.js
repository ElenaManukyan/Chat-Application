import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';  
import axios from 'axios';

export const addChannel = createAsyncThunk(
    'channels/addChannel', 
    async (newChannel) => {
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/v1/channels', newChannel, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        return response.data;  
});

export const editChannel = createAsyncThunk(
    'channels/editChannel', 
    async (editedChannel) => {
        const token = localStorage.getItem('token');
        const response = await axios.patch('/api/v1/channels/3', editedChannel, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        return response.data;  
}); 

export const removeChannel = createAsyncThunk(
    'channels/removeChannel', 
    async () => {
        const token = localStorage.getItem('token');
        const response = axios.delete('/api/v1/channels/3', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return response.data;  
}); 

const channelsSlice = createSlice({  
  name: 'channels',  
  initialState: {  
    channels: [],
    currentChannelId: 1,
  },  
  reducers: {
    setCurrentChannelId: (state, action) => {
      // console.log(`action.payload= ${JSON.stringify(action.payload, null, 2)}`);
      state.currentChannelId = action.payload;
    },
  },
  extraReducers: (builder) => {  
    builder  
        .addCase(addChannel.fulfilled, (state, action) => {  
            state.channels.push(action.payload);  
        })
        .addCase(editChannel.fulfilled, (state, action) => {
            console.log(`channelsSlice editChannel action.payload= ${JSON.stringify(action.payload, null, 2)}`);
            // state.channels.push(action.payload);  
        })
        .addCase(removeChannel.fulfilled, (state, action) => {
            console.log(`channelsSlice removeChannel action.payload= ${JSON.stringify(action.payload, null, 2)}`);
            // state.channels.push(action.payload);
            const index = state.channels.findIndex((channel) => channel.id === action.payload);
            if (index >= 0) {
                state.channels.splice(index, 1);
            }
        });
  },  
});  

export const { setCurrentChannelId } = channelsSlice.actions;
export default channelsSlice.reducer;