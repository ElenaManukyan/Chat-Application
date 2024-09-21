import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, fetchMessages } from './store/chatSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const Chat = () => {
    const dispatch = useDispatch();
    const channels = useSelector((state) => state.chat.channels);
    const messages = useSelector((state) => state.chat.messages);
    const chatStatus = useSelector((state) => state.chat.status);
    const error = useSelector((state) => state.chat.error);
    const [ newMessage, setNewMessage ] = useState('');

   useEffect(() => {
    if (chatStatus === 'idle') {
        dispatch(fetchChannels());
        dispatch(fetchMessages());
    }

    // Подписка на новые сообщения
    socket.on('newMessage', (message) => {
        dispatch(fetchMessages()); // Обновляю сообщения при получении нового
    });

    return () => {
        socket.off('newMessage');
    };
   }, [chatStatus, dispatch]);

   const handleSendMessage = async () => {
    const message = {
        body: newMessage,
        channelId: '1', // Тут сделай динамично
        username: 'admin', // Тут тоже динамично сделай
    };

    try {
        await axios.post('/api/v1/messages', message, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        socket.emit('sendMessage', message);
        setNewMessage('');
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
    }
   };

   if (chatStatus === 'loading') {
    return <div>Загрузка...</div>
   }

   if (chatStatus === 'failed') {
    return <div>Произошла ошибка: {error}</div>
   }
   
   const navigate = useNavigate();
   const handleLoginClick = () => {
        console.log('Button clicked!');
        navigate('/login');
    };

    return (  
        <div>  
            <h2>Чат</h2>
            <div>
                <h3>Список каналов</h3>
                {channels.map((channel) => (
                    <div key={channel.id}>{channel.name}</div>
                ))}
            </div>
            <div>
                <h3>Сообщения</h3>
                {messages.map((message) => (
                    <div key={message.id}>
                        <strong>{message.username}</strong> {message.body}
                    </div>
                ))}
            </div>
            <input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Введите сообщение"
            />
            <button type="button" onClick={handleSendMessage}>Отправить</button>
            <button type="button" onClick={handleLoginClick}>Перейти на страницу логина</button>
        </div>  
    );  
};  

export default Chat;