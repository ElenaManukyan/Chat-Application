import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import i18next from 'i18next';
import routes from '../routes';

export const getChannels = (state) => state.channels.channels;
export const getCurrentChannelId = (state) => state.channels.currentChannelId;
export const getChannelError = (state) => state.channels.error;

export const addChannel = createAsyncThunk('channels/addChannel', async (newChannel, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(routes.getChannels(), newChannel, {
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
    const response = await axios.patch(`${routes.getChannels()}/${id}`, editedChannel, {
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
    const response = await axios.delete(`${routes.getChannels()}/${id}`, {
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
    const response = await axios.get(routes.getChannels(), {
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
    clearChError(state) {
      return {
        ...state,
        error: null,
      };
    },
    removeChannelFromStore(state, action) {
      const newCh = state.channels.filter((ch) => Number(ch.id) !== Number(action.payload.id));
      return {
        ...state,
        channels: newCh,
      };
    },
    renameChannelFromStore(state, action) {
      const updatedChannels = state.channels.map((channel) => {
        if (Number(channel.id) === Number(action.payload.id)) {
          return { ...channel, ...action.payload };
        }
        return channel;
      });
      return {
        ...state,
        channels: updatedChannels,
      };
    },
    setCurrChIdStore(state, action) {
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
  setCurrChIdStore, clearChError, addChannelToStore, removeChannelFromStore, renameChannelFromStore,
} = channelsSlice.actions;
export default channelsSlice.reducer;
