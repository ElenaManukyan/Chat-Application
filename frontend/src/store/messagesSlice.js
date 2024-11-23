import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import i18next from 'i18next';

export const getMessages = (state) => state.messages.messages;
export const getMessagesStatus = (state) => state.messages.status;
export const getMessagesError = (state) => state.messages.error;

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/api/v1/messages', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message || i18next.t('errors.fetchMessagesErr'));
  }
});

export const addMessage = createAsyncThunk('chat/addMessage', async (newMessage, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    // console.log(`token fetchData= ${JSON.stringify(token, null, 2)}`);
    const response = await axios.post('/api/v1/messages', newMessage, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message || i18next.t('errors.addMessageErr'));
  }
});

export const removeMessage = createAsyncThunk('chat/removeMessage', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`/api/v1/messages/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message || i18next.t('errors.removeMessageErr'));
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addMessageToStore(state, action) {
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    },
    clearMessageError(state) {
      return {
        ...state,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => ({
        ...state,
        status: 'loading',
        error: null,
      }))
      .addCase(fetchMessages.fulfilled, (state, action) => ({
        ...state,
        status: 'succeeded',
        messages: action.payload,
      }))
      .addCase(fetchMessages.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload,
      }))
      .addCase(addMessage.pending, (state) => ({
        ...state,
        status: 'loading',
        error: null,
      }))
      .addCase(addMessage.fulfilled, (state) => ({
        ...state,
        status: 'succeeded',
      }))
      .addCase(addMessage.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload,
      }))
      .addCase(removeMessage.pending, (state) => ({
        ...state,
        status: 'loading',
        error: null,
      }))
      .addCase(removeMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex((m) => Number(m.id) === Number(action.payload.id));
        if (index >= 0) {
          return {
            ...state,
            status: 'succeeded',
            messages: [
              ...state.messages.slice(0, index),
              ...state.messages.slice(index + 1),
            ],
          };
        }
        return state;
      })
      .addCase(removeMessage.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload,
      }));
  },
});

export const { addMessageToStore, clearMessageError } = chatSlice.actions;

export default chatSlice.reducer;
