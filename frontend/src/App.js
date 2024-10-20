import React from 'react';  
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  
import Chat from './Pages/Chat';
import Login from './Pages/Login';
import Home from './Pages/Home';
import NotFound from './Pages/NotFound';
import Signup from './Pages/Signup'

const App = () => {
    const token = localStorage.getItem('token');
    
    return (  
        <Router>  
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