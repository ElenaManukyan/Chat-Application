import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, fetchData } from './store/chatSlice';
import { setCurrentChannelId } from './store/channelsSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io();

const Chat = () => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.chat.data);
    console.log(`data= ${JSON.stringify(data, null, 2)}`);
    const status = useSelector((state) => state.chat.status);
    const token = useSelector((state) => state.auth.token);
    // console.log(`token= ${JSON.stringify(token, null, 2)}`); 
    const username = useSelector((state) => console.log(`state.auth.username= ${JSON.stringify(state.auth.username, null, 2)}`)); // NULL!
    console.log(`username= ${username}`);
   // const channels = Array.isArray(data.channels) ? data.channels : [];
   const channels = data.channels.length !== 0 ? data.channels : [];
   // console.log(`channels= ${JSON.stringify(channels, null, 2)}`);
   // const channelId = channels[0]?.id;
   const currentChannelId = useSelector((state) => state.channels.currentChannelId) || 1;
   // const messages = Array.isArray(data.messages) ? data.messages : [];
   const messages = data.messages.length !== 0 ? data.messages : [];
   // console.log(`messages= ${JSON.stringify(messages, null, 2)}`);
    const [ newMessage, setNewMessage ] = useState('');


    const navigate = useNavigate();
    const handleLoginClick = () => {
        // console.log('Button clicked!');
        navigate('/login');
    };
    const error = useSelector((state) => state.chat.error);
    useEffect(() => {
        dispatch(fetchData());

        const handleNewMessage = (payload) => {
            // dispatch(addMessage(payload));
            console.log(`Новое сообщение: ${JSON.stringify(payload, null, 2)}`);
        };

        // Подписка на новые сообщения
        // socket.on('newMessage', handleNewMessage);
        socket.on('newMessage', handleNewMessage);

        return () => {
            // socket.off('newMessage', handleNewMessage);
            socket.off('newMessage', handleNewMessage);
        };
    }, [dispatch]);

   const handleSendMessage = async () => {
        // console.log(`newMessage= ${JSON.stringify(newMessage, null, 2)}`);
        if (!newMessage.trim()) {
            return;
        }
        const message = {
            body: newMessage,
            channelId: currentChannelId,
            username: username,
        };

        try {
            await axios.post('/api/v1/messages', message, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    /*Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcyNzYxOTE4M30.-ptNPLK4G9fA571YS07aRSXUIaSL7SR51RkaLPRIdVk',*/
                },
            });
            dispatch(addMessage(message));
            // socket.emit('newMessage', message);
            setNewMessage('');
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
        }
   };

   const handleChannelClick = (id) => {
        console.log(`handleChannelClick id= ${id}`);
        console.log(`handleChannelClick currentChannelId= ${currentChannelId}`);
        dispatch(setCurrentChannelId(id));
   };

   if (status === 'loading') {
    return <div>Загрузка...</div>
   }

   if (status === 'failed') {
    return <div>Произошла ошибка: {error}</div>
   }

    if (status === 'failed') {  
        console.error(`Error: ${error}`); // Логируем ошибку  
        return <div>Произошла ошибка: {error}</div>;  
    }

    return (  
        <div>  
            <h2>Чат</h2>
            <div>
                <h3>Список каналов</h3>
                <ul>
                    {channels.map((channel) => (
                        <li 
                            key={channel.id} 
                            onClick={() => handleChannelClick(channel.id)}
                            style={{ fontWeight: currentChannelId === channel.id ? 'bold' : 'normal' }}>
                                #{channel.name}
                        </li>
                    ))}
                </ul>
                <button type="button">Добавить канал</button>
            </div>
            <div>  
                <h3>Сообщения</h3>  
                {messages.map((message) =>   
                    message.channelId === currentChannelId ? (  
                        <div key={message.id}>  
                            <strong>{message.username}</strong> {message.body}  
                        </div>  
                    ) : null 
                )}  
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