import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
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
            dispatch(login({ username, password }));
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
    
    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <Container className="mt-5">
            <Row className="vh-100 d-flex justify-content-center align-items-center">
                <Col md={8} lg={6} xs={12}>
                    <Card className="shadow">
                        <Card.Body>
                            <div className="mb-2 mt-2">
                                <h1 className="text-center" style={{ marginBottom: '20px' }}>Войти</h1>  
                                {error && <Alert variant="danger">{error}</Alert>}  
                                <Form onSubmit={handleSubmit}>  
                                    <Form.Group controlId="formUsername">    
                                        <Form.Control  
                                            type="text"  
                                            value={username}  
                                            onChange={(e) => setUsername(e.target.value)}  
                                            required
                                            placeholder="Ваш ник"  
                                        />  
                                    </Form.Group>  
                                    <Form.Group controlId="formPassword" className="mt-3">  
                                        <Form.Control  
                                            type="password"  
                                            value={password}  
                                            onChange={(e) => setPassword(e.target.value)}  
                                            required
                                            placeholder="Пароль"
                                        />  
                                    </Form.Group>
                                    <div className="d-grid">
                                        <Button variant="primary" type="submit" className="mt-4">  
                                            Войти  
                                        </Button>
                                    </div> 
                                </Form>
                            </div>
                        </Card.Body>
                        <Card.Footer className="text-center">
                             Нет аккаунта?
                                <span style={{ marginLeft: '8px' }}>
                                    <Card.Link onClick={handleSignupClick} href="#">Регистрация</Card.Link>
                                </span>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );  
};  

export default LoginForm;