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
            const response = axios.post('/api/v1/login', { username: 'admin', password: 'admin' });
            /*await fetch('/api/login', {  
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json',  
                },  
                body: JSON.stringify({ username, password }),  
            });*/

            if (!response.ok) {  
                throw new Error('Ошибка входа');
            }  

            const data = await response.json();  
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (err) {  
            setError(err.message);  
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