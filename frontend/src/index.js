import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { io } from 'socket.io-client';
// import './i18n';
import i18n from './i18n';
import { addMessageToStore } from './store/messagesSlice';
import {
  addChannelToStore, removeChannelFromStore, renameChannelFromStore, setCurrChIdStore,
} from './store/channelsSlice';
import store from './store/store';
import { Notification } from './DefaulltComponents/NotificationComponent';
import './index.css';
import App from './App';
import rollbarConfig from './rollbar';

const socket = io();

/*
const rollbarConfig = {
  accessToken: '5c1bb74732e54c9a9054a8c03f8aaa96',
  environment: 'testenv',
};
*/

const init = () => {
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

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
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
    </React.StrictMode>,
  );
};

init();
