import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getToken } from '../store/authSlice';

const Home = () => {
  const navigate = useNavigate();
  const token = useSelector(getToken);
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Главная страница</h1>
      <div>Добро пожаловать в чат!</div>
      <button type="button" onClick={handleLoginClick}>
        Перейти на страницу логина
      </button>
      <div>
        Token:
        <span>{token}</span>
      </div>
    </div>
  );
};

export default Home;
