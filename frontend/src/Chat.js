import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, fetchChannels, fetchMessages } from './store/chatSlice';
import { setCurrentChannelId } from './store/channelsSlice';
import AddChannelForm from './AddNewChanel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { Container, Row, Col, ListGroup, Form, Button, Spinner, Alert, Navbar } from 'react-bootstrap';
import './Chat.css';

const socket = io();

const Chat = () => {
    const dispatch = useDispatch();
    const channels = useSelector((state) => state.chat.channels);
    // console.log(`channels= ${JSON.stringify(channels, null, 2)}`);
    const messages = useSelector((state) => state.chat.messages);
    const status = useSelector((state) => state.chat.status);
    const token = useSelector((state) => state.auth.token);
    const username = useSelector((state) => state.auth.username);
    const currentChannelId = useSelector((state) => state.channels.currentChannelId);
    // console.log(`typeof currentChannelId= ${typeof currentChannelId}`);
    // console.log(`typeof channels[0].id= ${typeof channels[0].id}`);
    const [newMessage, setNewMessage] = useState('');
    const [isFormVisible, setFormVisible] = useState(false);
    const navigate = useNavigate();
    const error = useSelector((state) => state.chat.error);

    useEffect(() => {
        dispatch(fetchChannels());
        dispatch(fetchMessages());

        const handleNewMessage = (payload) => {
            dispatch(addMessage(payload));
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [dispatch]);

    const handleSendMessage = async () => {
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
                },
            });
            setNewMessage('');
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
        }
    };

    const handleChannelClick = (id) => {
        dispatch(setCurrentChannelId(id));
    };

    const handleOpenForm = () => {
        setFormVisible(true);
    };

    const handleCloseForm = () => {
        setFormVisible(false);
    };

    const handleLogout = () => {
        // Логика выхода из системы  
        navigate('/login');
    };

    if (status === 'loading') {
        return <Spinner animation="border" />;
    }

    if (status === 'failed') {
        return <Alert variant="danger">Ошибка: {error}</Alert>;
    }

    const getMessageCountText = (count) => {
        if (count === 0) return 'нет сообщений';
        if (count === 1) return 'сообщение';
        if (count > 1 && count < 5) return 'сообщения';
        return 'сообщений';
    };

    return (  
        <Container fluid className="chat-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '0' }}>  
            <Navbar bg="light" expand="lg" style={{ width: '100%', height: '5%', display: 'flex', justifyContent: 'space-between', padding: '0 5%', boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)' }}>   
                <Navbar.Brand>Hexlet Chat</Navbar.Brand>  
                <Navbar.Collapse className="justify-content-end">  
                    <Button variant="primary" onClick={handleLogout}>Выйти</Button>  
                </Navbar.Collapse>  
            </Navbar>  
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>  
                <Row style={{ height: '88vh', width: '88vw', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)', borderRadius: '8px' }}>  
                    <Col xs={3} className="channels" style={{ maxHeight: '100%', overflowY: 'auto', borderRight: '1px solid #dee2e6' }}>  
                        <div className="d-flex justify-content-between align-items-center mt-2">  
                            <h5 className="mb-0">Каналы</h5>  
                            <Button onClick={handleOpenForm} variant="outline-primary" size="sm">+</Button>  
                        </div>  
                        <ListGroup className="mt-2">  
                            {channels.map((channel) => (  
                                <ListGroup.Item  
                                    key={channel.id}  
                                    onClick={() => handleChannelClick(Number(channel.id))}  
                                    active={currentChannelId === Number(channel.id)}  
                                >  
                                    #{channel.name}  
                                </ListGroup.Item>  
                            ))}  
                        </ListGroup>  
                        {isFormVisible && (  
                            <div className="mt-2">  
                                <AddChannelForm />  
                                <Button onClick={handleCloseForm} variant="secondary">Закрыть</Button>  
                            </div>  
                        )}  
                    </Col>  
                    <Col xs={9} className="messages" style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>  
                        <h5>  
                            #{channels.find(channel => Number(channel.id) === currentChannelId)?.name || 'Выберите канал'}  
                        </h5>  
                        <div>  
                            {Array.isArray(messages) ? messages.filter(message => Number(message.channelId) === currentChannelId).length : null}  
                            {getMessageCountText(messages.filter(message => Number(message.channelId) === currentChannelId).length)}  
                        </div>  
                        <div className="message-list" style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>  
                            {messages.map((message) =>  
                                Number(message.channelId) === currentChannelId ? (  
                                    <div key={message.id} className="message">  
                                        <strong>{message.username}</strong>: {message.body}  
                                    </div>  
                                ) : null  
                            )}  
                        </div>  
                        <Form className="message-input">  
                            <Form.Group>  
                                <Form.Control  
                                    type="text"  
                                    value={newMessage}  
                                    onChange={(e) => setNewMessage(e.target.value)}  
                                    placeholder="Введите сообщение..."  
                                />  
                            </Form.Group>  
                            <Button onClick={handleSendMessage} variant="primary">Отправить</Button>  
                        </Form>  
                    </Col>  
                </Row>  
            </div>  
        </Container>  
    );
};

export default Chat;