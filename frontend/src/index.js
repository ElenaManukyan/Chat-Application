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
import io from 'socket.io-client';
import { addMessage } from './store/messagesSlice';




const init = () => {
  const socket = io();

  socket.on('newMessage', (payload) => {
    store.dispatch(addMessage(payload));
  });
 
  /*
  useEffect(() => {
    const handleNewMessage = (payload) => {
        store.dispatch(addMessage(payload));
    };
     socket.on('newMessage', handleNewMessage);
    return () => {
        socket.off('newMessage', handleNewMessage);
    };
}, []);
*/



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

// init();

export default init;
