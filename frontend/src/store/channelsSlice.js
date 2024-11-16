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
      const newCh = state.channels.filter((channel) => Number(channel.id) !== Number(action.payload.id));
      return {
        ...state,
        channels: newCh,
      };
    },
    renameChannelFromStore(state, action) {
      const updatedChannels = state.channels.map((channel) => {
        if (Number(channel.id) === Number(action.payload.id)) {
          return { ...channel, ...action.payload };
        } else {
          return channel;
        }
      });
      return {
        ...state,
        channels: updatedChannels,
      };
    },
    setCurrChannelIdStore(state, action) {
      return {
        ...state,
        currentChannelId: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addChannel.pending, (state) => ({
        ...state,
        status: 'loading',
        error: null,
      }))
      .addCase(addChannel.fulfilled, (state) => ({
        ...state,
        status: 'succeeded',
      }))
      .addCase(addChannel.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload,
      }))
      .addCase(editChannel.pending, (state) => ({
        ...state,
        status: 'loading',
        error: null,
      }))
      .addCase(editChannel.fulfilled, (state) => ({
        ...state,
        status: 'succeeded',
      }))
      .addCase(editChannel.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload,
      }))
      .addCase(removeChannel.pending, (state) => ({
        ...state,
        status: 'loading',
        error: null,
      }))
      .addCase(removeChannel.fulfilled, (state) => ({
        ...state,
        status: 'succeeded',
      }))
      .addCase(removeChannel.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload,
      }))
      .addCase(fetchChannels.pending, (state) => ({
        ...state,
        status: 'loading',
        error: null,
      }))
      .addCase(fetchChannels.fulfilled, (state, action) => ({
        ...state,
        status: 'succeeded',
        channels: action.payload,
      }))
      .addCase(fetchChannels.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload,
      }));
  },
});

export const {
  setCurrChannelIdStore, clearChannelError, addChannelToStore, removeChannelFromStore, renameChannelFromStore,
} = channelsSlice.actions;
export default channelsSlice.reducer;
