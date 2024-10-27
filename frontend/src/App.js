import React, { useEffect, useState } from 'react';  
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';  
import Chat from './Pages/Chat';
import Login from './Pages/Login';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import Signup from './Pages/Signup';
import NavbarComponent from './DefaulltComponents/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthorized } from './store/authSlice';

const App = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

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
                <Route path="/" element={token ? <Chat /> : <Navigate to="/login" replace /> } />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<NotFound />} />                
            </Routes>  
        </Router>  
    );  
};

export default App;