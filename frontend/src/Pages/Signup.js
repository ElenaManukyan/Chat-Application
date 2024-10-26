import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {

    const { Formik } = formik;

    const validationSchema = yup.object().shape({
        username: yup
            .string()
            .required('Имя пользователя обязательно')
            .min(3, 'Имя пользователя должно содержать минимум 3 символа')
            .max(20, 'Имя пользователя не должно превышать 20 символов'),

        password: yup
            .string()
            .required('Пароль обязателен')
            .min(6, 'Пароль должен содержать минимум 6 символов'),

        confirmPassword: yup
            .string()
            .required('Подтверждение пароля обязательно')
            .oneOf([yup.ref('password'), null], 'Пароли должны совпадать'),
    });

    //const [username, setUsername] = useState('');
    //const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //const error = useSelector((state) => state.auth.error);
    const status = useSelector((state) => state.auth.status);

    
    const handleSubmitClick = async (values) => { 
        //console.log(error);
        //try {  
            dispatch(signup({ username: values.username, password: values.password }))
                .unwrap()
                .then(() => {
                    navigate('/');
                })
                .catch((err) => {
                    
                    if (Number(err.message) === 409) {
                        setError('Такой пользователь уже существует');
                    } else {
                        setError(err.response?.data?.message || err.message);
                    }
                });
    };
    

    const handleClickLogin = () => {
        navigate('/login');
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

                            <h1 className="text-center" style={{ marginBottom: '20px' }}>Регистрация</h1>
                            {status === 'failed' && error && <Alert variant="danger">{error}</Alert>}
                            <Formik
                                validationSchema={validationSchema}
                                onSubmit={handleSubmitClick}
                                initialValues={{
                                    username: '',
                                    password: '',
                                    confirmPassword: '',
                                }}
                                
                            >
                                {({ handleSubmit, handleChange, values, touched, errors }) => (
                                    <Form 
                                        noValidate 
                                        onSubmit={handleSubmit}
                                        
                                    >
                                        <Form.Group
               
                                            controlId="formUsername"
                                            className="position-relative mb-4"
                                        >
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={values.username}
                                                onChange={handleChange}
                                                placeholder="Имя пользователя"
                                                isInvalid={!!errors.username}
                                                style={{ height: '50px' }}
                                            />
                                            <Form.Control.Feedback 
                                                type="invalid"
                                                className="position-absolute"
                                                style={{ top: '100%', margin: 0 }}
                                            >
                                                {errors.username}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group

                                            controlId="formPassword"
                                            className="position-relative mb-4"
                                        >
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                placeholder="Пароль"
                                                isInvalid={!!errors.password}
                                                style={{ height: '50px' }}
                                            />
                                            <Form.Control.Feedback 
                                                type="invalid"
                                                className="position-absolute"
                                                style={{ top: '100%', margin: 0 }}
                                            >
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group
                                            controlId="formConfirmPassword"
                                            className="position-relative"
                                        >
                                            <Form.Control
                                                value={values.confirmPassword}
                                                type="password"
                                                name="confirmPassword"
                                                placeholder="Подтвердите пароль"
                                                onChange={handleChange}
                                                isInvalid={!!errors.confirmPassword}
                                                style={{ height: '50px' }}
                                            />
                                            <Form.Control.Feedback 
                                                type="invalid"
                                                className="position-absolute"
                                                style={{ top: '100%', margin: 0 }}
                                            >
                                                {errors.confirmPassword}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <div className="d-grid">
                                            <Button 
                                                variant="primary" 
                                                type="submit" 
                                                className="mt-4"
                                                style={{ height: '50px' }}
                                            >
                                                Зарегистрироваться
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            Есть аккаунт?
                            <span style={{ marginLeft: '8px' }}>
                                <Card.Link 
                                    onClick={handleClickLogin}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Вход
                                </Card.Link>
                            </span>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container >
    );
};

export default Signup;