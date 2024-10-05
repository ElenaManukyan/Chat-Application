import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import { addUsername } from './store/authSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');  
    const [password, setPassword] = useState('');  
    const [error, setError] = useState('');  
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {  
        e.preventDefault();   
        try {  
            const response = await axios.post('/api/v1/login', { username, password }); 
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            navigate('/');
        } catch (err) {
            const status = err.response ? err.response.status : null;
            switch (status) {
                case 401:
                    setError('Проблема с авторизацией: неправильный логин/пароль');
                    break;
                default:
                    setError(err.response?.data?.message || err.message);
            } 
        }  
    };  

    return (
        <Container className="mt-5">  
            <h2>Вход</h2>  
            {error && <Alert variant="danger">{error}</Alert>}  
            <Form onSubmit={handleSubmit}>  
                <Form.Group controlId="formUsername">  
                    <Form.Label>Username:</Form.Label>  
                    <Form.Control  
                        type="text"  
                        value={username}  
                        onChange={(e) => setUsername(e.target.value)}  
                        required  
                    />  
                </Form.Group>  
                <Form.Group controlId="formPassword" className="mt-3">  
                    <Form.Label>Пароль:</Form.Label>  
                    <Form.Control  
                        type="password"  
                        value={password}  
                        onChange={(e) => setPassword(e.target.value)}  
                        required  
                    />  
                </Form.Group>  
                <Button variant="primary" type="submit" className="mt-3">  
                    Войти  
                </Button>  
            </Form>  
        </Container>
    );  
};  

export default LoginForm;