import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, fetchMessages } from './store/chatSlice';
import { useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';  
// import { useLocation } from 'react-router-dom';  

const Chat = () => {
    const dispatch = useDispatch();
    const channels = useSelector((state) => state.chat.channels);
    const messages = useSelector((state) => state.chat.messages);
    const chatStatus = useSelector((state) => state.chat.status);
    const error = useSelector((state) => state.chat.error);

   useEffect(() => {
    if (chatStatus === 'idle') {
        dispatch(fetchChannels());
        dispatch(fetchMessages());
    }
   }, [chatStatus, dispatch]);

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
            <button type="button" onClick={handleLoginClick}>Перейти на страницу логина</button>
        </div>  
    );  
};  

export default Chat;