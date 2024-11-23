import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Chat from './Pages/Chat';
import Login from './Pages/Login';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import Signup from './Pages/Signup';
import NavbarComponent from './DefaulltComponents/Navbar';
import { setAuthorized, getToken } from './store/authSlice';
import routes from './routes';

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(setAuthorized(true));
    } else {
      dispatch(setAuthorized(false));
    }
  }, [dispatch, token]);

  return (
    <Router>
      <NavbarComponent />
      <Routes>
        <Route path={routes.main()} element={token ? <Chat /> : <Navigate to={routes.login()} replace />} />
        <Route path={routes.login()} element={<Login />} />
        <Route path={routes.home()} element={<Home />} />
        <Route path={routes.signup()} element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
