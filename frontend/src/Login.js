import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {  
    const [username, setUsername] = useState('');  
    const [password, setPassword] = useState('');  
    const [error, setError] = useState('');  
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {  
        e.preventDefault();   
        try {  
            const response = await axios.post('/api/v1/login', { username, password }); 
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (err) {  
            setError(err.response?.data?.message || err.message);  
        }  
    };  

    return (  
        <form onSubmit={handleSubmit}>  
            <h2>Вход</h2>  
            {error && <p style={{ color: 'red' }}>{error}</p>}  
            <div>  
                <label>  
                    Username:  
                    <input  
                        type="text"  
                        value={username}  
                        onChange={(e) => setUsername(e.target.value)}  
                        required  
                    />  
                </label>  
            </div>  
            <div>  
                <label>  
                    Пароль:  
                    <input  
                        type="password"  
                        value={password}  
                        onChange={(e) => setPassword(e.target.value)}  
                        required  
                    />  
                </label>  
            </div>  
            <button type="submit">Войти</button>  
        </form>  
    );  
};  

export default LoginForm;