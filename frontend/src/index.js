import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider, useDispatch } from 'react-redux';
import store from './store/store';
import { Notification } from './DefaulltComponents/NotificationComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { io } from 'socket.io-client';
import './i18n'
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
//import Rollbar from 'rollbar';
import { addMessage } from './store/messagesSlice';
import { addMessageToStore } from './store/messagesSlice';
import { addChannelToStore } from './store/channelsSlice';
import { removeChannelFromStore } from './store/channelsSlice';
import { renameChannelFromStore } from './store/channelsSlice';
import { setCurrentChannelIdInStore } from './store/channelsSlice';


const socket = io();

const rollbarConfig = {
  accessToken: '5c1bb74732e54c9a9054a8c03f8aaa96',
  environment: 'testenv',
};

const init = () => {

  // subscribe new messages
  socket.on('newMessage', (payload) => {
    // console.log(`payload in socket.on in init function= ${JSON.stringify(payload, null, 2)}`);
    store.dispatch(addMessageToStore(payload));
  });

  // subscribe new channel
  socket.on('newChannel', (payload) => {
    // console.log(payload) // { id: 6, name: "new channel", removable: true }
    store.dispatch(addChannelToStore(payload));
  });

  // subscribe remove channel
  socket.on('removeChannel', (payload) => {
    // console.log(payload); // { id: 6 };
    const removedChannelId = payload.id;
    const state = store.getState();
    console.log(`state in socket.on('removeChannel'= ${JSON.stringify(state, null, 2)}`);
    
    if (Number(state.channels.currentChannelId) === Number(removedChannelId)) {
      const firstChannelId = state.channels.channels[0].id;
      store.dispatch(setCurrentChannelIdInStore(firstChannelId));
    }
    
    store.dispatch(removeChannelFromStore(payload));
  });

  // subscribe rename channel
  socket.on('renameChannel', (payload) => {
    //console.log(payload); // { id: 7, name: "new name channel", removable: true }
    store.dispatch(renameChannelFromStore(payload));
  });

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <RollbarProvider config={rollbarConfig}>
            <ErrorBoundary>
              {/*<TestError />*/}
              <Notification />
              {/*<InitComponent />*/}
              <App />
            </ErrorBoundary>
          </RollbarProvider>
        </I18nextProvider>
      </Provider>
    </React.StrictMode>
  );
};

init();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
