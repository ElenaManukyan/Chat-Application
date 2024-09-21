import React from 'react';  
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  
import Chat from './Chat';
import Login from './Login';
import Home from './Home';
import NotFound from './NotFound';

const App = () => {
    const token = localStorage.getItem('token');
    console.log(`token= ${JSON.stringify(token, null, 2)}`);
    
    return (  
        <Router>  
            <Routes>
                <Route path="/" element={token ? <Chat /> : <Navigate to="/login" replace /> } />
                <Route path="/login" element={<Login />} /> 
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<NotFound />} />                
            </Routes>  
        </Router>  
    );  
};

export default App;