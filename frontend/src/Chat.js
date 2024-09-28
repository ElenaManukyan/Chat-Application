import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from './store/chatSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io();

const Chat = () => {

    const navigate = useNavigate();
   const handleLoginClick = () => {
        // console.log('Button clicked!');
        navigate('/login');
    };

    const dispatch = useDispatch();
    
    //const messages = useSelector((state) => state.chat.messages);
    const status = useSelector((state) => state.chat.status);
    const error = useSelector((state) => state.chat.error);
    const [ newMessage, setNewMessage ] = useState([]); // []?
    const token = useSelector((state) => state.auth.token);
    const username = useSelector((state) => state.auth.username);
    console.log(`token= ${JSON.stringify(token, null, 2)}`); 

   useEffect(() => {
        dispatch(fetchData());
    // Подписка на новые сообщения
    socket.on('newMessage', (payload) => {
        console.log(`payload= ${JSON.stringify(payload, null, 2)}`); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
    });
   }, [dispatch]);

   const data = useSelector((state) => state.chat.data);
   console.log(`data= ${JSON.stringify(data, null, 2)}`);

   const channels = data.channels;
   console.log(`channels= ${JSON.stringify(channels, null, 2)}`);
   const currentChanelId = channels ? channels[0]?.id : null;
   const messages = data.messages;
   console.log(`messages= ${JSON.stringify(messages, null, 2)}`);

   useEffect(() => {
        console.log(`Data fetched: ${JSON.stringify(data, null, 2)}`);  
    }, [data]);

   const handleSendMessage = async () => {
    console.log(`newMessage= ${JSON.stringify(newMessage, null, 2)}`);
    
    // newMessage не отправляется на сервер!!!

    const message = {
        body: newMessage,
        channelId: currentChanelId,
        username: username,  // HERE!!!
    };

    try {
        await axios.post('/api/v1/messages', message, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // socket.emit('sendMessage', message);
        setNewMessage('');
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
    }
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

/*
   if (channels.length === 0) {
        return <p>Загрузка каналов...</p>
   }
*/
   
   
    // console.log(`channels= ${JSON.stringify(channels, null, 2)}`);


    return (  
        <div>  
            <h2>Чат</h2>
            <div>
                <h3>Список каналов</h3>
                {channels ? (channels.map((channel) => (
                    <div key={channel.id}>{channel.name}</div>
                ))) : null}
            </div>
            <div>
                <h3>Сообщения</h3>
                {messages ? (messages.map((message) => (
                    <div key={message.id}>
                        <strong>{message.username}</strong> {message.body}
                    </div>
                ))) : null}
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