import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import initializeApp from './initializeApp';

const app = initializeApp();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(app);
