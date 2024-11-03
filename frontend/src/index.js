import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/store';
import { Notification } from './DefaulltComponents/NotificationComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { io } from 'socket.io-client';
import './i18n'
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import rollbarConfig from './rollbar';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
//import Rollbar from 'rollbar';

const socket = io();

function TestError() {
  throw new Error('Test Error!');
}

const init = () => {
  
  socket.on('newMessage', (payload) => {
    //console.log(`payload in socket.on in init function= ${JSON.stringify(payload, null, 2)}`);
    // store.dispatch(addMessage(payload));
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
            <TestError />
          </ErrorBoundary>
        </RollbarProvider>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);
};

/*
// Глобальный обработчик ошибок
window.onerror = function (message, source, lineno, colno, error) {
  rollbar.error(message, { source, lineno, colno, error });
};
*/

init();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default socket;
