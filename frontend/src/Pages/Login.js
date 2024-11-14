import React, { useState, useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { setAuthorized, login, clearAuthError } from '../store/authSlice';
import { useTranslation } from 'react-i18next';
import { showNotification } from '../DefaulltComponents/NotificationComponent';
// import rollbar from '../rollbar';
import { useRollbar } from '@rollbar/react';
import './Signup.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');  
    const [password, setPassword] = useState('');  
    const [error, setError] = useState('');  
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const authError = useSelector((state) => state.auth.error);
    const rollbar = useRollbar();

    useEffect(() => {
        if (authError) {
            try {
                showNotification(authError, 'error');
                dispatch(clearAuthError());
            } catch (authError) {
                rollbar.error('Clear authentification error', authError);
            }
        }
    }, [authError, dispatch]);


    const handleSubmit = async (e) => {  
        e.preventDefault();
        await dispatch(login({ username, password }))
            .unwrap()
            .then(() => {
                dispatch(setAuthorized(true));
                navigate('/');
                
            })
            .catch((err) => {
                rollbar.error('Ошибка при авторизации:', `${t('errors.loginAuthErr')}`);
                console.log(err);
                const status = err ? Number(err.slice(-3)) : null;
                switch (status) {
                    case 401:
                        setError(`${t('errors.loginAuthErr')}`);
                        break;
                    default:
                        setError(`${t('errors.loginAuthErr')}`);
            }});       
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
                                <h1 className="text-center" style={{ marginBottom: '20px' }}>{t('login.enter')}</h1>  
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
                                            placeholder=' '
                                            style={{ height: '50px' }} 
                                        />
                                        <Form.Label className="placeholder1">{t('login.yourNickname')}</Form.Label>
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
                                            placeholder=' '
                                            style={{ height: '50px' }}
                                        />
                                        <Form.Label className="placeholder1">{t('login.password')}</Form.Label>
                                    </Form.Group>
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        style={{ height: '50px', width: '100%' }}
                                    >  
                                        {t('login.enter')}  
                                    </Button>
                                </Form>
                            </div>
                        </Card.Body>
                        <Card.Footer className="text-center">
                             {t('login.doYouHaveAccount')}
                                <span style={{ marginLeft: '8px' }}>
                                    <Card.Link 
                                        onClick={handleSignupClick}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {t('login.signup')}
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