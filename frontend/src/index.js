import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/store';
import { Notification } from './NotificationComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
// import store from './store/store';
import { io } from 'socket.io-client';
import { addMessage } from './store/messagesSlice';
// import { socket } from './Chat';

const socket = io();

const init = () => {
  
  socket.on('newMessage', (payload) => {
    console.log(`payload in socket.on in init function= ${JSON.stringify(payload, null, 2)}`);
    // store.dispatch(addMessage(payload));
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Notification />
      <App />
    </Provider>
  </React.StrictMode>
);

};

init();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default socket;
