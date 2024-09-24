import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {

    console.log('Компонент <Home /> рендерится!!!');

    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    //const channels = useSelector((state) => state.chat.channels);
    //console.log(`channels= ${JSON.stringify(channels, null, 2)}`);


    const handleLoginClick = () => {
       // console.log('Button clicked!');
       navigate('/login');
    };

    return (
        <div>
            <h1>Главная страница</h1>
            <div>Добро пожаловать в чат!</div>
            {console.log("Rendering Home component")}
            <button type="button" onClick={handleLoginClick}>Перейти на страницу логина</button>
            <div>Token: {token}</div>
        </div>
    );
};

export default Home;