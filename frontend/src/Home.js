import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {

    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    const handleLoginClick = () => {
       navigate('/login');
       // navigate('/');
    };

    return (
        <div>
            <h1>Главная страница</h1>
            <div>Добро пожаловать в чат!</div>
            <button onClick={handleLoginClick}>Перейти на страницу логина</button>
            <div>Token: {token}</div>
        </div>
    );
};

export default Home;