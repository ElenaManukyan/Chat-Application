import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import App from './App';
import rollbarConfig from './rollbar';
import { Notification } from './DefaulltComponents/NotificationComponent';
import i18n from './i18n';
import { addMessageToStore } from './store/messagesSlice';
import { addChannelToStore, removeChannelFromStore, renameChannelFromStore, setCurrChIdStore } from './store/channelsSlice';
import store from './store/store';
import setupFilters from './setupFilters';

function initializeApp() {
  const socket = io();

  // subscribe new messages
  socket.on('newMessage', (payload) => {
    store.dispatch(addMessageToStore(payload));
  });

  // subscribe new channel
  socket.on('newChannel', (payload) => {
    store.dispatch(addChannelToStore(payload));
  });

  // subscribe remove channel
  socket.on('removeChannel', (payload) => {
    const removedChannelId = payload.id;
    const state = store.getState();

    if (Number(state.channels.currentChannelId) === Number(removedChannelId)) {
      const firstChannelId = state.channels.channels[0].id;
      store.dispatch(setCurrChIdStore(firstChannelId));
    }

    store.dispatch(removeChannelFromStore(payload));
  });

  // subscribe rename channel
  socket.on('renameChannel', (payload) => {
    store.dispatch(renameChannelFromStore(payload));
  });

  // Настройка фильтра нецензурных слов
  setupFilters();

  return (
    <React.StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <RollbarProvider config={rollbarConfig}>
            <ErrorBoundary>
              <Notification />
              <App />
            </ErrorBoundary>
          </RollbarProvider>
        </I18nextProvider>
      </Provider>
    </React.StrictMode>
  );
}

export default initializeApp;
