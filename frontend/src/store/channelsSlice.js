import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import i18next from 'i18next';

export const addChannel = createAsyncThunk('channels/addChannel', async (newChannel, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('/api/v1/channels', newChannel, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message || i18next.t('errors.addChannelErr'));
  }
});

export const editChannel = createAsyncThunk('channels/editChannel', async ({ id, editedChannel }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`/api/v1/channels/${id}`, editedChannel, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message || i18next.t('errors.editChannelErr'));
  }
});

export const removeChannel = createAsyncThunk('channels/removeChannel', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`/api/v1/channels/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.id;
  } catch (error) {
    return rejectWithValue(error.message || i18next.t('errors.removeChannelErr'));
  }
});

export const fetchChannels = createAsyncThunk('chat/fetchChannels', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/v1/channels', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message || i18next.t('errors.fetchChannelsErr'));
  }
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    currentChannelId: 1,
    status: 'idle',
    error: null,
  },
  reducers: {
    addChannelToStore(state, action) {
      return {
        ...state,
        channels: [...state.channels, action.payload],
      };
    },
    clearChannelError(state) {
      return {
        ...state,
        error: null,
      };
    },
    removeChannelFromStore(state, action) {
      const newChannnels = state.channels.filter((channel) => Number(channel.id) !== Number(action.payload.id));
      return {
        ...state,
        channels: newChannnels,
      };
    },
    renameChannelFromStore(state, action) {
      const updatedChannels = state.channels.map((channel) => Number(channel.id) === Number(action.payload.id) ? { ...channel, ...action.payload } : channel);
      return {
        ...state,
        channels: updatedChannels,
      };
    },
    setCurrentChannelIdStore(state, action) {
      return {
        ...state,
        currentChannelId: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addChannel.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // state.channels.push(action.payload);
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(editChannel.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(editChannel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        /*
        const index = state.channels.findIndex(channel => Number(channel.id) === Number(action.payload.id));
        if (index >= 0) {
          state.channels[index] = action.payload; // Обновление существующего канала
        }
          */
      })
      .addCase(editChannel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeChannel.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        /*
        const index = state.channels.findIndex((channel) => Number(channel.id) === Number(action.payload));
        if (index >= 0) {
          state.channels.splice(index, 1);
        }
          */
      })
      .addCase(removeChannel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchChannels.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.channels = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setCurrentChannelIdStore, clearChannelError, addChannelToStore, removeChannelFromStore, renameChannelFromStore } = channelsSlice.actions;
export default channelsSlice.reducer;
