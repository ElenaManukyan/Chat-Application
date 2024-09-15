import React from "react";
import { Formik, Form, Field } from "formik";

const Login = () => {
    return (
        <div>
            <h1>Авторизация</h1>
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={(values) => {
                    // Отправка формы
                    console.log(values);
                }}
            >
                {() => (
                    <Form>
                        <div>
                            <label htmlFor="username">Имя пользователя:</label>
                            <Field name="username" type="text" />
                        </div>
                        <div>
                            <label htmlFor="password">Пароль:</label>
                            <Field name="password" type="password" />
                        </div>
                        <button type="submit">Войти</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Login;