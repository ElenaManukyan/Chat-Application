import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import initializeApp from './initializeApp';

/*
const rollbarConfig = {
  accessToken: '5c1bb74732e54c9a9054a8c03f8aaa96',
  environment: 'testenv',
};
*/

const app = initializeApp();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(app);
