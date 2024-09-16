import React from 'react';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import Chat from './Chat';
import Login from './Login';
import Home from './Home';
import NotFound from './NotFound';

const App = () => {  
    return (  
        <Router>  
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/chat" element={<Chat />} />
                <Route path="*" element={<NotFound />} />                
            </Routes>  
        </Router>  
    );  
};  

export default App;