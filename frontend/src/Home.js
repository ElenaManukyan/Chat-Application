import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div>
            <h1>Главная страница</h1>
            <button onClick={handleLoginClick}>Перейти на страницу логина</button>
        </div>
    );
};

export default Home;