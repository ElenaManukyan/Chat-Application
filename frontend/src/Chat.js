import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, fetchMessages } from './store/chatSlice';
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
    
    const messages = useSelector((state) => state.chat.messages);
    const channelsStatus = useSelector((state) => state.chat.channelsStatus);
    const error = useSelector((state) => state.chat.error);
    const [ newMessage, setNewMessage ] = useState(''); // []?
    const token = useSelector((state) => state.auth.token);
    const username = useSelector((state) => state.auth.username);

    
    
    

   useEffect(() => {
    //if (channelsStatus === 'idle') {
        dispatch(fetchChannels());
        dispatch(fetchMessages());
    //}

    // Подписка на новые сообщения
    socket.on('newMessage', (payload) => {
        console.log(`payload= ${JSON.stringify(payload, null, 2)}`); // => { body: "new message", channelId: 7, id: 8, username: "admin" }
        // setNewMessage((prevMessages) => [...prevMessages, message]); // Обновление локального состояния
    });

    /*
    return () => {
        socket.off('newMessage');
    };
    */
   }, [dispatch]);


   const channels = useSelector((state) => state.chat.channels);
   // const [ channels, setChannel ] = useState([]);
   console.log(`channels= ${JSON.stringify(channels, null, 2)}`);
   const currentChanelId = channels[0]?.id;

   const handleSendMessage = async () => {
    const message = {
        body: newMessage,
        channelId: currentChanelId,
        username: username,
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

   if (channelsStatus === 'loading') {
    return <div>Загрузка...</div>
   }

   if (channelsStatus === 'failed') {
    return <div>Произошла ошибка: {error}</div>
   }

   if (channels.length === 0) {
        return <p>Загрузка каналов...</p>
   }
   
   
    // console.log(`channels= ${JSON.stringify(channels, null, 2)}`);


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