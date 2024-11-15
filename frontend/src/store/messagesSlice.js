import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import i18next from 'i18next';

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
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addMessage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // state.messages.push(action.payload);
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeMessage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.messages.findIndex((message) => Number(message.id) === Number(action.payload.id));
        if (index >= 0) {
          state.messages.splice(index, 1);
        }
      })
      .addCase(removeMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addMessageToStore, clearMessageError } = chatSlice.actions;

export default chatSlice.reducer;
