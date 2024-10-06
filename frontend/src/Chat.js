import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, fetchMessages } from './store/chatSlice';
import { fetchChannels } from './store/channelsSlice';
import { setCurrentChannelId } from './store/channelsSlice';
import AddChannelForm from './AddNewChanel';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { Container, Row, Col, ListGroup, Form, Button, Spinner, Alert, Navbar } from 'react-bootstrap';
import './Chat.css';
import { addChannel } from './store/channelsSlice';
import ChannelCreationNotification from './NotificationComponent';

const socket = io();

const Chat = () => {
    const dispatch = useDispatch();
    const channels = useSelector((state) => state.channels.channels);
    // console.log(`channels= ${JSON.stringify(channels, null, 2)}`);
    const messages = useSelector((state) => state.chat.messages);
    const status = useSelector((state) => state.chat.status);
    const token = useSelector((state) => state.auth.token);
    const username = useSelector((state) => state.auth.username);
    const currentChannelId = useSelector((state) => state.channels.currentChannelId);
    // console.log(`typeof currentChannelId= ${typeof currentChannelId}`);
    // console.log(`typeof channels[0].id= ${typeof channels[0].id}`);
    const [newMessage, setNewMessage] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const error = useSelector((state) => state.chat.error);
    // const [isNotificationVisible, setNotificationVisible] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

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

    useEffect(() => {
        if (showNotification) {
            console.log(`showNotification= ${showNotification}`);

        }
    }, [showNotification]);

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

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    

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
        if (count === 0) return ' сообщений';
        if (count === 1) return ' сообщение';
        if (count > 1 && count < 5) return ' сообщения';
        return ' сообщений';
    };

    const handleAddChannel = (channelName) => {
        const newChannel = { id: Date.now(), name: channelName, removable: true };
        dispatch(addChannel(newChannel));
        setShowNotification(true);
        
        
        // setShowNotification(false);
        // return newChannel;
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
                            <Button onClick={handleOpenModal} variant="outline-primary" size="sm">+</Button>
                        </div>
                        <ListGroup className="mt-2">
                            {Array.isArray(channels) ? channels.map((channel) => (
                                <ListGroup.Item
                                    key={channel.id}
                                    onClick={() => handleChannelClick(Number(channel.id))}
                                    active={currentChannelId === Number(channel.id)}
                                >
                                    #{channel.name}
                                </ListGroup.Item>
                            )) : null}
                        </ListGroup>

                        <AddChannelForm
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            onSubmit={handleAddChannel}
                            existingChannels={channels.map((ch) => ch.name)}
                        />
                    </Col>
                    <Col xs={9} className="messages" style={{ maxHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                        <h5>
                            #{channels.find(channel => Number(channel.id) === currentChannelId)?.name || 'Выберите канал'}
                        </h5>
                        <div>
                            {Array.isArray(messages) ? messages.filter(message => Number(message.channelId) === currentChannelId).length : null}
                            {Array.isArray(messages) ? getMessageCountText(messages.filter(message => Number(message.channelId) === currentChannelId).length) : null}
                        </div>
                        <div className="message-list" style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                            {Array.isArray(messages) ? messages.map((message) =>
                                Number(message.channelId) === currentChannelId ? (
                                    <div key={message.id} className="message">
                                        <strong>{message.username}</strong>: {message.body}
                                    </div>
                                ) : null
                            ) : null}
                        </div>
                        <Form className="message-input">
                            <Form.Group className="d-flex align-items-center">
                                <Form.Control
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Введите сообщение..."
                                    className="me-2"
                                />
                                <Button onClick={handleSendMessage} variant="primary">Отправить</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </div>
            <ChannelCreationNotification
                show={showNotification}
                onClose={() => setShowNotification(false)}
            />
        </Container>
    );
};

export default Chat;