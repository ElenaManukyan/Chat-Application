import React, { useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { useLocation } from 'react-router-dom';  

const Chat = () => {  
    const navigate = useNavigate();  
    // const location = useLocation();  

    useEffect(() => {  
        const token = localStorage.getItem('token');  
        if (!token) {  
            navigate('/login');
        }  
    }, [navigate]);  

    return (  
        <div>  
            <h2>Чат</h2>
        </div>  
    );  
};  

export default Chat;