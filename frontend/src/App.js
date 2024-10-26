import React from 'react';  
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';  
import Chat from './Pages/Chat';
import Login from './Pages/Login';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import Signup from './Pages/Signup';
import NavbarComponent from './DefaulltComponents/Navbar';
import { useSelector } from 'react-redux';

const App = () => {
    const token = localStorage.getItem('token');
    // console.log(`token= ${token}`);

    
    
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