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
  async ({ id, editedChannel }) => {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`/api/v1/channels/${id}`, editedChannel, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data;  
  }
);


export const removeChannel = createAsyncThunk(
    'channels/removeChannel', 
    async (id) => {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`/api/v1/channels/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        return response.data.id;  
});

export const fetchChannels = createAsyncThunk(
  'chat/fetchChannels',
  async () => {
      const token = localStorage.getItem('token');
      // console.log(`token fetchData= ${JSON.stringify(token, null, 2)}`);
      const response = await axios.get('/api/v1/channels', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        //console.log(response.data); // =>[{ id: '1', name: 'general', removable: false }, ...]
        return response.data;
  },
);

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
          const index = state.channels.findIndex(channel => channel.id === action.payload.id);
          if (index >= 0) {
              state.channels[index] = action.payload; // Обновление существующего канала
          }
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
          //console.log(`channelsSlice removeChannel action.payload= ${JSON.stringify(action.payload, null, 2)}`);
          //console.log(`removeChannel.fulfilled action.payload= ${JSON.stringify(action.payload, null, 2)}`);
          const index = state.channels.findIndex((channel) => channel.id === action.payload);
          if (index >= 0) {
              state.channels.splice(index, 1);
          }
      })
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
          state.status = 'succeeded';
          //console.log(`chatSlice action.payload= ${JSON.stringify(action.payload, null, 2)}`);
          state.channels = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
      })
  },  
});  

export const { setCurrentChannelId } = channelsSlice.actions;
export default channelsSlice.reducer;