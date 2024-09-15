import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from "./store/authSlice";
import { useNavigate } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    return (
        <div>
            <h1>Авторизация</h1>
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={async (values, { setSubmitting }) => {
                    // Отправка формы
                    console.log(values);
                    setError(null);
                    try {
                        const response = await axios.post('/api/v1/login', {  
                            username: values.username,  
                            password: values.password,  
                        });
                        console.log(`response= ${JSON.stringify(response, null, 2)}`);
                        const { token } = response.data;  
                        localStorage.setItem('token', token);  
                        dispatch(setToken(token));  
                        navigate('/');
                    } catch (error) {
                        if (error.response) {  
                            setError('Неправильное имя пользователя или пароль');  
                            console.error('Ошибка:', error.response.data); 
                        } else if (error.request) {  
                            setError('Сервер не отвечает. Попробуйте позже.');  
                        } else {  
                            setError('Ошибка при отправке запроса: ' + error.message);  
                        }
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label htmlFor="username">Имя пользователя:</label>
                            <Field id="username" name="username" type="text" />
                            <ErrorMessage name="username" component="div" className="text-danger" />
                        </div>
                        <div>
                            <label htmlFor="password">Пароль:</label>
                            <Field id="password" name="password" type="password" />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Button type="submit" disabled={isSubmitting}>
                            Войти
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;