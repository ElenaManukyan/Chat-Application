import React, { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { setAuthorized } from '../store/authSlice';

const LoginForm = () => {
    const [username, setUsername] = useState('');  
    const [password, setPassword] = useState('');  
    const [error, setError] = useState('');  
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isAuthorized = useSelector((state) => state.auth.isAuthorized);
    //console.log(`isAuthorized= ${isAuthorized}`);
    
    useEffect(() => {
        if (!isAuthorized) {
            navigate('/login');
        }
    }, [dispatch, isAuthorized]);

    const handleSubmit = async (e) => {  
        e.preventDefault();   
            dispatch(login({ username, password }))
                .unwrap()
                .then(() => {
                    dispatch(setAuthorized(true));
                    navigate('/');
                })
                .catch((err) => {
                    //console.log(err);
                    const status = err ? Number(err.message.slice(-3)) : null;
                    //console.log(`status= ${status}`);
                    switch (status) {
                        case 401:
                            setError('Проблема с авторизацией: неправильный логин/пароль');
                            break;
                        default:
                            setError(err.response?.data?.message || err.message);
                }})
            
    };
    
    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <Container className="mt-5">
            <Row className="vh-100 d-flex justify-content-center align-items-center">
                <Col md={8} lg={6} xs={12}>
                    <Card 
                        className="shadow"
                        style={{ padding: '5px' }}
                    >
                        <Card.Body>
                            <div className="mb-2 mt-2">
                                <h1 className="text-center" style={{ marginBottom: '20px' }}>Войти</h1>  
                                {error && <Alert variant="danger">{error}</Alert>}  
                                <Form onSubmit={handleSubmit}>  
                                    <Form.Group 
                                        controlId="formUsername"
                                        className="position-relative mb-4"
                                    >    
                                        <Form.Control  
                                            type="text"  
                                            value={username}  
                                            onChange={(e) => setUsername(e.target.value)}  
                                            required
                                            placeholder="Ваш ник"
                                            style={{ height: '50px' }} 
                                        />  
                                    </Form.Group>  
                                    <Form.Group 
                                        controlId="formPassword" 
                                        className="position-relative mb-4"
                                    >  
                                        <Form.Control  
                                            type="password"  
                                            value={password}  
                                            onChange={(e) => setPassword(e.target.value)}  
                                            required
                                            placeholder="Пароль"
                                            style={{ height: '50px' }}
                                        />  
                                    </Form.Group>
                                    <div className="d-grid">
                                        <Button 
                                            variant="primary" 
                                            type="submit" 
                                            className="mt-3"
                                            style={{ height: '50px' }}
                                        >  
                                            Войти  
                                        </Button>
                                    </div> 
                                </Form>
                            </div>
                        </Card.Body>
                        <Card.Footer className="text-center">
                             Нет аккаунта?
                                <span style={{ marginLeft: '8px' }}>
                                    <Card.Link 
                                        onClick={handleSignupClick}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Регистрация
                                    </Card.Link>
                                </span>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );  
};  

export default LoginForm;